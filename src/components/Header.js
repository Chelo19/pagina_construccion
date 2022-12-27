import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import '../styles/Header.css';
import HeaderButtonsUser from './subcomponents/HeaderButtonsUser';
import HeaderButtonsNoUser from './subcomponents/HeaderButtonsNoUser';
import { Link } from 'react-router-dom';

export default function Header(){

    const [user, setUser] = useState(null);
    const [isBarMenu, setIsBarMenu] = useState(false);
    const [isLogged, setIsLogged] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [bars_menu_style, setBars_menu_style] = useState(null);
    var HeaderButtons;


    const controlNavbar = async () => {
        if(isBarMenu){
            console.log("entra a isbarmenu");
            setIsBarMenu(false);
            setBars_menu_style({ transition: "3s", top: "-500px" });
        }
        else{
            return;
        }
    };

    useEffect(() => {
        getUserMethod();
        window.addEventListener('scroll', controlNavbar);
    });
    
    const getUserMethod = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(user) {
            setIsLogged(true);
            setUser(user);
            const { data, error } = await supabase
            .from('account')
            .select()
            .eq('uuid', user.id);
            if(data[0].role == 'administrador' || data[0].role == 'gerente'){
                setIsAdmin(true);
            }
        }
    }

    const changeIsBarMenu = () => {
        if(isBarMenu){
            setIsBarMenu(false);
            setBars_menu_style({ transition: "3s", top: "-500px" });
        }
        if(!isBarMenu){
            setIsBarMenu(true);
            setBars_menu_style({ clipPath: "circle(150% at top right)", transition: "clip-path 1s", top: "0px" })
        }
    }

    const signOut = async (e) => {
        e.preventDefault();
        try{
            const { error } = await supabase.auth.signOut()
            console.log("SignOut");
            document.location.reload();
            if(error) throw error;
        } catch(e){
            alert(e.message);
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
                        <span>
                            Cel: 8679999999
                        </span>
                        <div id='social_media_header'>
                            <a target="_blank" className='logo_header_div' href={'https://www.facebook.com/GrupoDREC?mibextid=ZbWKwL'} style={{ color: 'inherit', textDecoration: 'inherit'}}>
                                <img src={require('../img/fbicon.png')}></img>
                            </a>
                            <a target="_blank" className='logo_header_div' href={'https://www.instagram.com/drec_constructor/'} style={{ color: 'inherit', textDecoration: 'inherit'}}>
                                <img src={require('../img/igicon.png')}></img>
                            </a>
                            <a target="_blank" className='logo_header_div' href={`/`} style={{ color: 'inherit', textDecoration: 'inherit'}}>
                                <img src={require('../img/mailicon.png')}></img>
                            </a>
                        </div>
                        <span>
                            contacto@gmail.com
                        </span>
                    </div>
                    <div className='header_bottom'>
                        <div className='header_bottom_row'>
                            <div className='logo_header'>
                            <Link to={`/0`}>
                                <img id='logoimg_header' src={require('../img/logodrecfullsize.png')}/>
                            </Link>
                            <Link to={`/0`} style={{ color: 'inherit', textDecoration: 'inherit'}} >
                                <a href='/0' id='logo'>DREC</a>
                            </Link>
                            </div>
                            <div className='header_buttons_container'>
                                {HeaderButtons}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='header_responsive'>
                <div className='logo_header'>
                    <Link to={`/0`}>
                        <img id='logoimg_header' src={require('../img/logodrecfullsize.png')}/>
                    </Link>
                    <Link to={`/0`} style={{ color: 'inherit', textDecoration: 'inherit'}} >
                        <a href='/0' id='logo'>DREC</a>
                    </Link>
                </div>
                <div className='bars_icon_container_background'>
                    <div className='bars_icon_container'>
                        <img id='bars_icon' onClick={changeIsBarMenu} src={require('../img/menudesplegable.png')}></img>
                    </div>
                </div>
            </div>
            <div className='bars_menu_div' style={bars_menu_style}>
                    <div id='bars_menu_item_menu'>
                        Menú principal
                    </div>
                    <div className='bars_menu_item'>
                        <Link to={'/0'} style={{ color: 'inherit', textDecoration: 'inherit'}} onClick={changeIsBarMenu}>
                            <a>Home</a>
                        </Link>
                    </div>
                    {isLogged ? (
                        <div className='bars_menu_item'>
                            <Link to={'/account'} style={{ color: 'inherit', textDecoration: 'inherit'}} onClick={changeIsBarMenu}>
                                <a>Cuenta</a>
                            </Link>
                        </div>
                    ):
                    <div className='bars_menu_item'>
                        <Link to={'/login'} style={{ color: 'inherit', textDecoration: 'inherit'}} onClick={changeIsBarMenu}>
                            <a>Inicia sesion</a>
                        </Link>
                    </div>
                    }
                    {/*<div className='bars_menu_item'>
                        <Link to={'/categories/1'} style={{ color: 'inherit', textDecoration: 'inherit'}} onClick={changeIsBarMenu}>
                            <a>Mis servicios</a>
                        </Link>
                    </div>*/}
                    <div className='bars_menu_item'>
                        <Link to={'/contact/0'} style={{ color: 'inherit', textDecoration: 'inherit'}} onClick={changeIsBarMenu}>
                            <a>Contacto</a>
                        </Link>
                    </div>
                    <div className='bars_menu_item'>
                        <Link to={'/about-us'} style={{ color: 'inherit', textDecoration: 'inherit'}} onClick={changeIsBarMenu}>
                            <a>Nosotros</a>
                        </Link>
                    </div>
                    <div className='bars_menu_item'>
                        <Link to={'/client-service/0'} style={{ color: 'inherit', textDecoration: 'inherit'}} onClick={changeIsBarMenu}>
                            <a>Servicio al cliente</a>
                        </Link>
                    </div>
                    {isLogged && (
                        <div className='bars_menu_item'>
                            <Link to={'/0'} style={{ color: 'inherit', textDecoration: 'inherit'}} onClick={signOut}>
                                <a>Cerrar Sesión</a>
                            </Link>
                        </div>
                    )}
                    {isAdmin && (
                        <div className='bars_menu_item' onClick={changeIsBarMenu}>
                            <Link to={'/admin-hub/0'} style={{ color: 'inherit', textDecoration: 'inherit'}} onClick={changeIsBarMenu}>
                                <a>Administrador</a>
                            </Link>
                        </div>
                    )}
                </div>
        </header>
    );
}