import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/Cotizaciones.css';
import LoadingScreen from '../components/LoadingScreen';
import { Link } from "react-router-dom";

export default function Cotizaciones(){
    const navigate = useNavigate();

    return(
        <div className='cotizaciones_background'>
            <div className='cotizaciones_container'>
            <div className='cotizaciones_item'>
                    <div className='cotizaciones_item_container'>
                        <span id='cotizaciones_item_user'>
                            <Link to={'/profile/314'}>
                                Marcelo Amado De Leon Gomez
                            </Link>
                        </span>
                        <span id='cotizaciones_item_id'>
                            <Link to={'/profile/314'}>
                                id: 55
                            </Link>
                        </span>
                        <span id='cotizaciones_item_action'>
                            Quiere cotizar
                        </span>
                        <span id='cotizaciones_item_service'>
                            Servicio "Construccion"
                        </span>
                        <span id='cotizaciones_item_category'>
                            Categoria "Remodelacion"
                        </span>
                    </div>
                    <div className='cotizaciones_item_buttons'>
                        <Link to={'/select-allies'} className='cotizaciones_item_button'>
                            <img src={require('../img/usuario_header2.png')}/>
                        </Link>
                        <div className='cotizaciones_item_button'>
                            +
                        </div>
                    </div>
                </div>
                <div className='cotizaciones_item'>
                    <div className='cotizaciones_item_container'>
                        <span id='cotizaciones_item_user'>
                            <Link to={'/profile/314'}>
                                Marcelo Amado De Leon Gomez
                            </Link>
                        </span>
                        <span id='cotizaciones_item_id'>
                            <Link to={'/profile/314'}>
                                id: 55
                            </Link>
                        </span>
                        <span id='cotizaciones_item_action'>
                            Quiere cotizar
                        </span>
                        <span id='cotizaciones_item_service'>
                            Servicio "Construccion" y servicios de todo tipo aeriahrea rmiaernm  ranieraior ieurharijeji
                        </span>
                        <span id='cotizaciones_item_category'>
                            Categoria "Remodelacion" y servicios de todo tipo
                        </span>
                    </div>
                    <div className='cotizaciones_item_buttons'>
                        <div className='cotizaciones_item_button'>
                            <img src={require('../img/usuario_header2.png')}/>
                        </div>
                        <div className='cotizaciones_item_button'>
                            +
                        </div>
                    </div>
                </div>
                <div className='cotizaciones_item'>
                    <div className='cotizaciones_item_container'>
                        <span id='cotizaciones_item_user'>
                            <Link to={'/profile/314'}>
                                Marcelo Amado De Leon Gomez
                            </Link>
                        </span>
                        <span id='cotizaciones_item_id'>
                            <Link to={'/profile/314'}>
                                id: 55
                            </Link>
                        </span>
                        <span id='cotizaciones_item_action'>
                            Quiere cotizar
                        </span>
                        <span id='cotizaciones_item_service'>
                            Servicio "Construccion"
                        </span>
                        <span id='cotizaciones_item_category'>
                            Categoria "Remodelacion" y servicios de todo tipo
                        </span>
                    </div>
                    <div className='cotizaciones_item_buttons'>
                        <div className='cotizaciones_item_button'>
                            <img src={require('../img/usuario_header2.png')}/>
                        </div>
                        <div className='cotizaciones_item_button'>
                            +
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}