import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/AcceptedCotizaciones.css';
import { Link } from "react-router-dom";
import LoadingScreen2 from '../components/LoadingScreen2';

import TextField from '@mui/material/TextField';

export default function AcceptedCotizaciones(){
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [noItems, setNoItems] = useState(false);

    const [cotizaciones, setCotizaciones] = useState(null);
    const [selectedCotizacion, setSelectedCotizacion] = useState(null);

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
        .select(`*, service_id(*)`)
        .not('option_selected', 'is', null);
        if(data.length > 0){
            console.log(data);
            setCotizaciones(data);
            setIsLoading(false);
        }
        else{
            setNoItems(true);
            setIsLoading(false);
        }
    }

    console.log(selectedCotizacion);


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
                                    <div className='accepted_cotizaciones_item' key={cotizacion.id} onClick={(e) => setSelectedCotizacion(cotizacion)}>
                                        <span>id: {cotizacion.id}</span>
                                        <span>{cotizacion.account_email}</span>
                                    </div>);
                                })}
                            </>
                            :
                            <div className='sent_cotizaciones_cotizacion'>
                                <div className='sent_cotizaciones_cotizacion_content'>
                                    <span><span className='sent_cotizaciones_cotizacion_orange'>Servicio:</span> {selectedCotizacion.service_id.name}</span>
                                    <span><span className='sent_cotizaciones_cotizacion_orange'>Descripción del servicio:</span> {selectedCotizacion.service_id.description}</span>
                                </div>
                                <span className='sent_cotizaciones_cotizacion_instructions'>Se tienen las diferentes opciones de cotizaciones en el siguiente link:</span>
                                <a href={`${selectedCotizacion.link_drive}`} className='sent_cotizaciones_cotizacion_link'>Link Drive</a>
                                <span className='accepted_cotizaciones_result'>El usuario eligió la opción: <span className='sent_cotizaciones_cotizacion_orange'>{selectedCotizacion.option_selected}</span></span>
                                <TextField className='accepted_cotizaciones_input' label="Link Drive" variant="outlined"/>
                                <div className='accepted_cotizaciones_back_button' onClick={(e) => setSelectedCotizacion(null)}>
                                    Regresar
                                </div>
                            </div>
                            }
                        </>
                        : <div>No hay cotizaciones aceptadas</div>}

                    </div>
                </div>
            : <LoadingScreen2/>}
        </>
    );
}