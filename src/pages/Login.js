import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/RegLog.css';
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

function Login(){
    const navigate = useNavigate();
    
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

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

    const signIn = async () => {
        if(email && password){
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            })
            if(error){
                setPromptStyle({backgroundColor: '#161825'});
                setPrompt('Correo o contraseña incorrectos');
                await timeout(2000);
                setPrompt(null);
            }
            else{
                setPromptStyle({backgroundColor: '#77DD77'});
                setPrompt('Inicio de sesión exitoso');
                await timeout(2000);
                setPrompt(null);
                document.location.reload();
            }
        }
        else{
            setPromptStyle({backgroundColor: '#161825'});
            setPrompt('Faltan campos por llenar');
            await timeout(2000);
            setPrompt(null);
        }
    }

    function timeout(number) {
        return new Promise( res => setTimeout(res, number) );
    }

    return(
        <div className="reg_log_background">
            <div className="reg_log_background_container">
                <div className="reg_log_container">
                    <div className="reg_log_logo">
                        <img src={require('../img/logodrecfullsize.png')}/>
                    </div>
                    <div className="reg_log_title">
                        <span>
                            Iniciar Sesión
                        </span>
                    </div>
                    <div className="reg_log_form">
                        <TextField className='reg_log_input' label="Correo" variant="outlined" onChange={(e) => setEmail(e.target.value)}/>
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
                        {/* <div className="reg_log_input">
                            <span>
                                Correo
                            </span>
                            <input
                                type={'email'}
                                placeholder={'tuemail@gmail.com'}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div> */}
                        {/* <div className="reg_log_input">
                            <span>
                                Contraseña
                            </span>
                            <input
                                type={'password'}
                                placeholder={'Contraseña'}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div> */}
                    </div>
                    <Link id="reg_log_submit" onClick={signIn}>
                        Iniciar Sesión
                    </Link>
                    <div className='reg_log_options'>
                        ¿Aún no tienes un perfil?&nbsp;
                        <Link to={"/register/"}>Haz click aquí</Link>
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

export default Login;