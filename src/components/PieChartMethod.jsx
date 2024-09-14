import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import Papa from 'papaparse';

const PieChartMethod = () => {
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

  const methodCount = csvData.reduce((acc, row) => {
    acc[row.Method] = (acc[row.Method] || 0) + 1;
    return acc;
  }, {});

  const labelsMap = {
    'S': 'Propiedad vendida',
    'SP': 'Propiedad vendida antes de la subasta',
    'PI': 'Propiedad retirada',
    'PN': 'Vendida antes sin divulgar',
    'SN': 'Vendida no divulgada',
    'NB': 'Sin oferta',
    'VB': 'Oferta del vendedor',
    'W': 'Retirada antes de la subasta',
    'SA': 'Vendida después de la subasta',
    'SS': 'Vendida después con precio no divulgado',
    'N/A': 'Precio o mayor oferta no disponible'
  };

  const data = {
    labels: Object.keys(methodCount).map(key => labelsMap[key] || key),
    datasets: [
      {
        data: Object.values(methodCount),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          color: '#E3E3E3' // Cambia el color del texto de la leyenda
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
      <h4>Distribución por Método de Venta</h4>
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChartMethod;
