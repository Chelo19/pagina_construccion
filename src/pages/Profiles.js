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
                        <div className='profiles_item_img'>
                            <img src={require('../img/cuenta2.png')}/>
                        </div>
                        <span>
                            Usuario
                        </span>
                    </Link>
                    <Link to={'/'} className='profiles_item'>
                        <div className='profiles_item_img'>
                            <img src={require('../img/myservices.png')}/>
                        </div>
                        <span>
                            Aliado
                        </span>
                    </Link>
                    <Link to={'/'} className='profiles_item'>
                        <div className='profiles_item_img'>
                            <img src={require('../img/logoblanco.png')}/>
                        </div>
                        <span>
                            Plataforma
                        </span>
                    </Link>
                    <Link to={'/'} className='profiles_item'>
                        <div className='profiles_item_img'>
                            <img src={require('../img/serviciocliente2.png')}/>
                        </div>
                        <span>
                            Solicitudes
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
}