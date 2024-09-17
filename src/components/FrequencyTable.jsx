import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Line } from 'react-chartjs-2';
import './FrequencyTable.css';

const FrequencyTable = () => {
  const [csvData, setCsvData] = useState([]);

  // Cargar el archivo CSV
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

  const processFrequencyData = () => {
    const frequencyData = {};
    csvData.forEach((row) => {
      const distance = parseFloat(row.Distance);
      const price = parseFloat(row.Price);

      if (!isNaN(distance) && !isNaN(price)) {
        let range = '';
        if (distance <= 5) range = '0-5 km';
        else if (distance <= 10) range = '5-10 km';
        else if (distance <= 20) range = '10-20 km';
        else if (distance <= 30) range = '20-30 km';
        else range = '30+ km';

        if (!frequencyData[range]) {
          frequencyData[range] = { total: 0, count: 0, prices: [] };
        }
        frequencyData[range].total += price;
        frequencyData[range].count += 1;
        frequencyData[range].prices.push(price);
      }
    });

    return Object.keys(frequencyData).map((range) => {
      const prices = frequencyData[range].prices;
      const avgPrice = frequencyData[range].total / frequencyData[range].count;
      const variance = prices.reduce((acc, price) => acc + Math.pow(price - avgPrice, 2), 0) / frequencyData[range].count;
      const stdDev = Math.sqrt(variance).toFixed(2);

      return {
        range,
        avgPrice: avgPrice.toFixed(2),
        count: frequencyData[range].count,
        stdDev,
      };
    });
  };

  const frequencyData = processFrequencyData();

  const chartData = {
    labels: frequencyData.map((row) => row.range),
    datasets: [
      {
        label: 'Precio Promedio',
        data: frequencyData.map((row) => row.avgPrice),
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.4,
        pointRadius: 8, // Tamaño de las burbujas de los puntos de datos
        pointHoverRadius: 10, // Tamaño cuando pasas el cursor por encima del punto
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        ticks: {
          color: '#E3E3E3', // Color de las etiquetas en el eje X
        },
        grid: {
          color: '#E3E3E3', // Color de la cuadrícula en el eje X
        },
      },
      y: {
        ticks: {
          color: '#E3E3E3', // Color de las etiquetas en el eje Y
        },
        grid: {
          color: '#E3E3E3', // Color de la cuadrícula en el eje Y
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Ocultar la leyenda
      },
    },
  };

  const renderConclusion = () => {
    if (frequencyData.length > 0) {
      const highestPrice = Math.max(...frequencyData.map((row) => parseFloat(row.avgPrice)));
      const lowestPrice = Math.min(...frequencyData.map((row) => parseFloat(row.avgPrice)));
      const closestRange = frequencyData.find((row) => parseFloat(row.avgPrice) === highestPrice);
      const farthestRange = frequencyData.find((row) => parseFloat(row.avgPrice) === lowestPrice);

      return (
        <div className="conclusion">
          <h3>Conclusión</h3>
          <p>
            Basado en los datos analizados, parece que las propiedades más cercanas al CBD (en el rango de {closestRange.range})
            tienen el precio promedio más alto (${highestPrice.toLocaleString()}). A medida que aumenta la distancia, el precio promedio
            tiende a disminuir, siendo más bajo en el rango de {farthestRange.range}, con un precio promedio de ${lowestPrice.toLocaleString()}.
          </p>
          <p>
            Esto sugiere una correlación negativa entre la distancia al CBD y el precio de las propiedades: cuanto más lejos está la propiedad
            del centro de la ciudad, menor tiende a ser su precio promedio.
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="frequency-table-container">
      <h2>Tabla de Frecuencia: Precio vs Distancia al CBD</h2>
      {csvData.length > 0 ? (
        <>
          <div className="table-and-conclusion">
            <table className="frequency-table">
              <thead>
                <tr>
                  <th>Rango de Distancia</th>
                  <th>Precio Promedio</th>
                  <th>Desviación Estándar</th>
                  <th>Número de Propiedades</th>
                </tr>
              </thead>
              <tbody>
                {frequencyData.map((row) => (
                  <tr key={row.range}>
                    <td>{row.range}</td>
                    <td>${parseFloat(row.avgPrice).toLocaleString()}</td>
                    <td>{row.stdDev}</td>
                    <td>{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {renderConclusion()}
          </div>
          <div className='graphAverage'>
            <h3>Visualización del Precio Promedio por Distancia</h3>
            <Line data={chartData} options={chartOptions} />
          </div>

        </>
      ) : (
        <p>Cargando datos...</p>
      )}
    </div>
  );
};

export default FrequencyTable;
