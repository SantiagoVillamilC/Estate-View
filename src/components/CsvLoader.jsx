// src/components/CsvLoader.jsx
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

const CsvLoader = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
  const itemsPerPage = 10; // Número de filas por página

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
        complete: function(results) {
          setData(results.data);
        },
      });
    };

    fetchData();
  }, []);

  // Obtener los datos de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Cambiar de página
  const nextPage = () => {
    if (currentPage < Math.ceil(data.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <h1>Datos del mercado inmobiliario de Melbourne</h1>
      {data.length > 0 ? (
        <>
          <table>
            <thead>
              <tr>
                <th>Suburb</th>
                <th>Address</th>
                <th>Rooms</th>
                <th>Type</th>
                <th>Price</th>
                <th>Method</th>
                <th>SellerG</th>
                <th>Date</th>
                <th>Distance</th>
                <th>Postcode</th>
                <th>Bathroom</th>
                <th>Car</th>
                <th>BuildingArea</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((row, index) => (
                <tr key={index}>
                  <td>{row.Suburb}</td>
                  <td>{row.Address}</td>
                  <td>{row.Rooms}</td>
                  <td>{row.Type}</td>
                  <td>{row.Price}</td>
                  <td>{row.Method}</td>
                  <td>{row.SellerG}</td>
                  <td>{row.Date}</td>
                  <td>{row.Distance}</td>
                  <td>{row.Postcode}</td>
                  <td>{row.Bathroom}</td>
                  <td>{row.Car}</td>
                  <td>{row.BuildingArea}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginación */}
          <div>
            <button onClick={prevPage} disabled={currentPage === 1}>
              Anterior
            </button>
            <span> Página {currentPage} de {Math.ceil(data.length / itemsPerPage)} </span>
            <button onClick={nextPage} disabled={currentPage === Math.ceil(data.length / itemsPerPage)}>
              Siguiente
            </button>
          </div>
        </>
      ) : (
        <p>Cargando datos...</p>
      )}
    </div>
  );
};

export default CsvLoader;
