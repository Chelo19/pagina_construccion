import { useEffect, useState } from 'react';
import {supabase} from '../../supabase/client';
import '../../styles/Header.css';
import { useNavigate } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Link } from 'react-router-dom';
import { appHistory } from '../../App';

export default function HeaderButtonsNoUser(){
    
    const [role, getRole] = useState('cliente');
    const [adminPermissions, setAdminPermissions] = useState(false);
    const navigate = useNavigate();
    // const history = createBrowserHistory();


    // const refreshPage  = () => {
    //     history.go(0)
    // }

    // const reload = () => {
    //     const current = props.location.pathname;
    //     this.props.history.replace(`/reload`);
    //        setTimeout(() => {
    //          this.props.history.replace(current);
    //        });
    //    }
    
    useEffect(() => {
        getUserData();
    })

    const getUserData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
        .from('account')
        .select()
        .eq('uuid', user.id);
        getRole(data[0].role);
        if(role == 'administrador' || role == 'gerente'){
            setAdminPermissions(true);
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
        navigate(`/`);
    }

    return(
        <div className='header_buttons'>
            <ul className='horizontal_menu_header'>
                {adminPermissions &&
                <li><a><Link to={`/admin-hub/0`} style={{ color: 'inherit', textDecoration: 'inherit'}}>
                    Administrador
                </Link></a></li>  
                }
                <li><a><Link to={`/0`} style={{ color: 'inherit', textDecoration: 'inherit'}}>
                    Inicio
                </Link></a></li>
                <li>
                    <a><Link to={`/0`} style={{ color: 'inherit', textDecoration: 'inherit'}}>
                        Opciones
                    </Link></a>
                    <ul className='vertical_menu_header'>
                        <li><Link to={`/0`} style={{ color: 'inherit', textDecoration: 'inherit'}}>Menú principal</Link></li>
                        <li><Link to={`/account/`} style={{ color: 'inherit', textDecoration: 'inherit'}}>Cuenta</Link></li>
                        {/*<li><Link to={`/my-services/`} style={{ color: 'inherit', textDecoration: 'inherit'}}>Mis Servicios</Link></li>*/}
                        <li><Link to={`/contact/0`} style={{ color: 'inherit', textDecoration: 'inherit'}}>Contacto</Link></li>
                        <li><Link to={`/about-us`} style={{ color: 'inherit', textDecoration: 'inherit'}}>Nosotros</Link></li>
                        <li><Link to={`/client-service/0`} style={{ color: 'inherit', textDecoration: 'inherit'}}>Servicio al Cliente</Link></li>
                        <li><Link to={`/`} style={{ color: 'inherit', textDecoration: 'inherit'}} onClick={signOut}>Cerrar sesion</Link></li>
                    </ul>
                </li>
            </ul>
        </div>
        
    )
}