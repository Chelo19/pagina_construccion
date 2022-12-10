import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import '../styles/Footer.css';
import { Link } from 'react-router-dom';

export default function Footer(){

    const [superAdminPhone, setSuperAdminPhone] = useState(+528672207801);



    return(
        <footer>
            <div className='footer_background'>
                <nav className='footer_horizontal'>
                    <ul className='footer_vertical_left'></ul>
                    <ul className='footer_vertical_mid'>
                        <div className='mid_content'>
                            <span className='footer_titles'>Información y enlaces</span>
                            <li><Link to={'/account/'} style={{ color: 'inherit', textDecoration: 'inherit'}}>Cuenta</Link></li> 
                        </div>
                    </ul>
                    <ul className='footer_vertical_right'>
                        <div className='right_content'>
                            <span className='footer_titles'>Redes sociales y contacto</span>
                            <li>
                                <a target="_blank" href={'https://www.facebook.com/GrupoDREC?mibextid=ZbWKwL'} style={{ color: 'inherit', textDecoration: 'inherit'}}>
                                    <div className='logo_footer_div'>
                                        <img className='logo_footer' src={require('../img/fbicon.png')}></img>
                                    </div>
                                    <span className='right_links'>Facebook</span>
                                </a>
                            </li>
                            <li>
                                <a target="_blank" href={'https://www.instagram.com/drec_constructor/'} style={{ color: 'inherit', textDecoration: 'inherit'}}>
                                    <div className='logo_footer_div'>
                                        <img className='logo_footer' src={require('../img/igicon.png')}></img>
                                    </div>
                                    <span className='right_links'>Instagram</span>
                                </a>
                            </li>
                            <li>
                                <a target="_blank" href={`https://wa.me/${superAdminPhone}`} style={{ color: 'inherit', textDecoration: 'inherit'}}>
                                <div className='logo_footer_div'>
                                        <img className='logo_footer' src={require('../img/whatsicon.png')}></img>
                                    </div>
                                    <span className='right_links'>Whatsapp</span>
                                </a>
                            </li>
                            <li>
                                <a target="_blank" href={'/'} style={{ color: 'inherit', textDecoration: 'inherit'}}>
                                    <div className='logo_footer_div'>
                                        <img className='logo_footer' src={require('../img/mailicon.png')}></img>
                                    </div>
                                    <span className='right_links'>Correo</span>
                                </a>
                            </li>
                        </div>
                    </ul>
                </nav>
            </div>
        </footer>
    )
}