import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/AdminHub.css';

export default function AdminHub(){
    const navigate = useNavigate();

    useEffect(() => {
        getUserMethod();
    }, []);

    const getUserMethod = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(user){
            const { data, error } = await supabase
            .from('account')
            .select()
            .eq('uuid', user.id);
            console.log(data[0].role);
            if(data[0].role != 'administrador'){
                navigate("/Login");
            }
        }
        else{
            navigate("/Login");
        }
    }


    return(
        <div className="admin_background">
            <div className='selections'>
                <a href='/edit-services' id='edit_services' className='selections_item'>
                    <div className='selections_item_left'>
                        <a href='/edit-services' id='package' className='selection_logo'>
                            <img src={require('../img/package.png')} id='package'/>
                        </a>
                    </div>
                    <div className='selections_item_right'>
                        <a href='/edit-services' className='selections_item_title'>
                            <span>Editar Servicios</span>
                        </a>
                        <a href='/edit-services' className='selections_item_description'>
                            <span>Edita los datos de un servicio en específico</span>
                        </a>
                    </div>
                </a>
                <a href='/admin-hub' id='edit_users' className='selections_item'>
                    <div className='selections_item_left'>
                        <a href='/admin-hub' id='package' className='selection_logo'>
                            <img src={require('../img/package.png')} id='package'/>
                        </a>
                    </div>
                    <div className='selections_item_right'>
                        <a href='/admin-hub' className='selections_item_title'>
                            <span>Editar Usuarios</span>
                        </a>
                        <a href='/admin-hub' className='selections_item_description'>
                            <span>Edita los datos de un usuario en específico</span>
                        </a>
                    </div>
                </a>
                <a href='/admin-hub' id='edit_something' className='selections_item'>
                    <div className='selections_item_left'>
                        <a href='/admin-hub' id='package' className='selection_logo'>
                            <img src={require('../img/package.png')} id='package'/>
                        </a>
                    </div>
                    <div className='selections_item_right'>
                        <a href='/admin-hub' className='selections_item_title'>
                            <span>Edita algo</span>
                        </a>
                        <a href='/admin-hub' className='selections_item_description'>
                            <span>Edita los datos de algo   </span>
                        </a>
                    </div>
                </a>
            </div>
        </div>
    )
}