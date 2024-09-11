import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import Papa from 'papaparse';

const LineChart = () => {
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

  const data = {
    labels: csvData.map((row) => row.Date).slice(0, 50), // Tomando los primeros 50 registros
    datasets: [
      {
        label: 'Precio de Propiedades',
        data: csvData.map((row) => row.Price).slice(0, 50),
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  return (
    <div>
      <h2>Tendencia de Precios a lo Largo del Tiempo</h2>
      <Line data={data} />
    </div>
  );
};

export default LineChart;
