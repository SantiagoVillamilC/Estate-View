import React, { useEffect, useState } from 'react';
import { Radar } from 'react-chartjs-2';
import Papa from 'papaparse';

const RadarChart = () => {
  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/Melbourne_housing_FULL.csv');
      const reader = response.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder('utf-8');
      const csv = decoder.decode(result.value);

      Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          setCsvData(results.data);
        },
      });
    };

    fetchData();
  }, []);

  // Procesar datos para obtener información por región
  const regionData = csvData.reduce((acc, row) => {
    const region = row.Regionname;
    const price = parseFloat(row.Price) || 0;
    const distance = parseFloat(row.Distance) || 0;
    const landSize = parseFloat(row.Landsize) || 0;
    const type = row.Type || 'Unknown';

    if (!acc[region]) {
      acc[region] = { price: 0, distance: 0, landSize: 0, typeCount: {}, count: 0 };
    }

    acc[region].price += price;
    acc[region].distance += distance;
    acc[region].landSize += landSize;
    acc[region].typeCount[type] = (acc[region].typeCount[type] || 0) + 1;
    acc[region].count += 1;

    return acc;
  }, {});

  const labels = ['Precio promedio ($AUD)', 'Distancia al CBD (km)', 'Tamaño del terreno (m²)', 'Tipo de vivienda (cantidad)'];

  const data = {
    labels,
    datasets: Object.keys(regionData).map((region, index) => ({
      label: region,
      data: [
        regionData[region].price / regionData[region].count,
        regionData[region].distance / regionData[region].count,
        regionData[region].landSize / regionData[region].count,
        Object.keys(regionData[region].typeCount).length, // Cantidad de tipos de vivienda
      ],
      backgroundColor: `rgba(${100 + index * 20}, ${150 + index * 15}, 200, 0.2)`,
      borderColor: `rgba(${100 + index * 20}, ${150 + index * 15}, 200, 1)`,
      borderWidth: 1,
    })),
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        suggestedMin: 0,
        suggestedMax: Math.max(
          ...Object.keys(regionData).map(
            (region) => regionData[region].price / regionData[region].count
          )
        ) * 1.1, // Ajustar escala en función del precio máximo promedio
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'black',
          padding: 20,
          font: {
            size: 14,
            family: 'Arial',
          },
        },
      },
    },
  };

  return (
    <div>
      <h2>Comparación de Precios, Distancia y Tamaño del Terreno por Región</h2>
      <Radar data={data} options={options} />
    </div>
  );
};

export default RadarChart;
