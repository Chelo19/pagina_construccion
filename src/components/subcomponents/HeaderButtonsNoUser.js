import { useEffect, useState } from 'react';
import {supabase} from '../../supabase/client';
import '../../styles/Header.css';

export default function HeaderButtonsNoUser(){
    
    const [role, getRole] = useState('cliente');
    
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
    }

    return(
        <div className='header_buttons'>
            <ul className='horizontal_menu_header'>
                {role == 'administrador' &&
                    <li><a Link to="/admin-hub/">Admin</a></li>   
                }
                <li><a Link to="/">Home</a></li>
                <li>
                    <a Link to="/account/">Cuenta</a>
                    <ul className='vertical_menu_header'>
                        <li><a Link to="/my-services/">Mis Servicios</a></li>
                        <li><a Link to="/client-service/">Servicio al Cliente</a></li>
                        <li><a Link to="/"onClick={signOut}>Cerrar sesion</a></li>
                    </ul>
                </li>
            </ul>
        </div>
    )
}