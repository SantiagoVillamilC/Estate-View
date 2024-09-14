import React, { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
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
            <ol><a href="">¿Que es?</a></ol>
            <ol><a href="">¿Como funciona?</a></ol>
            <ol><a href="">¿Por que fue realizado?</a></ol>
          </u>
        </div>
      </header>
      <div className='containerIntro'>
        <div className='containerIntroTitle'>
          <p className='textIntro'>Análisis con más de</p>
          <p className='textIntro'><motion.span className='titleIntro'>{rounded}</motion.span> datos inmobiliarios</p>
        </div>
        <div className='containerIntroInfo'>
          <p>Descubre cómo la distancia al centro de la ciudad de Melbourne impacta directamente en los precios del mercado inmobiliario a través de nuestro sitio web.</p>
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
      <section>
        <article className='main'>
          {/* <h1>Principal:</h1> */}
          <ScatterPlot />
          <p>Este gráfico muestra cómo el precio de las propiedades varía según su distancia al centro de Melbourne y cada punto en el gráfico representa una propiedad, con la distancia al CBD en el eje horizontal (X) y el precio en el eje vertical (Y).

            Interpretación:

            Propiedades cercanas al CBD (0-5 km): Generalmente, estos puntos están en la parte superior del gráfico, indicando que los precios son más altos en áreas cercanas al centro de la ciudad.
            Propiedades a mediana distancia (5-20 km): Los precios suelen ser más bajos en comparación con las propiedades cercanas al CBD, aunque todavía pueden ser elevados dependiendo del barrio.
            Propiedades más alejadas (20-30 km y más de 30 km): Los precios tienden a ser significativamente más bajos a medida que te alejas del centro de la ciudad. Estas áreas suelen ser más accesibles para quienes buscan opciones más económicas.
            Conclusiones:

            Tendencia General: Los precios de las propiedades disminuyen a medida que la distancia al centro de Melbourne aumenta. Esto refleja la alta demanda y el valor asociado con las ubicaciones centrales.
            Zonas de Alta Demanda: Si estás buscando una propiedad cerca del centro de Melbourne, prepárate para precios más altos. Alternativamente, si el presupuesto es una preocupación, considerar áreas más alejadas puede ofrecer mejores ofertas.
            Este gráfico te permite visualizar de manera clara cómo la proximidad al centro urbano afecta el precio de las propiedades, ayudándote a tomar decisiones informadas sobre la compra o inversión en bienes raíces.</p>
        </article>
        <article className='frecuencyTableMain'>
          <FrequencyTable />
        </article>
        <article>
          <h1>Visor de Datos Inmobiliarios</h1>
          <BarChart />
          <LineChart />
          <p>Tipo</p>
          <PieChartType />
          <p>Region</p>
          <PieChartRegion />
          <p>Venta</p>
          <PieChartMethod />
          <p>Habitaciones</p>
          <PieChartRooms />
        </article>
        <Histogram />
        {/* <RadarChart /> */}
        <CsvLoader />
      </section>
      <footer></footer>

      {/* <BoxPlotChart/> */}
    </div>
  );
};

export default App
