import { useEffect, useState } from 'react';
import {supabase} from '../../supabase/client';
import '../../styles/Header.css';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

export default function HeaderButtonsUser(){
    const navigate = useNavigate();

    return(
        <div>
            <ul className='horizontal_menu_header'>
                
                <li><a><Link to={`/`} style={{ color: 'inherit', textDecoration: 'inherit'}}>
                    Inicio
                </Link></a></li>
                <li><a><Link to={`/login/`} style={{ color: 'inherit', textDecoration: 'inherit'}}>
                    Iniciar Sesión
                </Link></a></li>
                <li><a><Link to={`/register/`} style={{ color: 'inherit', textDecoration: 'inherit'}}>
                    Registrarse
                </Link></a></li>
            </ul>
        </div>
    )
}