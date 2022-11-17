import { useEffect, useState } from 'react';
import {supabase} from '../../supabase/client';
import '../../styles/Header.css';

export default function HeaderButtonsUser(){

    return(
        <div>
            <ul className='horizontal_menu_header'>
                <li><a href='/login'>Login</a></li>
                <li><a href='/register'>Register</a></li>
            </ul>
        </div>
    )
}