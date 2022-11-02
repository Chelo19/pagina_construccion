import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import '../styles/Header.css';


export default function Header(){
    return(
        <header className='background_img'>
            <div className='header'>
                <div className='header_top'>
                    <div className='header_top_info'>
                        <div className='header_top_info_row'>
                            <div id='phone'>
                                Cel: 8679999999
                            </div>
                            <div id='social'>
                                Redes sociales
                            </div>
                            <div id='contact'>
                                contacto@gmail.com
                            </div>
                        </div>
                    </div>
                </div>
                <div className='header_bottom'>
                    <div className='header_bottom_row'>
                        <div id='logo'>
                            DREC
                        </div>
                        <div className='header_bottom_row_buttons'>
                            <a className='header_bottom_row_buttons_individual'>
                                Home
                            </a>
                            <a className='header_bottom_row_buttons_individual'>
                                About us
                            </a>
                            <a className='header_bottom_row_buttons_individual'>
                                Cuenta
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}