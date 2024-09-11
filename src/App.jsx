import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CsvLoader from './components/CsvLoader';
import BarChart from './components/BarChart';
import LineChart from './components/LineChart';

const App = () => {
  return (
    <div>
      <CsvLoader/>
      <h1>Visor de Datos Inmobiliarios</h1>
      <BarChart/>
      <LineChart/>
    </div>
  );
};

export default App
