import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/Profiles.css';
import { Link } from "react-router-dom";

export default function AllyHub(){
    const navigate = useNavigate();

    return(
        <div className='profiles_background'>
            <div className='profiles_container'>
                <div className='profiles_gallery'>
                    <Link to={'/cotizaciones-pendientes-aliado'} className='profiles_item'>
                        <div className='profiles_item_container'>
                            <div className='profiles_item_img'>
                                <img src={require('../img/cotizaciones.png')}/>
                            </div>
                            <span className='profiles_item_title'>
                                Cotizaciones pendientes
                            </span>
                        </div>
                    </Link>
                    <Link to={'/proyectos-aceptados-aliado'} className='profiles_item'>
                        <div className='profiles_item_container'>
                            <div className='profiles_item_img'>
                                <img src={require('../img/servicios.png')}/>
                            </div>
                            <span className='profiles_item_title'>
                                Proyectos aceptados
                            </span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}