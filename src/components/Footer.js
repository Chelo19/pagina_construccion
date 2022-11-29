import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import '../styles/Footer.css';
import { Link } from 'react-router-dom';

export default function Footer(){



    return(
        <footer>
            <div className='footer_background'>
                <nav className='footer_horizontal'>
                    <ul className='footer_vertical_left'></ul>
                    <ul className='footer_vertical_mid'>
                        <div className='mid_content'>
                            <span className='footer_titles'>Información y enlaces</span>
                            <li><Link to={'/'} style={{ color: 'inherit', textDecoration: 'inherit'}}>Inicio</Link></li>
                            <li><Link to={'/about-us'} style={{ color: 'inherit', textDecoration: 'inherit'}}>Nosotros</Link></li>
                            <li><Link to={'/client-service'} style={{ color: 'inherit', textDecoration: 'inherit'}}>Contacto</Link></li>
                            <li><Link to={'/account/'} style={{ color: 'inherit', textDecoration: 'inherit'}}>Cuenta</Link></li> 
                        </div>
                    </ul>
                    <ul className='footer_vertical_right'>
                        <div className='right_content'>
                            <span className='footer_titles'>Redes sociales y contacto</span>
                            <li>
                                <Link to={'/'} style={{ color: 'inherit', textDecoration: 'inherit'}}>
                                    <div className='logo_footer_div'>
                                        <img className='logo_footer' src={require('../img/certificate.png')}></img>
                                    </div>
                                    <span className='right_links'>Facebook</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={'/'} style={{ color: 'inherit', textDecoration: 'inherit'}}>
                                    <div className='logo_footer_div'>
                                        <img className='logo_footer' src={require('../img/certificate.png')}></img>
                                    </div>
                                    <span className='right_links'>Correo</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={'/'} style={{ color: 'inherit', textDecoration: 'inherit'}}>
                                <div className='logo_footer_div'>
                                        <img className='logo_footer' src={require('../img/certificate.png')}></img>
                                    </div>
                                    <span className='right_links'>Teléfono</span>
                                </Link>
                            </li>
                        </div>
                    </ul>
                </nav>
            </div>
        </footer>
    )
}