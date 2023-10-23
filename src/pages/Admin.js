import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/Profiles.css';
// import '../styles/Admin.css';
import { Link } from "react-router-dom";

export default function Admin(){
    const navigate = useNavigate();

    return(
        <div className='profiles_background'>
            <div className='profiles_container'>
                <div className='profiles_gallery'>
                    <Link to={'/accepted-cotizaciones'} className='profiles_item'>
                        <div className='profiles_item_container'>
                            <div className='profiles_item_img'>
                                <img src={require('../img/cotizaciones.png')}/>
                            </div>
                            <span className='profiles_item_title'>
                                Cotizaciones aceptadas
                            </span>
                        </div>
                    </Link>
                    <Link to={'/proyectos-actuales'} className='profiles_item'>
                        <div className='profiles_item_container'>
                            <div className='profiles_item_img'>
                                <img src={require('../img/cotizaciones.png')}/>
                            </div>
                            <span className='profiles_item_title'>
                                Proyectos
                            </span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}