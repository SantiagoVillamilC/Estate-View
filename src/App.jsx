import React, { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

import CsvLoader from './components/CsvLoader';
import BarChart from './components/BarChart';
import LineChart from './components/LineChart';
import ScatterPlot from './components/ScatterPlot';
import PieChart from './components/PieChart';
import Histogram from './components/Histogram';
import RadarChart from './components/RadarChart';

const texts = ["+30.000 registros", "# gráficas", "Datos actualizados", "Análisis en curso"];

const App = () => {
  //const [csvData, setCsvData] = useState([]);

  //console.log('csvData en App.jsx:', csvData); // Imprimir datos en consola para verificar que se cargan

  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    const animation = animate(count, 20000, { duration: 10 });

    return animation.stop;
  }, []);


  return (
    <div>
      <header>
        <h4>Estate View - Estadistica</h4>
        <div>
          <u>
            <ol>¿Que es?</ol>
            <ol>¿Como funciona?</ol>
            <ol>¿Por que fue realizado?</ol>
          </u>
        </div>
      </header>
      <div className='containerIntro'>
        <div className='containerIntroTitle'>
          <p className='textIntro'>Análisis con más de</p>
          <p className='textIntro'><motion.span className='titleIntro'>{rounded}</motion.span> datos inmobiliarios</p>
        </div>
        <div className='containerIntroInfo'>
          <p>Descubre cómo la distancia al centro de la ciudad de Melbourne impacta directamente en los precios del mercado inmobiliario a través de nuestra plataforma.</p>
          <div>
            <button>Descargar archivo original (.csv)</button>
            <button>Ver tabla de datos</button>
          </div>
        </div>


      </div>
      {/* <div>
      <CsvLoader setCsvData={setCsvData} />
      <ScatterPlot csvData={csvData} />
      </div> */}
      <CsvLoader />
      <h1>Visor de Datos Inmobiliarios</h1>
      <BarChart />
      <LineChart />
      <h1>Principal:</h1>
      <ScatterPlot />
      <PieChart />
      <Histogram />
      <RadarChart />
      {/* <BoxPlotChart/> */}
    </div>
  );
};

export default App
