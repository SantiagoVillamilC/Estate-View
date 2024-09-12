import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Scatter } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';

Chart.register(...registerables);

const ScatterPlot = () => {
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
            const processedData = results.data.map(row => {
              const distance = parseFloat(row.Distance);
              const price = parseFloat(row.Price);
              
              // Verificar que los valores sean números válidos
              if (!isNaN(distance) && !isNaN(price)) {
                return { distance, price };
              } else {
                console.warn('Fila con datos inválidos:', row);
                return null; // Ignorar filas inválidas
              }
            }).filter(row => row !== null);

            console.log('Datos procesados:', processedData); // Para depuración

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

  const chartData = {
    datasets: [
      {
        label: 'Precio vs. Distancia al CBD',
        data: data.map(row => ({ x: row.distance, y: row.price })), // Cambiamos la estructura a {x, y}
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        pointRadius: 5
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Distancia: ${context.raw.x} km, Precio: $${context.raw.y}`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'Distancia al CBD (km)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Precio en $'
        }
      }
    }
  };

  if (loading) {
    return <p>Cargando datos para el gráfico...</p>;
  }

  return (
    <div>
      <h2>Gráfico de Dispersión: Precio vs. Distancia al CBD</h2>
      <Scatter data={chartData} options={chartOptions} />
    </div>
  );
};

export default ScatterPlot;
