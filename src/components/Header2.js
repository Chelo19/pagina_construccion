import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/Header2.css';
import LoadingScreen from '../components/LoadingScreen';
import { Link } from "react-router-dom";


export default function Header(){
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const [isLogged, setIsLogged] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isManager, setIsManager] = useState(false);

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
                    <Link to={'/'} className='nav_item_listed' onClick={ () => setIsOpen(!isOpen)}><span>Inicio</span></Link>
                    <Link to={'/account'} className='nav_item_listed' onClick={ () => setIsOpen(!isOpen)}><span>Perfil</span></Link>
                    <Link to={'/contact/0'} className='nav_item_listed' onClick={ () => setIsOpen(!isOpen)}><span>Contacto</span></Link>
                    <Link to={'/about-us'} className='nav_item_listed' onClick={ () => setIsOpen(!isOpen)}><span>Nosotros</span></Link>
                    <Link to={'/'} className='nav_item_listed' onClick={ () => setIsOpen(!isOpen)}><span>Aliado</span></Link>
                    {isAdmin &&
                        <>
                            <Link to={'/profiles'} className='nav_item_listed' onClick={ () => setIsOpen(!isOpen)}><span>Perfiles</span></Link>
                            <Link to={'/admin-hub/0'} className='nav_item_listed' onClick={ () => setIsOpen(!isOpen)}><span>Admin Hub</span></Link>
                        </>}
                    {isManager &&
                        <>
                            <Link to={'/manager-hub/0'} className='nav_item_listed' onClick={ () => setIsOpen(!isOpen)}><span>Manager Hub</span></Link>
                        </>}
                    {isLogged ?
                        <Link to={'/0'} className='nav_item_listed' onClick={signOut}><span>Cerrar Sesión</span></Link>
                    : <>
                        <Link to={'/login'} className='nav_item_listed' onClick={ () => setIsOpen(!isOpen)}><span>Iniciar Sesión</span></Link>
                        <Link to={'/register'} className='nav_item_listed' onClick={ () => setIsOpen(!isOpen)}><span>Registrarse</span></Link>
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