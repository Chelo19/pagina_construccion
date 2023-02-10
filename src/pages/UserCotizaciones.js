import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/Profiles.css';
import LoadingScreen from '../components/LoadingScreen';
import { Link } from "react-router-dom";

export default function UserCotizaciones(){
    const navigate = useNavigate();

    return(
        <div className='profiles_background'>
            <div className='profiles_container'>
                <div className='profiles_gallery'>
                    <Link to={'/mis-cotizaciones'} className='profiles_item'>
                        <div className='profiles_item_container'>
                            <div className='profiles_item_img'>
                                <img src={require('../img/enviadas.png')}/>
                            </div>
                            <span className='profiles_item_title'>
                                Mis Cotizaciones
                            </span>
                        </div>
                    </Link>
                    <Link to={'/cotizaciones-pendientes'} className='profiles_item'>
                        <div className='profiles_item_container'>
                            <div className='profiles_item_img'>
                                <img src={require('../img/pendientes.png')}/>
                            </div>
                            <span className='profiles_item_title'>
                                Pendientes
                            </span>
                        </div>
                    </Link>
                    <Link to={'/user-profile'} className='profiles_item'>
                        <div className='profiles_item_container'>
                            <div className='profiles_item_img'>
                                <img src={require('../img/calificar.png')}/>
                            </div>
                            <span className='profiles_item_title'>
                                Calificar
                            </span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}