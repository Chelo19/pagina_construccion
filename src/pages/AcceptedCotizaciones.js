import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/AcceptedCotizaciones.css';
import { Link } from "react-router-dom";
import LoadingScreen2 from '../components/LoadingScreen2';

import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import NavigateBeforeOutlinedIcon from '@mui/icons-material/NavigateBeforeOutlined';
import TurnLeftOutlinedIcon from '@mui/icons-material/TurnLeftOutlined';

export default function AcceptedCotizaciones(){
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [noItems, setNoItems] = useState(false);

    const [searchInput, setSearchInput] = useState('');
    const [allItems, setAllItems] = useState(false);

    const [prompt, setPrompt] = useState(null);
    const [promptStyle, setPromptStyle] = useState(null);

    const [cotizaciones, setCotizaciones] = useState(null);
    const [allies, setAllies] = useState([]);
    const [selectedCotizacion, setSelectedCotizacion] = useState(null);
    const [selectedAlly, setSelectedAlly] = useState(null);

    useEffect(() => {
        getUser();
    }, []);

    const getUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        const { data, error } = await supabase
        .from('account')
        .select()
        .eq('uuid', user.id);
        if(data[0].role == 'administrador' || data[0].role == 'gerente'){
            getCotizaciones();
            return;
        }
        else{
            window.alert('No tienes los permisos');
            navigate('/');
        }
    }

    const getCotizaciones = async () => {
        const { data, error } = await supabase
        .from('cotizaciones')
        .select(`*, service_id(*), account_email(*)`)
        .is('selected_ally_email', null)
        .not('option_selected', 'is', null);
        if(data.length > 0){
            console.log(data);
            setCotizaciones(data);
            getAllyProfiles();
        }
        else{
            setNoItems(true);
            setIsLoading(false);
        }
    }

    const getAllyProfiles = async () => {
        const { data, error } = await supabase
        .from('account')
        .select()
        .order('id', { ascending: true })
        .match({ role: 'aliado' });
        console.log(data);
        if(data){
            setAllies(data);
            setIsLoading(false);
        }
        if(data.length == 0){
            setNoItems(true);
        }
    }

    const allyFiltered = allies.filter((ally) => {
        return ally.name.toLowerCase().match(searchInput) || ally.id == parseInt(searchInput) || ally.email.match(searchInput)
    });

    const randomColor = () => {
        const rand1 = 0 + Math.random() * (255 - 0);
        const rand2 = 0 + Math.random() * (255 - 0);
        const rand3 = 0 + Math.random() * (255 - 0);
        return {backgroundColor: `rgba(${Math.trunc(rand1)}, ${Math.trunc(rand2)}, ${Math.trunc(rand3)}, 1)`};
    }

    const getInitials = (cotizacion) => {
        let arr = cotizacion.account_email.name.split(" ");
        if(arr.length > 1){
            return arr[0][0]+arr[1][0];
        }
        else{
            return arr[0][0];
        }
    }

    const acceptAlly = async () => {
        const { error } = await supabase
        .from('cotizaciones')
        .update({ selected_ally_email: selectedAlly.email, is_project: true })
        .eq('id', selectedCotizacion.id);
        setPromptStyle({backgroundColor: '#ff7f22'});
        setPrompt('Aceptando aliado...');
        if(!error){
            setPromptStyle({backgroundColor: '#77DD77'});
            setPrompt('Aliado seleccionado correctamente');
            await timeout(2000);
            setPrompt(null);
            navigate('/admin')
        }
        else{
            setPromptStyle({backgroundColor: '#161825'});
            setPrompt('Intenta de nuevo');
            await timeout(2000);
            setPrompt(null);
        }
        
    }

    function timeout(number) {
        return new Promise( res => setTimeout(res, number) );
    }

    return(
        <>
            {!isLoading ?
                <div className='accepted_cotizaciones_background'>
                    <div className='accepted_cotizaciones_container'>
                        {!noItems ? 
                        <>
                            {!selectedCotizacion ?
                            <>
                                <span className='accepted_cotizaciones_title'>Cotizaciones</span>
                                {cotizaciones.map((cotizacion) => {
                                    return(
                                    // <div className='accepted_cotizaciones_item' key={cotizacion.id} onClick={(e) => setSelectedCotizacion(cotizacion)}>
                                    //     <span>id: {cotizacion.id}</span>
                                    //     <span>{cotizacion.account_email}</span>
                                    // </div>
                                    <div className='requests_item' key={cotizacion.id} onClick={(e) => setSelectedCotizacion(cotizacion)}>
                                        <div className='requests_icon'>
                                            <div style={randomColor()} className='icon_name'>
                                                {getInitials(cotizacion)}
                                            </div>
                                        </div>
                                        <div className='requests_item_content'>
                                            <span>id de cotización: {cotizacion.id}</span>
                                            <span>{cotizacion.account_email.name}</span>
                                            <span>{cotizacion.account_email.email}</span>
                                            <span>id de cuenta: {cotizacion.account_email.id}</span>
                                    </div>
                                </div>);
                                })}
                            </>
                            :
                            <div className='sent_cotizaciones_cotizacion'>
                                <div className="services_hotbar">
                                    <Link onClick={(e) => {setSelectedCotizacion(null); setSelectedAlly(null); setAllItems(false)}} className="services_hotbar_item" id="services_hotbar_return_button">
                                        <NavigateBeforeOutlinedIcon/> Regresar
                                    </Link>
                                </div>
                                <div className='sent_cotizaciones_cotizacion_content'>
                                    <span><span className='sent_cotizaciones_cotizacion_orange'>Servicio:</span> {selectedCotizacion.service_id.name}</span>
                                    <span><span className='sent_cotizaciones_cotizacion_orange'>Descripción del servicio:</span> {selectedCotizacion.service_id.description}</span>
                                </div>
                                <span className='sent_cotizaciones_cotizacion_instructions'>Se tienen las diferentes opciones de cotizaciones en el siguiente link:</span>
                                <a href={`https://${selectedCotizacion.link_drive_ally}`} className='sent_cotizaciones_cotizacion_link'>Link Drive</a>
                                <span className='accepted_cotizaciones_result'>El usuario eligió la opción: <span className='sent_cotizaciones_cotizacion_orange'>{selectedCotizacion.option_selected}</span></span>
                                {!selectedAlly ?
                                    <>
                                        <span className='accepted_cotizaciones_result'>Selecciona el aliado aceptado para este servicio</span>
                                        <div className='accepted_cotizaciones_search_engine'>
                                            <div className='edit_services_search_box'>
                                                <TextField 
                                                className='edit_services_search_input'
                                                label="Buscar" 
                                                variant="outlined"
                                                onChange={(e) => setSearchInput(e.target.value.toLowerCase().replace(/([.*+?^=!:$(){}|[\]\/\\])/g, ''))}
                                                value={searchInput}/>
                                                    {!allItems ? 
                                                        <div className='edit_services_all_items' onClick={(e) => {setAllItems(true); setSearchInput('')}}>
                                                            <VisibilityOutlinedIcon color='primary' fontSize='large'/>
                                                        </div>
                                                        : 
                                                        <div className='edit_services_all_items' onClick={(e) => setAllItems(false)}>
                                                            <VisibilityOffOutlinedIcon color='primary' fontSize='large'/>
                                                        </div>
                                                    }
                                            </div>
                                            {(searchInput.length > 0 || allItems) &&
                                                <>
                                                    {(!allItems || searchInput.length > 0) &&
                                                    <div className='edit_services_results'>
                                                    {allyFiltered.map((ally) => {
                                                        return(
                                                        <Link onClick={(e) => setSelectedAlly(ally)} className='edit_services_item' key={ally.id}>
                                                            <span>{ally.id}</span>
                                                            <span>{ally.name}</span>
                                                        </Link>
                                                        )
                                                    })}
                                                    </div>
                                                    }
                                                    {(allItems && searchInput.length == 0) &&
                                                    <div className='edit_services_results'>
                                                        {allies.map((ally) => {
                                                        return(
                                                            <Link onClick={(e) => setSelectedAlly(ally)} className='edit_services_item' key={ally.id}>
                                                                <span>{ally.id}</span>
                                                                <span>{ally.name}</span>
                                                            </Link>
                                                        )
                                                        })}
                                                    </div>
                                                }   
                                                </>
                                            }
                                        </div>
                                    </>
                                    :
                                    <>
                                        <span className='accepted_cotizaciones_result'>Aliado seleccionado:</span>
                                        <div className='accepted_cotizaciones_selected_ally'>
                                            <CloseOutlinedIcon onClick={(e) => setSelectedAlly(null)}/>
                                            <Link className='accepted_cotizaciones_item'>
                                                <span>{selectedAlly.id}</span>
                                                <span>{selectedAlly.name}</span>
                                            </Link>
                                        </div>
                                        <div className='accepted_cotizaciones_back_button' id='accepted_cotizaciones_send_button' onClick={acceptAlly}>
                                            Aceptar
                                        </div>
                                    </>
                                }
                                
                            </div>
                            }
                        </>
                        : 
                        <div className='no_items_background'>
                            <div className='no_items_container'>
                                <div className='no_items_img'>
                                    <img src={require('../img/financiamiento.png')}/>
                                </div>
                                <div className='no_items_spans'>
                                    <span className='no_items_span_title'>Aún no existen cotizaciones aceptadas</span>
                                </div>
                                <div className="no_items_buttons">
                                    <Link to={'/admin'} className="no_items_button" id="no_items_button_return">
                                        Regresar <TurnLeftOutlinedIcon/>
                                    </Link>
                                </div>
                            </div>
                        </div>}

                    </div>
                    {prompt &&
                    <div className="reg_log_prompt" style={promptStyle}>
                        {prompt}
                    </div>
                }
                </div>
            : <LoadingScreen2/>}
        </>
    );
}