import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Scatter } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(zoomPlugin);
Chart.register(...registerables);

const ScatterPlot = () => {
  const [allData, setAllData] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5000;
  const distanceGroups = [10, 20, 30, 40, 50]; // Rango de 10km hasta 50km

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
            const processedData = results.data.map((row) => {
              const distance = parseFloat(row.Distance);
              const price = parseFloat(row.Price);

              if (!isNaN(distance) && !isNaN(price)) {
                // Jittering: añadir desplazamiento aleatorio pequeño
                const jitter = Math.random() * 0.1 - 0.05; // Desplazamiento +/-0.05
                return { distance: distance + jitter, price };
              }
              return null;
            }).filter((row) => row !== null);

            setAllData(processedData);
            setData(processedData.slice(0, itemsPerPage));
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

  const handleNextPage = () => {
    const nextPage = currentPage + 1;
    const start = (nextPage - 1) * itemsPerPage;
    const end = nextPage * itemsPerPage;
    setData(allData.slice(start, end));
    setCurrentPage(nextPage);
  };

  const handlePreviousPage = () => {
    const previousPage = currentPage - 1;
    if (previousPage > 0) {
      const start = (previousPage - 1) * itemsPerPage;
      const end = previousPage * itemsPerPage;
      setData(allData.slice(start, end));
      setCurrentPage(previousPage);
    }
  };

  // Agrupación por colores según el rango de distancia
  const getColorByDistance = (distance) => {
    if (distance <= 10) return 'rgba(255, 99, 132, 0.7)';
    if (distance <= 20) return 'rgba(54, 162, 235, 0.7)';
    if (distance <= 30) return 'rgba(75, 192, 192, 0.7)';
    if (distance <= 40) return 'rgba(153, 102, 255, 0.7)';
    return 'rgba(255, 159, 64, 0.7)'; // Distancia > 40km
  };

  const chartData = {
    datasets: distanceGroups.map((maxDistance) => ({
      label: `Menor a ${maxDistance} km`,
      data: data
        .filter((row) => row.distance <= maxDistance && row.distance > maxDistance - 10)
        .map((row) => ({ x: row.distance, y: row.price })),
      backgroundColor: getColorByDistance(maxDistance),
      borderColor: getColorByDistance(maxDistance),
      borderWidth: 1,
      pointRadius: 5,
      pointHoverRadius: 7
    }))
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        onClick: (e, legendItem) => {
          const index = legendItem.datasetIndex;
          const ci = e.chart;
          const meta = ci.getDatasetMeta(index);

          // Toggle dataset visibility
          meta.hidden = !meta.hidden;
          ci.update();
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Distancia: ${context.raw.x} km, Precio: $${context.raw.y}`;
          }
        }
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy'
        },
        zoom: {
          enabled: true,
          mode: 'xy'
        }
      }
    },
    scales: {
      x: {
        type: 'logarithmic',
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
      <div>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Página anterior
        </button>
        <button onClick={handleNextPage} disabled={currentPage * itemsPerPage >= allData.length}>
          Siguiente página
        </button>
      </div>
    </div>
  );
};

export default ScatterPlot;
