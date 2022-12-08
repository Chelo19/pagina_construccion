import { useEffect, useState } from 'react';
import {supabase} from '../../supabase/client';
import '../../styles/Header.css';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

export default function HeaderButtonsNoUser(){
    
    const [role, getRole] = useState('cliente');
    const navigate = useNavigate();
    
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
                {role == 'administrador' &&
                <li><a><Link to={`/admin-hub/`} style={{ color: 'inherit', textDecoration: 'inherit'}}>
                    Administrador
                </Link></a></li>  
                }
                <li><a><Link to={`/`} style={{ color: 'inherit', textDecoration: 'inherit'}}>
                    Inicio
                </Link></a></li>
                <li>
                    <a><Link to={`/`} style={{ color: 'inherit', textDecoration: 'inherit'}}>
                        Opciones
                    </Link></a>
                    <ul className='vertical_menu_header'>
                        <li><Link to={`/`} style={{ color: 'inherit', textDecoration: 'inherit'}}>Menú principal</Link></li>
                        <li><Link to={`/account/`} style={{ color: 'inherit', textDecoration: 'inherit'}}>Cuenta</Link></li>
                        {/*<li><Link to={`/my-services/`} style={{ color: 'inherit', textDecoration: 'inherit'}}>Mis Servicios</Link></li>*/}
                        <li><Link to={`/`} style={{ color: 'inherit', textDecoration: 'inherit'}}>Contacto</Link></li>
                        <li><Link to={`/`} style={{ color: 'inherit', textDecoration: 'inherit'}}>Nosotros</Link></li>
                        <li><Link to={`/client-service/`} style={{ color: 'inherit', textDecoration: 'inherit'}}>Servicio al Cliente</Link></li>
                        <li><Link to={`/`} style={{ color: 'inherit', textDecoration: 'inherit'}} onClick={signOut}>Cerrar sesion</Link></li>
                    </ul>
                </li>
            </ul>
        </div>
        
    )
}