import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

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

  // Función para procesar los datos y crear la tabla de frecuencia
  const processFrequencyData = () => {
    const frequencyData = {};
    csvData.forEach((row) => {
      const distance = parseFloat(row.Distance);
      const price = parseFloat(row.Price);

      if (!isNaN(distance) && !isNaN(price)) {
        // Definir rangos de distancia al CBD
        let range = '';
        if (distance <= 5) range = '0-5 km';
        else if (distance <= 10) range = '5-10 km';
        else if (distance <= 20) range = '10-20 km';
        else if (distance <= 30) range = '20-30 km';
        else range = '30+ km';

        if (!frequencyData[range]) {
          frequencyData[range] = { total: 0, count: 0 };
        }
        frequencyData[range].total += price;
        frequencyData[range].count += 1;
      }
    });

    // Calcular el precio promedio para cada rango
    return Object.keys(frequencyData).map((range) => ({
      range,
      avgPrice: (frequencyData[range].total / frequencyData[range].count).toFixed(2),
      count: frequencyData[range].count,
    }));
  };

  const frequencyData = processFrequencyData();

  return (
    <div>
      <h2>Tabla de Frecuencia: Precio vs Distancia al CBD</h2>
      {csvData.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Rango de Distancia</th>
              <th>Precio Promedio</th>
              <th>Número de Propiedades</th>
            </tr>
          </thead>
          <tbody>
            {frequencyData.map((row) => (
              <tr key={row.range}>
                <td>{row.range}</td>
                <td>${row.avgPrice}</td>
                <td>{row.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Cargando datos...</p>
      )}
    </div>
  );
};

export default FrequencyTable;
