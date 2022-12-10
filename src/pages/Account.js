import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {supabase} from '../supabase/client';
import '../styles/Account.css';
import LoadingScreen from "../components/LoadingScreen";
import { Link } from 'react-router-dom';

export default function Account(){

    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [newLocationId, setNewLocationId] = useState(null);
    const [locationName, setLocationName] = useState(null);
    var locationId = null;
    
    const [loadingScreen, setLoadingScreen] = useState(true);

    const navigate = useNavigate(); 

    useEffect(() => {
        getUserData();
    }, [loadingScreen]);

    const getUserData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(!user) navigate('/Login');
        const { data, error } = await supabase
        .from('account')
        .select()
        .eq('uuid', user.id);
        setName(data[0].name);
        setEmail(data[0].email);
        locationId = data[0].location_id;
        getLocationName();
        setLoadingScreen(false);
    }

    const updateLocation = async () => {
        if(newLocationId == 0 || newLocationId == null){
            window.alert("Por favor selecciona una localización válida");
            return;
        }
        else{
            const { data: { user } } = await supabase.auth.getUser();
            const { data, error } = await supabase
            .from('account')
            .update({ location_id: newLocationId })
            .eq('uuid', user.id);
            document.location.reload();
        }
    }

    const getLocationName = async () => {
        const { data, error } = await supabase
        .from('location')
        .select()
        .eq('id', locationId);
        setLocationName(data[0].name);
    }

    return(
        <div className='account_background'>
            {!loadingScreen ? (
            <div className='selections'>
                <Link to={"/my-services/"} onClick={() => navigate(`/my-services`)} className='selections_item' id='my_services_grid'>
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
                </Link>
                <Link to={"/client-service/"} onClick={() => navigate(`/client-service`)} className='selections_item' id='client_service_grid'>
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
                </Link>
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
                            <div className='account_data_info_email'>
                                <span>Email:&nbsp;</span>
                                <span>{email}</span>
                            </div>
                            <br/>
                            <span>Localización: {locationName}</span><br/>
                            <span>Cambiar localización:</span><br/>
                            <div className='change_location_account_container'>
                                <form onSubmit={updateLocation} className="change_location_account_form">
                                    <select onChange={(e) => setNewLocationId(e.target.value)} className="change_location_account_form_select">
                                        <option value={"0"}>Localización</option>
                                        <option value={"1"}>Monterrey</option>
                                        <option value={"2"}>Sabinas</option>
                                        <option value={"3"}>Nuevo Laredo</option>
                                    </select>
                                    <input
                                    type={'submit'}
                                    value={"Cambiar"}
                                    />
                                </form>
                            </div><br/>
                            <Link to={"/update-password/"} onClick={() => navigate(`/update-password`)} id='account_link'>Haz click aquí si deseas cambiar tu contraseña</Link>
                        </div>
                    </div>
                </a>
            </div>
            ) : <LoadingScreen/>}
        </div>
    )
}
