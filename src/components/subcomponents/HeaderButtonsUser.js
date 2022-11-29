import { useEffect, useState } from 'react';
import {supabase} from '../../supabase/client';
import '../../styles/Header.css';
import { useNavigate } from "react-router-dom";

export default function HeaderButtonsUser(){
    const navigate = useNavigate();

    return(
        <div>
            <ul className='horizontal_menu_header'>
                <li><a Link to="/login/" onClick={() => navigate(`/login`)}>Login</a></li>
                <li><a Link to="/register/" onClick={() => navigate(`/register`)}>Register</a></li>
            </ul>
        </div>
    )
}