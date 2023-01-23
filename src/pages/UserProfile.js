import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/Profiles.css';
import LoadingScreen from '../components/LoadingScreen';
import { Link } from "react-router-dom";

export default function UserProfile(){
    const navigate = useNavigate();

    return(
        <div className='profiles_background'>
            <div className='profiles_container'>
                <div className='profiles_gallery'>
                    <Link to={'/user-cotizaciones'} className='profiles_item'>
                        <div className='profiles_item_container'>
                            <div className='profiles_item_img'>
                                <img src={require('../img/cotizaciones.png')}/>
                            </div>
                            <span className='profiles_item_title'>
                                Cotizaciones
                            </span>
                        </div>
                    </Link>
                    <Link to={'/profile-list'} className='profiles_item'>
                        <div className='profiles_item_container'>
                            <div className='profiles_item_img'>
                                <img src={require('../img/aliados.png')}/>
                            </div>
                            <span className='profiles_item_title'>
                                Información de Usuarios
                            </span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}