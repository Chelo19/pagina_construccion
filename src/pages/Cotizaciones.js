import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/Cotizaciones.css';
import { Link } from "react-router-dom";
import LoadingScreen2 from '../components/LoadingScreen2';

import * as React from 'react';
import Button from '@mui/material/Button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';


export default function Cotizaciones(){
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    const [cotizaciones, setCotizaciones] = useState(null);
    const [responses, setResponses] = useState(null);

    const [noItems, setNoItems] = useState(false);

    useEffect(() => {
        getCotizaciones();
        getResponses();
    }, []);

    const getCotizaciones = async () => {
        const { data, error } = await supabase
        .from('cotizaciones')
        .select(`
            *,
            service_id(*, category_id(*)), 
            account_email(*)
        `)
        .order('id', { ascending: false });
        setCotizaciones(data);
        if(data.length > 0){
            setIsLoading(false);
        }
        else{
            setNoItems(true);
            window.alert("No hay datos");
        }
    }

    const link = async (e) => {
        console.log(e);
        navigate(`/select-allies/${e.id}`)
    }

    const link2 = async (e) => {
        console.log(e);
        navigate(`/cotizaciones-pendientes-mas/${e.id}`)
    }

    const getResponses = async () => {
        const { data, error } = await supabase
        .from('cotizaciones_allies')
        .select(`*`);
        setResponses(data);
    }

    const checkResponses = (cotid) => {
        let hasSomething = [];
        hasSomething.push(responses.filter(response => {
            return response.ally_response != null && response.cotizacion_id == cotid;
        }));
        if(hasSomething[0].length > 0){
            return;
        }
        else if(hasSomething[0].length == 0){
            return {display: 'none'};
        }
    }

    return(
        <>
            {!isLoading ?
                <div className='cotizaciones_background'>
                    <div className='cotizaciones_container'>
                        {cotizaciones.map((cotizacion) => {
                            return(
                                <div className='cotizaciones_item' key={cotizacion.id}>
                                    <div className='cotizaciones_item_container'>
                                        <span id='cotizaciones_item_user'>
                                            <Link to={`/profile/${cotizacion.account_email.id}`}>
                                                {cotizacion.account_email.name}
                                            </Link>
                                        </span>
                                        <span id='cotizaciones_item_user'>
                                            <Link to={`/profile/${cotizacion.account_email.id}`}>
                                                id: {cotizacion.account_email.id}
                                            </Link>
                                        </span>
                                        <span id='cotizaciones_item_action'>
                                            Quiere cotizar
                                        </span>
                                        <span id='cotizaciones_item_service'>
                                            Servicio: {cotizacion.service_id.name}
                                        </span>
                                        <span id='cotizaciones_item_category'>
                                            Categoría: {cotizacion.service_id.category_id.name}
                                        </span>
                                        <Stack className='cotizaciones_item_buttons' direction="row" spacing={1}>
                                            {!cotizacion.is_sent_to_allies &&
                                                <Button variant="contained" endIcon={<SendIcon />} onClick={(e) => link(cotizacion)}>
                                                    Aliados
                                                </Button>
                                            }
                                            <Button variant="contained" style={checkResponses(cotizacion.id)} startIcon={<AddCircleOutlineIcon />} onClick={(e) => link2(cotizacion)}>
                                                Cotización
                                            </Button>
                                        </Stack>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            :<LoadingScreen2></LoadingScreen2>}
        </>
    );
}