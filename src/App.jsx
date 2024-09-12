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
