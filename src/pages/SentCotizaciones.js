import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/Cotizaciones.css';
import LoadingScreen from '../components/LoadingScreen';
import { Link } from "react-router-dom";

export default function SentCotizaciones(){
    const navigate = useNavigate();

    return(
        <div className='cotizaciones_background'>
            <div className='cotizaciones_container'>
                <div className='cotizaciones_item'>
                    <div className='sent_cotizaciones_item_container'>
                        <span id='cotizaciones_title'>
                            Levantamiento de muro
                        </span>
                        <a href=''>
                            <span id='cotizaciones_drive'>
                                Link drive
                            </span>
                        </a>
                        <span id='cotizaciones_instructions'>
                            Selecciona la cotización que se adecúe a tus necesidades
                        </span>
                        <div className='sent_cotizaciones_item_buttons'>
                            <div className='sent_cotizaciones_item_button'>
                                A
                            </div>
                            <div className='sent_cotizaciones_item_button'>
                                B
                            </div>
                            <div className='sent_cotizaciones_item_button'>
                                C
                            </div>
                        </div>
                    </div>
                </div>
                <div className='cotizaciones_item'>
                    <div className='sent_cotizaciones_item_container'>
                        <span id='cotizaciones_title'>
                            Ampliacion de sala
                        </span>
                        <a href=''>
                            <span id='cotizaciones_drive'>
                                Link drive
                            </span>
                        </a>
                        <span id='cotizaciones_instructions'>
                            Selecciona la cotización que se adecúe a tus necesidades
                        </span>
                        <div className='sent_cotizaciones_item_buttons'>
                            <div className='sent_cotizaciones_item_button'>
                                A
                            </div>
                            <div className='sent_cotizaciones_item_button'>
                                B
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}