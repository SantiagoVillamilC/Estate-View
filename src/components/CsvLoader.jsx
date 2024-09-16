import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './CsvLoader.css'; // Importamos los estilos

const CsvLoader = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
        complete: (results) => setData(results.data),
      });
    };

    fetchData();
  }, []);

  const currentItems = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < Math.ceil(data.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const columnsToShow = ['Suburb', 'Address', 'Rooms', 'Type', 'Price', 'Method', 'SellerG', 'Date', 'Distance', 'Postcode', 'Bathroom', 'Car']; // Solo las primeras 12 columnas

  return (
    <div className="csv-loader">
      <h1>Tabla de datos del mercado inmobiliario de Melbourne</h1>
      {data.length > 0 ? (
        <>
          <table className="styled-table">
            <thead>
              <tr>
                {columnsToShow.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((row, index) => (
                <tr key={index}>
                  {columnsToShow.map((col) => (
                    <td key={col}>{row[col] || 'N/A'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button onClick={() => handlePageChange('prev')} disabled={currentPage === 1}>
              Anterior
            </button>
            <span>Página {currentPage} de {Math.ceil(data.length / itemsPerPage)}</span>
            <button onClick={() => handlePageChange('next')} disabled={currentPage === Math.ceil(data.length / itemsPerPage)}>
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
