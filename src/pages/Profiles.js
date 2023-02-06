import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/Profiles.css';
import LoadingScreen from '../components/LoadingScreen';
import { Link } from "react-router-dom";

export default function Profiles(){
    const navigate = useNavigate();

    return(
        <div className='profiles_background'>
            <div className='profiles_container'>
                <div className='profiles_gallery'>
                    <Link to={'/user-profile'} className='profiles_item'>
                        <div className='profiles_item_container'>
                            <div className='profiles_item_img'>
                                <img src={require('../img/usuario.png')}/>
                            </div>
                            <span className='profiles_item_title'>
                                Usuario
                            </span>
                        </div>
                    </Link>
                    <Link to={'/ally-profile'} className='profiles_item'>
                        <div className='profiles_item_container'>
                            <div className='profiles_item_img'>
                                <img src={require('../img/servicios.png')}/>
                            </div>
                            <span className='profiles_item_title'>
                                Aliado
                            </span>
                        </div>
                    </Link>
                    <Link to={'/admin'} className='profiles_item'>
                        <div className='profiles_item_container'>
                            <div className='profiles_item_img'>
                                <img src={require('../img/usuario.png')}/>
                            </div>
                            <span className='profiles_item_title'>
                                Admin
                            </span>
                        </div>
                    </Link>
                    <Link to={'/webpage'} className='profiles_item'>
                        <div className='profiles_item_container'>
                            <div className='profiles_item_img'>
                                <img src={require('../img/plataforma.png')}/>
                            </div>
                            <span className='profiles_item_title'>
                                Plataforma
                            </span>
                        </div>
                    </Link>
                    <Link to={'/requests'} className='profiles_item'>
                        <div className='profiles_item_container'>
                            <div className='profiles_item_img'>
                                <img src={require('../img/solicitudes.png')}/>
                            </div>
                            <span className='profiles_item_title'>
                                Solicitudes
                            </span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}