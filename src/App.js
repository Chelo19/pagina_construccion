import './App.css';
import { useEffect } from 'react';
import {Routes, Route} from 'react-router-dom';

import Login from './pages/Login';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

function App() {

  useEffect(() => {
    console.log("App.js");
  });

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </div>
  );
}

export default App;
