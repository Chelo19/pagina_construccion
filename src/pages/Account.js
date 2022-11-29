import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {supabase} from '../supabase/client';
import '../styles/Account.css';

export default function Account(){

    const [name, getName] = useState(null);
    const [email, getEmail] = useState(null);
    const [location, getLocation] = useState(null);
    const [newLocation, getNewLocation] = useState(null);

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

    const updateLocation = async () => {
        console.log(newLocation);
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
        .from('account')
        .update({location: newLocation})
        .eq('uuid', user.id);
    }

    return(
        <div className='account_background'>
            <div className='selections'>
                <a href='/my-services' className='selections_item' id='my_services_grid'>
                    <div className='selections_item_left'>
                        <a Link to="/my-services/" onClick={() => navigate(`/my-services`)} className='selection_logo'>
                            <img src={require('../img/package.png')} id='package'/>
                        </a>
                    </div>
                    <div className='selections_item_right'>
                        <a Link to="/my-services/" onClick={() => navigate(`/my-services`)} className='selections_item_title'>
                            <span>Mis servicios</span>
                        </a>
                        <a Link to="/my-services/" onClick={() => navigate(`/my-services`)} className='selections_item_description'>
                            <span>Revisa el estado del servicio que hayas contratado</span>
                        </a>
                    </div>
                </a>
                <a Link to="/client-service/" onClick={() => navigate(`/client-service`)} className='selections_item' id='client_service_grid'>
                    <div className='selections_item_left'>
                        <a Link to="/client-service/" onClick={() => navigate(`/client-service`)} className='selection_logo'>
                            <img src={require('../img/serviciocliente.png')} id='package'/>
                        </a>
                    </div>
                    <div className='selections_item_right'>
                        <a Link to="/client-service/" onClick={() => navigate(`/client-service`)} className='selections_item_title'>
                            <span>Servicio al cliente</span>
                        </a>
                        <a Link to="/client-service/" onClick={() => navigate(`/client-service`)} className='selections_item_description'>
                            <span>Contacta con un socio para resolver dudas que tengas</span>
                        </a>
                    </div>
                </a>
                <a className='selections_item' id='account_grid'>
                    <div className='account_data'>
                        <a className='selection_logo'>
                            <img src={require('../img/cuenta.png')} id='package'/>
                        </a>
                        <div className='account_data_title'>
                            <span>¡Hola {name}!</span>
                        </div>
                        <div className='account_data_info'>
                            <span>Nombre: {name}</span><br/>
                            <span>Email: {email}</span><br/>
                            <span>Location: {location}</span><br/>
                            <span>Cambiar localización:</span><br/>
                            <div className='change_location_account'>
                                <form onSubmit={updateLocation()}>
                                    <select onChange={(e) => getNewLocation(e.target.value)}>
                                        <option value={"Monterrey"}>Localización</option>
                                        <option value={"Monterrey"}>Monterrey</option>
                                        <option value={"Sabinas"}>Sabinas</option>
                                        <option value={"Nuevo Laredo"}>Nuevo Laredo</option>
                                    </select>
                                </form>
                            </div><br/>
                            <a Link to="/update-password/" onClick={() => navigate(`/update-password`)} id='link'>Haz click aquí si deseas cambiar tu contraseña</a>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    )
}
