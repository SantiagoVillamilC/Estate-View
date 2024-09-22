import React, { useState, useEffect, useRef } from 'react';
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
  const [loading, setLoading] = useState(true); // Inicialmente en estado "loading"
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7000;

  const isDataProcessed = useRef(false); // Ref para controlar si los datos han sido procesados

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Desactivar la caché para evitar la carga de datos inconsistentes
        const response = await fetch('/Melbourne_housing_FULL.csv', { cache: 'no-store' });
        const reader = response.body.getReader();
        let csv = '';
        const decoder = new TextDecoder('utf-8');

        // Leer el archivo CSV en fragmentos
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          csv += decoder.decode(value);
        }

        // Parsear los datos del CSV
        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const processedData = results.data.map((row) => {
              const distance = parseFloat(row.Distance);
              const price = parseFloat(row.Price);

              if (!isNaN(distance) && !isNaN(price)) {
                // Añadir desplazamiento aleatorio pequeño (jitter) para evitar sobreposición
                const jitter = Math.random() * 0.1 - 0.05;
                return { distance: distance + jitter, price };
              }
              return null;
            }).filter((row) => row !== null);

            // Guardar los datos completos y los de la primera página
            setAllData(processedData);
            setData(processedData.slice(0, itemsPerPage));

            isDataProcessed.current = true; // Marcar como procesados
            setLoading(false); // Cambiar a falso una vez que los datos están listos
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
            setLoading(false); // Cambiar el estado si ocurre un error
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
    if (isDataProcessed.current) {
      const nextPage = currentPage + 1;
      const start = (nextPage - 1) * itemsPerPage;
      const end = nextPage * itemsPerPage;
      setData(allData.slice(start, end));
      setCurrentPage(nextPage);
    }
  };

  const handlePreviousPage = () => {
    if (isDataProcessed.current) {
      const previousPage = currentPage - 1;
      if (previousPage > 0) {
        const start = (previousPage - 1) * itemsPerPage;
        const end = previousPage * itemsPerPage;
        setData(allData.slice(start, end));
        setCurrentPage(previousPage);
      }
    }
  };

  const chartData = {
    datasets: [
      {
        label: '0-5 km',
        data: data.filter((row) => row.distance <= 5).map((row) => ({ x: row.distance, y: row.price })),
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 0.7)',
        pointRadius: 5,
        pointHoverRadius: 7
      },
      {
        label: '5-10 km',
        data: data.filter((row) => row.distance > 5 && row.distance <= 10).map((row) => ({ x: row.distance, y: row.price })),
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 0.7)',
        pointRadius: 5,
        pointHoverRadius: 7
      },
      {
        label: '10-20 km',
        data: data.filter((row) => row.distance > 10 && row.distance <= 20).map((row) => ({ x: row.distance, y: row.price })),
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 0.7)',
        pointRadius: 5,
        pointHoverRadius: 7
      },
      {
        label: '20-30 km',
        data: data.filter((row) => row.distance > 20 && row.distance <= 30).map((row) => ({ x: row.distance, y: row.price })),
        backgroundColor: 'rgba(153, 102, 255, 0.7)',
        borderColor: 'rgba(153, 102, 255, 0.7)',
        pointRadius: 5,
        pointHoverRadius: 7
      },
      {
        label: 'Más de 30 km',
        data: data.filter((row) => row.distance > 30).map((row) => ({ x: row.distance, y: row.price })),
        backgroundColor: 'rgba(255, 159, 64, 0.7)',
        borderColor: 'rgba(255, 159, 64, 0.7)',
        pointRadius: 5,
        pointHoverRadius: 7
      }
    ]
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
          enabled: false,
          mode: 'xy'
        },
        zoom: {
          enabled: false,
          mode: 'xy'
        }
      }
    },
    scales: {
      x: {
        type: 'linear',
        title: {
          display: true,
          text: 'Distancia al CBD (km)',
          color: '#E3E3E3',
        },
        grid: {
          color: '#E3E3E3',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Precio en $',
          color: '#E3E3E3',
        },
        grid: {
          color: '#E3E3E3',
        },
      }
    }
  };

  if (loading) {
    // Muestra un mensaje de carga mientras los datos aún están siendo procesados
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
