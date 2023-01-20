import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/RegLog.css';
import LoadingScreen from '../components/LoadingScreen';
import { Link } from "react-router-dom";


function Login(){
    const navigate = useNavigate();
    
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    const [prompt, setPrompt] = useState(null);
    const [promptStyle, setPromptStyle] = useState(null);

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
                        <div className="reg_log_input">
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
                                Contraseña
                            </span>
                            <input
                                type={'password'}
                                placeholder={'Contraseña'}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
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