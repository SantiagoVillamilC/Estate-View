import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import Papa from 'papaparse';

const PieChartType = () => {
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

  const typeCount = csvData.reduce((acc, row) => {
    acc[row.Type] = (acc[row.Type] || 0) + 1;
    return acc;
  }, {});

  const labelsMap = {
    'br': 'Habitaciones (br)',
    'h': 'Casa, cabaña, villa, semi, terraza (h)',
    'u': 'Unidad, dúplex (u)',
    't': 'Casa adosada (t)'
  };

  const data = {
    labels: Object.keys(typeCount).map(key => labelsMap[key] || key),
    datasets: [
      {
        data: Object.values(typeCount),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          color: '#E3E3E3'
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || '';
            return `${label}: ${value}`;
          }
        }
      }
    }
  };

  return (
    <div>
      <h4>Distribución de Tipos de Propiedades</h4>
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChartType;
