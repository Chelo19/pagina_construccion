import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { useNavigate } from "react-router-dom";
import "../styles/RegLog.css";
import LoadingScreen from '../components/LoadingScreen';
import { Link } from "react-router-dom";

import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confPassword, setConfPassword] = useState(null);
  const [name, setName] = useState(null);
  const [phone, setPhone] = useState(null);

  const [prompt, setPrompt] = useState(null);
  const [promptStyle, setPromptStyle] = useState(null);

  //

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
      event.preventDefault();
  };

  //

  useEffect(() => {
    getUserMethod();
  }, [])

  const getUserMethod = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if(user) navigate('/');
  }
  
  const register = async () => {
    if(email && name && password && confPassword && phone){
      if(password == confPassword){
        setPromptStyle({backgroundColor: '#161825'});
        setPrompt('Creando perfil...');
        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password,
        })
        if(error){
          setPromptStyle({backgroundColor: '#161825'});
          setPrompt('Ocurrió un error al crear tu perfil');
          await timeout(2000);
          setPrompt(null);
        }
        else addToDb(data.user.id);
      }
      else{
        setPromptStyle({backgroundColor: '#161825'});
        setPrompt('Las contraseñas no coinciden');
        await timeout(2000);
        setPrompt(null);
      }
    }
    else{
      setPromptStyle({backgroundColor: '#161825'});
      setPrompt('Faltan campos por llenar');
      await timeout(2000);
      setPrompt(null);
    }
  }

  const addToDb = async (uuid) => {
    const { error } = await supabase
    .from('account')
    .insert({ email: email, name: name, phone: phone, role: 'cliente', uuid: uuid, location_id: 1});
    if(!error){
      setPromptStyle({backgroundColor: '#77DD77'});
      setPrompt('Perfil creado con éxito');
      await timeout(2000);
      setPrompt(null);
      document.location.reload();
    }
  }

  function timeout(number) {
    return new Promise( res => setTimeout(res, number) );
  }

  return (
    <div className="reg_log_background">
      <div className="reg_log_background_container">
        <div className="reg_log_container">
          <div className="reg_log_logo">
            <img src={require('../img/logodrecfullsize.png')}/>
          </div>
          <div className="reg_log_title">
            <span>
              Crear perfil
            </span>
          </div>
          <div className="reg_log_form">
            <TextField className='reg_log_input' label="Correo" variant="outlined" onChange={(e) => setEmail(e.target.value)}/>
            <TextField className='reg_log_input' label="Nombre" variant="outlined" onChange={(e) => setName(e.target.value)}/>
            <TextField className='reg_log_input' label="Teléfono" variant="outlined" onChange={(e) => setPhone(e.target.value)}/>
            <FormControl sx={{ m: 1, margin: 0}} variant="outlined" className='reg_log_input'>
              <InputLabel htmlFor="filled-adornment-password">Contraseña</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                <InputAdornment position="end">
                    <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                </InputAdornment>
                }
                label="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <FormControl sx={{ m: 1, margin: 0}} variant="outlined" className='reg_log_input'>
              <InputLabel htmlFor="filled-adornment-password">Confirmar Contraseña</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                <InputAdornment position="end">
                    <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                </InputAdornment>
                }
                label="Password"
                onChange={(e) => setConfPassword(e.target.value)}
              />
            </FormControl>
            {/* <div className="reg_log_input">
              <span>
                Correo
              </span>
              <input
                type={'email'}
                placeholder={'tuemail@gmail.com'}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="reg_log_input">
              <span>
                Nombre
              </span>
              <input
                type={'text'}
                placeholder={'Nombre'}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="reg_log_input">
              <span>
                Contraseña
              </span>
              <input
                type={'password'}
                placeholder={'Contraseña'}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="reg_log_input">
              <span>
                Confirmar Contraseña
              </span>
              <input
                type={'password'}
                placeholder={'Confirmar contraseña'}
                onChange={(e) => setConfPassword(e.target.value)}
                />
            </div>
            <div className="reg_log_input">
              <span>
                Telefono
              </span>
              <input type="tel"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                required
                placeholder={'1234567890'}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div> */}
          </div>
          <Link id="reg_log_submit" onClick={register}>
            Crear Perfil
          </Link>
          <div className='reg_log_options'>
            ¿Ya tienes un perfil?&nbsp;
            <Link to={"/login/"}>Haz click aquí</Link>
          </div>
        </div>
        {prompt &&
        <div className="reg_log_prompt" style={promptStyle}>
          {prompt}
        </div>}
      </div>  
    </div>
  );
}

export default Register;
