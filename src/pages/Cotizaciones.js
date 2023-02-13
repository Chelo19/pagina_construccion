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

    const [noItems, setNoItems] = useState(false);

    useEffect(() => {
        getCotizaciones();
    }, []);

    const getCotizaciones = async () => {
        const { data, error } = await supabase
        .from('cotizaciones')
        .select(`
            id,
            service_id(*, category_id(*)), 
            account_email(*)
        `)
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
                                        <Button variant="contained" endIcon={<SendIcon />} onClick={(e) => link(cotizacion)}>
                                            Aliados
                                        </Button>
                                        <Button variant="contained" startIcon={<AddCircleOutlineIcon />}>
                                            Cotización
                                        </Button>
                                        </Stack>
                                    </div>
                                    {/* <div className='cotizaciones_item_buttons'>
                                        <Link to={`/select-allies/${cotizacion.id}`} className='cotizaciones_item_button'>
                                            Aliados
                                        </Link>
                                        <div className='cotizaciones_item_button'>
                                            Agregar<br/>Cotización
                                        </div>
                                    </div> */}
                                </div>
                            )
                        })}
                    </div>
                </div>
            :<LoadingScreen2></LoadingScreen2>}
        </>
    );
}