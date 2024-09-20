import React from 'react';
import './AboutSite.css';

const WhyItWasMade = ({ onClose }) => {
  return (
    <div className="about-site-overlay" onClick={onClose}>
      <div className="about-site-content">
        <h2>¿Por qué fue realizado?</h2>
        <p>
          Este proyecto se desarrolló para ayudar a las personas a tomar decisiones informadas sobre inversiones inmobiliarias, considerando factores económicos y geográficos en Melbourne.
        </p>
      </div>
    </div>
  );
};

export default WhyItWasMade;
