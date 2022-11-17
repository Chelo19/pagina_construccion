import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {supabase} from '../supabase/client';
import '../styles/Account.css';

export default function Account(){

    const [name, getName] = useState(null);
    const [email, getEmail] = useState(null);
    const [location, getLocation] = useState(null);

    const navigate = useNavigate(); 

    useEffect(() => {
        userData();
    });

    const userData = async () => {
        getUserData();
    }

    const getUserData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(!user) navigate('/Login');
        const { data, error } = await supabase
        .from('account')
        .select()
        .eq('uuid', user.id);
        getName(data[0].name);
        getEmail(data[0].email);
        getLocation(data[0].location);
    }

    return(
        <div className='account_background'>
            <div className='selections'>
                <a href='/my-services' className='selections_item' id='my_services_grid'>
                    <div className='selections_item_left'>
                        <a href='/my-services' id='package' className='selection_logo'>
                            <img src={require('../img/package.png')} id='package'/>
                        </a>
                    </div>
                    <div className='selections_item_right'>
                        <a href='/my-services' className='selections_item_title'>
                            <span>Mis servicios</span>
                        </a>
                        <a href='/my-services' className='selections_item_description'>
                            <span>Revisa el estado del servicio que hayas contratado</span>
                        </a>
                    </div>
                </a>
                <a href='/client-service' className='selections_item' id='client_service_grid'>
                    <div className='selections_item_left'>
                        <a href='/client-service' id='package' className='selection_logo'>
                            <img src={require('../img/serviciocliente.png')} id='package'/>
                        </a>
                    </div>
                    <div className='selections_item_right'>
                        <a href='/client-service' className='selections_item_title'>
                            <span>Servicio al cliente</span>
                        </a>
                        <a href='/client-service' className='selections_item_description'>
                            <span>Contacta con un socio para resolver dudas que tengas</span>
                        </a>
                    </div>
                </a>
                <a className='selections_item' id='account_grid'>
                    <div className='account_data'>
                        <a id='package' className='selection_logo'>
                                <img src={require('../img/cuenta.png')} id='package'/>
                        </a>
                        <div className='account_data_title'>
                            <span>¡Hola {name}!</span>
                        </div>
                        <div className='account_data_info'>
                            <span>Nombre: {name}</span><br/>
                            <span>Email: {email}</span><br/>
                            <span>Location: {location}</span><br/>
                            <a href='/login' id='link'>Haz click aquí si deseas cambiar tu dirección</a><br/>
                            <a href='/update-password' id='link'>Haz click aquí si deseas cambiar tu contraseña</a>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    )
}
