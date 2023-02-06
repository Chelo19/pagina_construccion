import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/Header2.css';
import { Link } from "react-router-dom";

import CottageIcon from '@mui/icons-material/Cottage';
import CottageOutlinedIcon from '@mui/icons-material/CottageOutlined';
import PersonIcon from '@mui/icons-material/Person';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import GroupsIcon from '@mui/icons-material/Groups';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import Person2 from '@mui/icons-material/Person2';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import PeopleIcon from '@mui/icons-material/People';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import HubIcon from '@mui/icons-material/Hub';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';


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
                    <Link to={'/'} className='nav_item_listed' onClick={ () => setIsOpen(!isOpen)}><CottageOutlinedIcon color='secondary' fontSize='large'/>&nbsp;&nbsp;&nbsp;&nbsp;<span>Inicio</span></Link>
                    <Link to={`/profile/${userId}`} className='nav_item_listed' onClick={ () => setIsOpen(!isOpen)}><PersonOutlineOutlinedIcon color='secondary' fontSize='large'/>&nbsp;&nbsp;&nbsp;&nbsp;<span>Perfil</span></Link>
                    <Link to={'/contact/0'} className='nav_item_listed' onClick={ () => setIsOpen(!isOpen)}><SupportAgentOutlinedIcon color='secondary' fontSize='large'/>&nbsp;&nbsp;&nbsp;&nbsp;<span>Contacto</span></Link>
                    <Link to={'/about-us'} className='nav_item_listed' onClick={ () => setIsOpen(!isOpen)}><GroupsOutlinedIcon color='secondary' fontSize='large'/>&nbsp;&nbsp;&nbsp;&nbsp;<span>Nosotros</span></Link>
                    <Link to={'/'} className='nav_item_listed' onClick={ () => setIsOpen(!isOpen)}><Person2OutlinedIcon color='secondary' fontSize='large'/>&nbsp;&nbsp;&nbsp;&nbsp;<span>Aliado</span></Link>
                    {isAdmin &&
                        <>
                            <Link to={'/profiles'} className='nav_item_listed' onClick={ () => setIsOpen(!isOpen)}><PeopleAltOutlinedIcon color='secondary' fontSize='large'/>&nbsp;&nbsp;&nbsp;&nbsp;<span>Perfiles</span></Link>
                            <Link to={'/admin-hub/0'} className='nav_item_listed' onClick={ () => setIsOpen(!isOpen)}><AdminPanelSettingsOutlinedIcon color='secondary' fontSize='large'/>&nbsp;&nbsp;&nbsp;&nbsp;<span>Admin Hub</span></Link>
                        </>}
                    {isManager &&
                        <>
                            <Link to={'/manager-hub/0'} className='nav_item_listed' onClick={ () => setIsOpen(!isOpen)}><HubOutlinedIcon color='secondary' fontSize='large'/>&nbsp;&nbsp;&nbsp;&nbsp;<span>Manager Hub</span></Link>
                        </>}
                    {isLogged ?
                        <Link to={'/0'} className='nav_item_listed' onClick={signOut}><LogoutIcon color='secondary' fontSize='large'/>&nbsp;&nbsp;&nbsp;&nbsp;<span>Cerrar Sesión</span></Link>
                    : <>
                        <Link to={'/login'} className='nav_item_listed' onClick={ () => setIsOpen(!isOpen)}><LoginIcon color='secondary' fontSize='large'/>&nbsp;&nbsp;&nbsp;&nbsp;<span>Iniciar Sesión</span></Link>
                        <Link to={'/register'} className='nav_item_listed' onClick={ () => setIsOpen(!isOpen)}><HowToRegOutlinedIcon color='secondary' fontSize='large'/>&nbsp;&nbsp;&nbsp;&nbsp;<span>Registrarse</span></Link>
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