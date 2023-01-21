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
                    <span id='cotizaciones_item_user'>
                        Marcelo De Leon
                    </span>
                    <span id='cotizaciones_item_id'>
                        id: 55
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
                    <span id='cotizaciones_item_user'>
                        Marcelo De Leon
                    </span>
                    <span id='cotizaciones_item_id'>
                        id: 55
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
                    <span id='cotizaciones_item_user'>
                        Marcelo De Leon
                    </span>
                    <span id='cotizaciones_item_id'>
                        id: 55
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