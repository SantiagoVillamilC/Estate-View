import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import Papa from 'papaparse';

const Histogram = () => {
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

  // Obtener los precios y categorizar
  const priceCategories = csvData.reduce((acc, row) => {
    const price = parseFloat(row.Price);
    if (price < 500000) acc['< 500K'] += 1;
    else if (price < 1000000) acc['500K - 1M'] += 1;
    else if (price < 1500000) acc['1M - 1.5M'] += 1;
    else if (price < 2000000) acc['1.5M - 2M'] += 1;
    else acc['> 2M'] += 1;
    return acc;
  }, { '< 500K': 0, '500K - 1M': 0, '1M - 1.5M': 0, '1.5M - 2M': 0, '> 2M': 0 });

  const data = {
    labels: Object.keys(priceCategories),
    datasets: [
      {
        label: 'Número de Propiedades',
        data: Object.values(priceCategories),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  return (
    <div>
      <h2>Distribución de Precios de las Propiedades</h2>
      <Bar data={data} />
    </div>
  );
};

export default Histogram;
