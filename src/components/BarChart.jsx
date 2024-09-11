import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import Papa from 'papaparse';

const BarChart = () => {
  const [csvData, setCsvData] = useState([]);

  // Función para cargar y procesar el archivo CSV
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
          if (results && results.data) {
            setCsvData(results.data); // Guardar los datos del CSV en el estado
          }
        },
      });
    };

    fetchData();
  }, []);

  // Procesar los datos del CSV para el gráfico de barras
  const processChartData = () => {
    const typeData = {};
    csvData.forEach((item) => {
      if (item.Type && item.Price) {
        if (!typeData[item.Type]) {
          typeData[item.Type] = { total: 0, count: 0 };
        }
        typeData[item.Type].total += parseFloat(item.Price) || 0;
        typeData[item.Type].count += 1;
      }
    });

    // Crear datos para el gráfico de barras
    const labels = Object.keys(typeData);
    const data = labels.map((type) => typeData[type].total / typeData[type].count);

    return {
      labels,
      datasets: [
        {
          label: 'Precio promedio',
          data,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div>
      {csvData.length > 0 ? (
        <Bar
          data={processChartData()}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Precio promedio por tipo de propiedad',
              },
            },
          }}
        />
      ) : (
        <p>Cargando archivo CSV...</p>
      )}
    </div>
  );
};

export default BarChart;
