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

  const regionData = csvData.reduce((acc, row) => {
    const region = row.Regionname;
    if (!acc[region]) acc[region] = { rooms: 0, bathrooms: 0, car: 0, count: 0 };
    acc[region].rooms += parseFloat(row.Rooms);
    acc[region].bathrooms += parseFloat(row.Bathroom);
    acc[region].car += parseFloat(row.Car);
    acc[region].count += 1;
    return acc;
  }, {});

  const labels = Object.keys(regionData);
  const data = {
    labels: ['Habitaciones', 'Baños', 'Espacios de estacionamiento'],
    datasets: labels.map((region) => ({
      label: region,
      data: [
        regionData[region].rooms / regionData[region].count,
        regionData[region].bathrooms / regionData[region].count,
        regionData[region].car / regionData[region].count,
      ],
      backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255
      )}, ${Math.floor(Math.random() * 255)}, 0.2)`,
      borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255
      )}, ${Math.floor(Math.random() * 255)}, 1)`,
      borderWidth: 1,
    })),
  };

  return (
    <div>
      <h2>Comparación de Características por Región</h2>
      <Radar data={data} />
    </div>
  );
};

export default RadarChart;
