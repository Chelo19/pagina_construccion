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
                    <li><a href='/admin-hub'>Admin</a></li>   
                }
                <li><a href='/'>Home</a></li>
                <li>
                    <a href='/account'>Cuenta</a>
                    <ul className='vertical_menu_header'>
                        <li><a href='/my-services'>Mis Servicios</a></li>
                        <li><a href='/client-service'>Servicio al Cliente</a></li>
                        <li><a href='/' onClick={signOut}>Cerrar sesion</a></li>
                    </ul>
                </li>
            </ul>
        </div>
    )
}