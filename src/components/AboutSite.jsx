// AboutSite.jsx
import React from 'react';
import './AboutSite.css';

const AboutSite = ({ onClose }) => {
  return (
    <div className="about-site-overlay" onClick={onClose}>
      <div className="about-site-content">
        <h2>¿Qué es este sitio?</h2>
        <p>
          Este sitio es una herramienta interactiva que permite la visualización y análisis de datos del mercado inmobiliario
          en Melbourne. A través de gráficos y tablas, puedes explorar cómo la distancia al centro de la ciudad (CBD)
          afecta el precio de las propiedades en Melbourne, facilitando la toma de decisiones informadas sobre la compra o inversión en bienes raíces.
        </p>
      </div>
    </div>
  );
};

export default AboutSite;
