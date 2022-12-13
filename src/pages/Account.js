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
    const [isChangingLocation, setIsChangingLocation] = useState(false);
    const [countries, setCountries] = useState(null);
    const [newCountry, setNewCountry] = useState(null);
    const [states, setStates] = useState(null);
    const [newState, setNewState] = useState(null);
    const [newLocation, setNewLocation] = useState(null);
    const [renderStates, setRenderStates] = useState(false);
    const [renderInput, setRenderInput] = useState(false);
    const [renderSubmit, setRenderSubmit] = useState(false);
    var locationId = null;
    
    const [loadingScreen, setLoadingScreen] = useState(true);

    const navigate = useNavigate(); 

    useEffect(() => {
        getUserData();
        getCountryData();
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

    const getCountryData = async () => {
        let data = require('../assets/country-states-data.json');
        setCountries(data);
    }

    const getStatesData = async () => {
        console.log(newCountry);
        console.log("Entra getStatesData");
        let data = require('../assets/country-states-data.json');
        setStates(data[newCountry].states);
    }

    const changeLocation = async () => {
        window.alert('Cambio de localización');
    }
    
    useEffect(() => {
        if(newCountry){
            getStatesData();
            setRenderStates(true);
        }
        else{
            setRenderStates(false);
        }
        if(newState){
            setRenderInput(true);
        }
        else{
            setRenderInput(false);
        }
        if(newLocation){
            setRenderSubmit(true);
        }
        else{
            setRenderSubmit(false);
        }
    })

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
                    {isChangingLocation ?
                        <div className='account_is_changing_location'>
                            <Link id='account_is_changing_location_close_tab' onClick={(e) => {setIsChangingLocation(false); 
                                setStates([]); setNewCountry(null); setNewState(null); setNewLocation(null)}}>
                                <img src={require('../img/closetab.png')}/>
                            </Link>
                            <div className='account_is_changing_location_item'>
                                <span>País</span>
                                <select onChange={(e) => {setNewCountry(e.target.value); setStates([])}} className="account_is_changing_location_select">
                                {countries.map((country) => {
                                    return(
                                        <option key={country.country_id} value={country.country_id}>{country.country_name}</option>
                                    )
                                })}
                                </select>
                            </div>
                            {renderStates &&
                                <div className='account_is_changing_location_item'>
                                    <span>Estado</span>
                                    <select onChange={(e) => {setNewState(e.target.value); setNewLocation(null)}} className="account_is_changing_location_select">
                                    {states.map((state) => {
                                        return(
                                            <option value={state.state_id}>{state.state_name}</option>
                                        )
                                    })}
                                    </select>
                                </div>
                            }
                            {renderInput &&
                                <div className='account_is_changing_location_item'>
                                    <span>Localidad</span>
                                    <input id="account_is_changing_location_text_input"
                                    type={'text'}
                                    placeholder={"Localización"}
                                    onChange={(e) => setNewLocation(e.target.value)}
                                    />
                                </div>
                            }
                            {renderSubmit &&
                                <input id="account_is_changing_location_text_submit"
                                type={'submit'}
                                value={'Cambiar Localización'}
                                onClick={changeLocation}
                                />
                            }
                        </div>
                    : 
                        <div className='account_data'>
                            <a className='selection_logo'>
                                <img src={require('../img/cuenta.png')} id='package'/>
                            </a>
                            <div className='account_data_title'>
                                <span>¡Hola {name}!</span>
                            </div>
                            <div className='account_data_info'>
                                <span>Nombre: {name}</span>
                                <div className='account_data_info_email'>
                                    <span>Email:&nbsp;</span>
                                    <span>{email}</span>
                                </div>
                                <span>Localización: {locationName}</span>
                                <input 
                                    className='change_location_account_form_input'
                                    type={'submit'}
                                    value={"Cambiar Localización"}
                                    onClick={(e) => setIsChangingLocation(true)}
                                />
                                <input
                                    onClick={(e) => navigate("/update-password/")}
                                    className='change_location_account_form_input'
                                    type={'submit'}
                                    value={"Cambiar Contraseña"}
                                />
                            </div>
                        </div>
                    }
                </a>
            </div>
            ) : <LoadingScreen/>}
        </div>
    )
}
