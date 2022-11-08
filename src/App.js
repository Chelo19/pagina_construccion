import '../src/styles/App.css';
import { useEffect } from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom';

import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Header from './components/Header';
import Account from './pages/Account';
import Categories from './pages/Categories';
import Services from './pages/Services';

import {supabase} from './supabase/client';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
  supabase.auth.onAuthStateChange((event, session) => {
    if(!session){
        navigate('/login');
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
      <Header/>
      <br/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="*" element={<NotFound/>}/>
        <Route path='/account' element={<Account/>}/>
        <Route path='/categories' element={<Categories/>}/>
        <Route path='/services' element={<Services/>}/>
      </Routes>
    </div>
  );
}

export default App;
export var isLogged;