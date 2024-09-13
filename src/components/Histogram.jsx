import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const Histogram = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/Melbourne_housing_FULL.csv');
        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder('utf-8');
        const csv = decoder.decode(result.value);

        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const processedData = results.data
              .map(row => parseFloat(row.Price))
              .filter(price => !isNaN(price));

            setData(processedData);
            setLoading(false);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error('Error fetching CSV:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const priceRanges = Array.from({ length: 10 }, (_, i) => i * 100000);
  const priceCounts = priceRanges.map(range =>
    data.filter(price => price >= range && price < range + 100000).length
  );

  const chartData = {
    labels: priceRanges.map(range => `$${range} - $${range + 100000}`),
    datasets: [
      {
        label: 'Cantidad de Propiedades',
        data: priceCounts,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Rangos de Precio ($)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Cantidad de Propiedades'
        }
      }
    }
  };

  if (loading) {
    return <p>Cargando datos para el gráfico...</p>;
  }

  return (
    <div>
      <h2>Histograma de Precios de Propiedades</h2>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default Histogram;
