import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/Header2.css';
import { Link } from "react-router-dom";

import CottageIcon from '@mui/icons-material/Cottage';
import PersonIcon from '@mui/icons-material/Person';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import GroupsIcon from '@mui/icons-material/Groups';
import Person2 from '@mui/icons-material/Person2';
import PeopleIcon from '@mui/icons-material/People';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HubIcon from '@mui/icons-material/Hub';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';


export default function Header(){
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const [isLogged, setIsLogged] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isManager, setIsManager] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        getUserMethod();
    }, []);

    const getUserMethod = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(user) {
            setIsLogged(true);
            const { data, error } = await supabase
            .from('account')
            .select()
            .eq('uuid', user.id);
            setUserId(data[0].id);
            if(data[0].role == 'administrador' || data[0].role == 'gerente'){
                setIsAdmin(true);
            }
            if(data[0].role == 'gerente'){
                setIsManager(true);
            }
        }
    }

    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
        document.location.reload();
    }

    return(
        <div className="navbar">
            <div className='navbar_container'>
                <div className='nav_logo_container'>
                    <Link to={'/'} className='nav_logo_drec'>
                        <img src={require('../img/logoblanco.png')}/>
                    </Link>
                    <Link to={'/'} className="nav_logo">DREC</Link>
                </div>
                <div className={`nav_items ${isOpen && "open"}`}>
                    <Link to={'/'} className='nav_item_listed' onClick={ () => setIsOpen(!isOpen)}><CottageIcon color='secondary' fontSize='large'/>&nbsp;&nbsp;&nbsp;&nbsp;<span>Inicio</span></Link>
                    <Link to={`/profile/${userId}`} className='nav_item_listed' onClick={ () => setIsOpen(!isOpen)}><PersonIcon color='secondary' fontSize='large'/>&nbsp;&nbsp;&nbsp;&nbsp;<span>Perfil</span></Link>
                    <Link to={'/contact/0'} className='nav_item_listed' onClick={ () => setIsOpen(!isOpen)}><SupportAgentIcon color='secondary' fontSize='large'/>&nbsp;&nbsp;&nbsp;&nbsp;<span>Contacto</span></Link>
                    <Link to={'/about-us'} className='nav_item_listed' onClick={ () => setIsOpen(!isOpen)}><GroupsIcon color='secondary' fontSize='large'/>&nbsp;&nbsp;&nbsp;&nbsp;<span>Nosotros</span></Link>
                    <Link to={'/'} className='nav_item_listed' onClick={ () => setIsOpen(!isOpen)}><Person2 color='secondary' fontSize='large'/>&nbsp;&nbsp;&nbsp;&nbsp;<span>Aliado</span></Link>
                    {isAdmin &&
                        <>
                            <Link to={'/profiles'} className='nav_item_listed' onClick={ () => setIsOpen(!isOpen)}><PeopleIcon color='secondary' fontSize='large'/>&nbsp;&nbsp;&nbsp;&nbsp;<span>Perfiles</span></Link>
                            <Link to={'/admin-hub/0'} className='nav_item_listed' onClick={ () => setIsOpen(!isOpen)}><AdminPanelSettingsIcon color='secondary' fontSize='large'/>&nbsp;&nbsp;&nbsp;&nbsp;<span>Admin Hub</span></Link>
                        </>}
                    {isManager &&
                        <>
                            <Link to={'/manager-hub/0'} className='nav_item_listed' onClick={ () => setIsOpen(!isOpen)}><HubIcon color='secondary' fontSize='large'/>&nbsp;&nbsp;&nbsp;&nbsp;<span>Manager Hub</span></Link>
                        </>}
                    {isLogged ?
                        <Link to={'/0'} className='nav_item_listed' onClick={signOut}><LogoutIcon color='secondary' fontSize='large'/>&nbsp;&nbsp;&nbsp;&nbsp;<span>Cerrar Sesión</span></Link>
                    : <>
                        <Link to={'/login'} className='nav_item_listed' onClick={ () => setIsOpen(!isOpen)}><LoginIcon color='secondary' fontSize='large'/>&nbsp;&nbsp;&nbsp;&nbsp;<span>Iniciar Sesión</span></Link>
                        <Link to={'/register'} className='nav_item_listed' onClick={ () => setIsOpen(!isOpen)}><HowToRegIcon color='secondary' fontSize='large'/>&nbsp;&nbsp;&nbsp;&nbsp;<span>Registrarse</span></Link>
                    </>}
                </div>
                <div className={`nav_toggle ${isOpen && "open"}`} onClick={ () => setIsOpen(!isOpen)} >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    );
}