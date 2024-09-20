import React from 'react';
import './AboutSite.css';

const HowItWorks = ({ onClose }) => {
  return (
    <div className="about-site-overlay" onClick={onClose}>
      <div className="about-site-content">
        <h2>¿Cómo funciona?</h2>
        <p>
          Este sitio utiliza técnicas de visualización de datos para mostrar la relación entre la distancia al centro de la ciudad y los precios de las propiedades en Melbourne. Los usuarios pueden cargar datos, realizar análisis y obtener gráficos interactivos.
        </p>
      </div>
    </div>
  );
};

export default HowItWorks;
