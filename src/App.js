import './App.css';
import { useEffect } from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom';

import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

import {supabase} from './supabase/client';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
  supabase.auth.onAuthStateChange((event, session) => {
    if(!session){
        navigate('/login');
      }
      else{
        navigate('/');
      }
    })
  });

  const navRegister = (e) => {
    navigate('/register');
  }

  const navLogin = (e) => {
    navigate('/login');
  }

  const navHome = (e) => {
    navigate('/');
  }

  return(
    <div className="App">
      <br/>
      <button onClick={navRegister}>Registro</button>
      <button onClick={navLogin}>Login</button>
      <button onClick={navHome}>Home</button>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </div>
  );
}

export default App;
export var isLogged;