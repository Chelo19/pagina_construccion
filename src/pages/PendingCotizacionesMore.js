import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate, useParams} from 'react-router-dom';
import '../styles/PendingCotizacionesMore.css';
import '../styles/GenericAssets.css';
import { Link } from "react-router-dom";
import LoadingScreen2 from '../components/LoadingScreen2';

import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';

export default function PendingCotizacionesMore(){
    const navigate = useNavigate();
    const { cotid } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [noItems, setNoItems] = useState(false);

    const [cotizacion, setCotizacion] = useState(null);
    const [drive, setDrive] = useState(null);
    const [allyCount, setAllyCount] = useState(null);

    const [prompt, setPrompt] = useState(null);
    const [promptStyle, setPromptStyle] = useState(null);

    useEffect(() => {
        getCotizacion();
    }, []);

    const getCotizacion = async () => {
        const { data, error } = await supabase
        .from('cotizaciones')
        .select('*, service_id(*, category_id(*))')
        .eq('id', cotid);
        setCotizacion(data[0]);
        if(data.length > 0){
            console.log(data[0]);
            setIsLoading(false);
        }
        else{
            setNoItems(true);
            setIsLoading(false);
        }
    }

    console.log(drive);
    console.log(allyCount);

    return(
        <>
            {!isLoading ?
                <div className='generic_background'>
                    <div className='generic_container'>
                        <div className='pending_cotizaciones_more_display'>
                            {!noItems ?
                                <div className='generic_form gap20'>
                                    <span class='generic_title font30 posM'>Id de cotización: {cotid}</span>
                                    <div className='profile_content generic_description font20 posL gap20'>
                                        <span>Id de servicio: {cotizacion.service_id.id}</span>
                                        <span>Servicio: {cotizacion.service_id.name}</span>
                                        <span>Id de categoría: {cotizacion.service_id.category_id.id}</span>
                                        <span>Categoría: {cotizacion.service_id.category_id.name}</span>
                                    </div>
                                    <TextField className='generic_text_field' label="Link drive" variant="outlined" onChange={(e) => setDrive(e.target.value)}/>
                                    <TextField className='generic_text_field' label="Cantidad de aliados" variant="outlined" onChange={(e) => setAllyCount(e.target.value)}/>
                                </div>
                            : <div className='profile_no_items'>No se encontró cotizacion con Id: {cotid}</div>}
                        </div>
                    </div>
                </div>
            :
            <LoadingScreen2/>
            }
        </>
    )
}