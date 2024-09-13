import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CsvLoader from './components/CsvLoader';
import BarChart from './components/BarChart';
import LineChart from './components/LineChart';
import ScatterPlot from './components/ScatterPlot';
import PieChart from './components/PieChart';
import Histogram from './components/Histogram';
import RadarChart from './components/RadarChart';

const App = () => {
  const [csvData, setCsvData] = useState([]);

  console.log('csvData en App.jsx:', csvData); // Imprimir datos en consola para verificar que se cargan

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
      <div>
        <p>+30.000 registros</p>
        <p>Akguna frase que explique el sitio brevemente</p>
        <button>Descargar archivo original</button>
        <button>Ver tabla de datos</button>
      </div>
      {/* <div>
      <CsvLoader setCsvData={setCsvData} />
      <ScatterPlot csvData={csvData} />
      </div> */}
      <CsvLoader/>
      <h1>Visor de Datos Inmobiliarios</h1>
      <BarChart/>
      <LineChart/>
      <h1>Principal:</h1>
      <ScatterPlot/>
      <PieChart/>
      <Histogram/>
      <RadarChart/>
      {/* <BoxPlotChart/> */}
    </div>
  );
};

export default App
