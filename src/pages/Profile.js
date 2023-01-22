import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/Profile.css';
import LoadingScreen from '../components/LoadingScreen';
import { Link } from "react-router-dom";

export default function Profile(){
    const navigate = useNavigate();

    const [isAlly, setIsAlly] = useState(true);
    const [isAdmin, setIsAdmin] = useState(true);

    return(
        <div className='profile_background'>
            <div className='profile_container'>
                <div className='profile_display'>
                    <span id='profile_title'>Perfil de usuario</span>
                    <div className='profile_img'>
                        <img src={require('../img/aliados.png')}/>
                    </div>
                    <div className='profile_content'>
                        <span>Usuario 101</span>
                        <span>Sofia Chavez</span>
                        <span>sofiachavez@hotmail.com</span>
                        <span>8181818181</span>
                        <span>Monterrey, N.L., Mexico</span>
                        {isAlly ?
                            <>
                                <span id='profile_link'><Link to={'/'}>Servicios y categorias</Link></span>
                                <span id='profile_link'><Link to={'/'}>Cotizaciones</Link></span>
                                <span id='profile_link'><Link to={'/'}>Proyectos</Link></span>
                            </>
                        : 
                        <>
                            <span id='profile_link'><Link to={'/'}>Mis cotizaciones</Link></span>
                            <span id='profile_link'><Link to={'/'}>Mis proyectos</Link></span>
                        </>
                        }
                    </div>
                    {isAdmin &&
                        <div className='profile_buttons'>
                            <div className='profile_button'>
                                <div className='profile_button_img'>
                                    <img src={require('../img/bloquear.png')}/>
                                </div>
                                <div className='profile_button_text'>
                                    <span>Bloquear usuario</span>
                                </div>
                            </div>
                            <div className='profile_button'>
                                <div className='profile_button_img'>
                                    <img src={require('../img/editar.png')}/>
                                </div>
                                <div className='profile_button_text'>
                                    <span>Editar usuario</span>
                                </div>
                            </div>
                            <div className='profile_button'>
                                <div className='profile_button_img'>
                                    <img src={require('../img/eliminar.png')}/>
                                </div>
                                <div className='profile_button_text'>
                                    <span>Eliminar usuario</span>
                                </div>
                            </div>
                        </div>
                    }
                    <span id='profile_link'><Link to={'/'}>Quiero ser aliado</Link></span>
                </div>
            </div>
        </div>
    );
}