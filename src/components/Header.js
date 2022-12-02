import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import '../styles/Header.css';
import HeaderButtonsUser from './subcomponents/HeaderButtonsUser';
import HeaderButtonsNoUser from './subcomponents/HeaderButtonsNoUser';
import { Link } from 'react-router-dom';

export default function Header(){

    const [user, setUser] = useState(null);
    const [isBarMenu, setIsBarMenu] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    var HeaderButtons;

    useEffect(() => {
        getUserMethod();
    });
    
    const getUserMethod = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(user) setUser(user);
    }

    const changeIsBarMenu = () => {
        if(isBarMenu){
            setIsBarMenu(false);
        }
        if(!isBarMenu){
            setIsBarMenu(true);
        }
    }

    if(user){
        HeaderButtons = <HeaderButtonsNoUser/>;
    }
    else{
        HeaderButtons = <HeaderButtonsUser/>;
    }
    
    return(
        <header>
            <div className='header_default'>
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
                            <div className='logo_header'>
                                <a href='/'><img id='logoimg_header' src={require('../img/logodrecfullsize.png')}/></a>
                                <a href='/' id='logo'>DREC</a>
                            </div>
                            <div className='header_buttons_container'>
                                {HeaderButtons}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='header_responsive'>
                <div className='header_responsive_background'/>
                <div className='logo_header'>
                    <a href='/'><img id='logoimg_header' src={require('../img/logodrecfullsize.png')}/></a>
                    <a href='/' id='logo'>DREC</a>
                </div>
                <div className='bars_menu'>
                    <div className='bars_icon_container_background'>
                        <div className='bars_icon_container'>
                            <img id='bars_icon' onClick={changeIsBarMenu} src={require('../img/menudesplegable.png')}></img>
                        </div>
                    </div>
                    {!isBarMenu ? (
                        <div className='bars_menu_div'>
                            <div className='bars_menu_item' onClick={changeIsBarMenu}>
                                <Link to={'/'} style={{ color: 'inherit', textDecoration: 'inherit'}}>
                                    <a>Menu Principal</a>
                                </Link>
                            </div>
                            <div className='bars_menu_item' onClick={changeIsBarMenu}>
                                <Link to={'/account'} style={{ color: 'inherit', textDecoration: 'inherit'}}>
                                    <a>Cuenta</a>
                                </Link>
                            </div>
                            <div className='bars_menu_item' onClick={changeIsBarMenu}>
                                <Link to={'/categories/1'} style={{ color: 'inherit', textDecoration: 'inherit'}}>
                                    <a>Contenido</a>
                                </Link>
                            </div>
                            {!isAdmin && (
                                <div className='bars_menu_item' onClick={changeIsBarMenu}>
                                    <Link to={'/admin-hub'} style={{ color: 'inherit', textDecoration: 'inherit'}}>
                                        <a>Administrador</a>
                                    </Link>
                                </div>
                            )}
                        </div>
                    ): <></>}
                </div>
            </div>
        </header>
    );
}