import React, { useState, useEffect } from 'react';
import './App.css'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

import CsvLoader from './components/CsvLoader';
import BarChart from './components/BarChart';
import LineChart from './components/LineChart';
import ScatterPlot from './components/ScatterPlot';
import Histogram from './components/Histogram';
import RadarChart from './components/RadarChart';
import PieChartType from './components/PieChartType';
import PieChartRegion from './components/PieChartRegion';
import PieChartMethod from './components/PieChartMethod';
import PieChartRooms from './components/PieChartRooms';
import FrequencyTable from './components/FrequencyTable';
import AboutSite from './components/AboutSite';
import HowItWorks from './components/HowItWorks';
import WhyItWasMade from './components/WhyItWasMade';

const texts = ["+30.000 registros", "# gráficas", "Datos actualizados", "Análisis en curso"];

const App = () => {
  //const [csvData, setCsvData] = useState([]);

  //console.log('csvData en App.jsx:', csvData); // Imprimir datos en consola para verificar que se cargan

  const [showAbout, setShowAbout] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showWhyItWasMade, setShowWhyItWasMade] = useState(false);

  const toggleAbout = () => {
    setShowAbout(!showAbout);
  };

  const toggleHowItWorks = () => {
    setShowHowItWorks(!showHowItWorks);
  };

  const toggleWhyItWasMade = () => {
    setShowWhyItWasMade(!showWhyItWasMade);
  };

  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const animation = animate(count, 30000, { duration: 10 });

    return animation.stop;
  }, []);


  return (
    <div>
      <header>
        <h4>Estate View - Estadistica</h4>
        <div>
          <u>
            <ol><a href="#" onClick={toggleAbout}>¿Qué es?</a></ol>
            <ol><a href="#" onClick={toggleHowItWorks}>¿Cómo funciona?</a></ol>
            <ol><a href="#" onClick={toggleWhyItWasMade}>¿Por qué fue realizado?</a></ol>
          </u>
        </div>
      </header>
      {/* Renderiza AboutSite solo si showAbout es true */}
      {showAbout && <AboutSite onClose={toggleAbout} />}
      {showHowItWorks && <HowItWorks onClose={toggleHowItWorks} />}
      {showWhyItWasMade && <WhyItWasMade onClose={toggleWhyItWasMade} />}

      <div className='containerIntro'>
        <div className='containerIntroTitle'>
          <p className='textIntro'>Análisis con más de</p>
          <p className='textIntro'><motion.span className='titleIntro'>{rounded}</motion.span> datos inmobiliarios</p>
        </div>
        <div className='containerIntroInfo'>
          <p>Descubre cómo la distancia al centro de la ciudad de Melbourne impacta directamente en los precios del mercado inmobiliario a través de nuestro sitio web.</p>
          <div>
            <button><a href="https://www.kaggle.com/datasets/anthonypino/melbourne-housing-market?select=Melbourne_housing_FULL.csv" target='_blank'>
              Descargar archivo CSV
            </a></button>
            <button><a href="#sectionTable">Ver tabla de datos</a></button>
          </div>
        </div>


      </div>
      {/* <div>
      <CsvLoader setCsvData={setCsvData} />
      <ScatterPlot csvData={csvData} />
      </div> */}
      <section>
        <article className='main'>
          {/* <h1>Principal:</h1> */}
          <ScatterPlot />
          <p>Este gráfico muestra cómo el precio de las propiedades varía según su distancia al centro de Melbourne y cada punto en el gráfico representa una propiedad, con la distancia al CBD en el eje horizontal (X) y el precio en el eje vertical (Y).
            <br />
            <br />

            <strong>Propiedades cercanas al CBD (0-5 km):</strong> Generalmente, estos puntos están en la parte superior del gráfico, indicando que los precios son más altos en áreas cercanas al centro de la ciudad. <br />
            <strong>Propiedades a mediana distancia (5-20 km):</strong> Los precios suelen ser más bajos en comparación con las propiedades cercanas al CBD, aunque todavía pueden ser elevados dependiendo del barrio. <br />
            <strong>Propiedades más alejadas (20-30 km y más de 30 km):</strong> Los precios tienden a ser significativamente más bajos a medida que te alejas del centro de la ciudad por lo que estas áreas suelen ser más accesibles y por supuesto son opciones más económicas. <br />
            <br />
            Esto nos indica que los precios de las propiedades disminuyen a medida que la distancia al centro de Melbourne aumenta, reflejando la alta demanda y el valor asociado con las ubicaciones centrales;
            Concluyendo que buscando una propiedad cerca del centro de Melbourne, es facil encontrar precios más altos, en cambio considerar áreas más alejadas puede ofrecer mejores ofertas, por supuesto que sacrificando algunas facilidades que ofrece el centro</p>
        </article>
        <p></p>
        <article className='frecuencyTableMain'>
          <FrequencyTable />
        </article>
        <article className='sectionPieCharts'>
          {/* <p>Tipo</p> */}
          <PieChartType />
          {/* <p>Region</p> */}
          <PieChartRegion />
          {/* <p>Venta</p> */}
          <PieChartMethod />
          {/* <p>Habitaciones</p> */}
          {/* <PieChartRooms /> */}
        </article>
        <article className='sectionGraphs'>
          <h1>Visor de Datos Inmobiliarios</h1>
          <div className='sectionGraphsElements'>
            <LineChart />
            <Histogram />
            <div className='wideLineChart'>
              <BarChart />
            </div>
          </div>
        </article>
        {/* <RadarChart /> */}
        <article className='sectionTableLoader' id='sectionTable'>
          <CsvLoader />
        </article>
      </section>
      <motion.footer
        className="footer"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      >
        <motion.div
          className="footer-content"
          // whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <p>Hecho por Santiago V.</p>

          <motion.a
            href="https://github.com/SantiagoVillamilC/Estate-View"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.2, color: '#f39c12' }}
            whileTap={{ scale: 0.9 }}
          >
            Visita el codigo de este proyecto en mi GitHub
          </motion.a>

          <p>Curso de Estadística</p>

          <p>{currentYear}</p>
        </motion.div>
      </motion.footer>

      {/* <BoxPlotChart/> */}
    </div>
  );
};

export default App
