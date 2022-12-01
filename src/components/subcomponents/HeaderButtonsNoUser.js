import { useEffect, useState } from 'react';
import {supabase} from '../../supabase/client';
import '../../styles/Header.css';
import { useNavigate } from "react-router-dom";

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
                    <li><a Link to="/admin-hub/" onClick={() => navigate(`/admin-hub`)}>Admin</a></li>   
                }
                <li><a Link to="/" onClick={() => navigate(`/`)}>Home</a></li>
                <li>
                    <a Link to="/account/" onClick={() => navigate(`/account`)}>Cuenta</a>
                    <ul className='vertical_menu_header'>
                        <li><a Link to="/my-services/" onClick={() => navigate(`/my-services`)}>Mis Servicios</a></li>
                        <li><a Link to="/client-service/" onClick={() => navigate(`/client-service`)}>Servicio al Cliente</a></li>
                        <li><a Link to="/" onClick={signOut}>Cerrar sesion</a></li>
                    </ul>
                </li>
            </ul>
        </div>
        
    )
}