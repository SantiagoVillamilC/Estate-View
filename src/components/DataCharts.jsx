// src/components/DataCharts.jsx
import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const DataCharts = ({ data }) => {
  const [barData, setBarData] = useState({});
  const [lineData, setLineData] = useState({});

  useEffect(() => {
    if (data && data.length > 0) {
      // Procesar datos solo si existen
      const suburbCounts = data.reduce((acc, property) => {
        if (property.Suburb) {
          acc[property.Suburb] = (acc[property.Suburb] || 0) + 1;
        }
        return acc;
      }, {});

      const suburbs = Object.keys(suburbCounts);
      const counts = Object.values(suburbCounts);

      setBarData({
        labels: suburbs.slice(0, 10), // Mostrar solo los primeros 10 suburbios
        datasets: [
          {
            label: 'Cantidad de propiedades',
            data: counts.slice(0, 10),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      });

      const suburbPrices = data.reduce((acc, property) => {
        const dist = parseFloat(property.Distance);
        const price = parseFloat(property.Price);

        if (!isNaN(dist) && !isNaN(price)) {
          if (!acc[dist]) {
            acc[dist] = { totalPrice: 0, count: 0 };
          }
          acc[dist].totalPrice += price;
          acc[dist].count += 1;
        }
        return acc;
      }, {});

      const distances = Object.keys(suburbPrices).map(Number).sort((a, b) => a - b);
      const avgPrices = distances.map(dist => suburbPrices[dist].totalPrice / suburbPrices[dist].count);

      setLineData({
        labels: distances,
        datasets: [
          {
            label: 'Precio promedio (AUD)',
            data: avgPrices,
            borderColor: 'rgba(153, 102, 255, 1)',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderWidth: 2,
            fill: true,
          },
        ],
      });
    }
  }, [data]);

  // Verificar si hay datos antes de renderizar
  if (!data || data.length === 0) {
    return <p>No hay datos disponibles para graficar.</p>;
  }

  return (
    <div>
      <h2>Gráfico de Barras: Cantidad de propiedades por suburbio</h2>
      <Bar data={barData} />
      
      <h2>Gráfico de Líneas: Precio promedio vs Distancia del CBD</h2>
      <Line data={lineData} />
    </div>
  );
};

export default DataCharts;
