import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/GenericAssets.css';
import '../styles/Projects.css';
import { Link } from "react-router-dom";
import LoadingScreen2 from '../components/LoadingScreen2';
import GoBackButton from '../components/GenericAssets';

import TurnLeftOutlinedIcon from '@mui/icons-material/TurnLeftOutlined';
import NavigateBeforeOutlinedIcon from '@mui/icons-material/NavigateBeforeOutlined';

import * as React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';

export default function CotizacionesContestadasPorAliados(){

    const [isLoading, setIsLoading] = useState(true);
    const [noItems, setNoItems] = useState(false);

    const [cotizaciones, setCotizaciones] = useState(null);
    const [selectedCotizacionResponses, setSelectedCotizacionResponses] = useState(null);

    const getCotizaciones = async () => {
        const { data, error } = await supabase
        .from('cotizaciones')
        .select('*, account_email(*), service_id(*, category_id(*)), selected_ally_email(*)')
        .order('id', { ascending: false });
        if(data.length > 0){
            setCotizaciones(data);
            setIsLoading(false);
        }
        else{
            setNoItems(true);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getCotizaciones();
    }, []);

    const getCotizacionData = async (cotid) => {
        const { data, error } = await supabase
        .from('cotizaciones_allies')
        .select('*, ally_email(*), cotizacion_id(*, service_id(*, category_id(*)))')
        .eq("cotizacion_id", cotid)
        .not('ally_response', 'is', null);
        if(data.length > 0){
            console.log(data);
            setSelectedCotizacionResponses(data);
        }
        else{
        }
    }

    const downloadFile = async (path) => {
        const { data, error } = await supabase
        .storage
        .from('ally-files')
        .download(`${path}`);
        
        const blob = new Blob([data]);

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', path);
        document.body.appendChild(link);

        link.click();
    }

    return(
        <>
        {!isLoading ?
            <div className="generic_background">
                <div className="generic_container">
                    {!noItems ?
                        <>
                            <div className='generic_item_container'>
                                {!selectedCotizacionResponses ?
                                <>
                                    <GoBackButton/>
                                    <div className='generic_form gap20'>
                                        <span className='generic_title font30 posL' style={{margin: "10px 0px"}}>Cotizaciones</span>
                                        {cotizaciones.map((cotizacion) => {
                                            return(
                                                <div className='project_item project_item_done' onClick={(e) => getCotizacionData(cotizacion.id)} key={cotizacion.id}>
                                                    <div className='project_item_content'>
                                                        <span>Identificador del proyecto: {cotizacion.id}</span>
                                                        <span>Servicio: {cotizacion.service_id.name}</span>
                                                        <span>Categoría: {cotizacion.service_id.category_id.name}</span>
                                                    </div>
                                                    <div className='project_item_img'>
                                                        <img src={`${cotizacion.service_id.img_url[0]}`}/>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </>
                                :
                                <>
                                    <Link onClick={(e) => setSelectedCotizacionResponses(null)} className="generic_back_button">
                                            <NavigateBeforeOutlinedIcon/> Regresar
                                        </Link>
                                    {selectedCotizacionResponses.map((response) => {
                                        return(
                                            <div className='project_responses_container' key={response.id}>
                                                <span className='generic_title font30 posL' style={{margin: "10px 0px"}}>Respuesta por: {response.ally_email.email}</span>
                                                <span className='generic_description font18 posL'>Servicio: {response.cotizacion_id.service_id.name}</span>
                                                <span className='generic_description font18 posL'>Categoría: {response.cotizacion_id.service_id.category_id.name}</span>
                                                <div className='project_responses_item_container'>
                                                    {response.ally_response.map((file) => {
                                                        return(
                                                            <Link className='project_response posL' onClick={(e) => downloadFile(file)} key={file}>
                                                                Respuesta: {file}
                                                            </Link>
                                                        )
                                                    })}

                                                </div>
                                            </div>
                                        )
                                    })}
                                </>
                                }
                            </div>
                        </>
                        :
                        <>
                            No hay datos
                        </>
                    }
                </div>
            </div>
        :
        <LoadingScreen2/>
        }
        </>
    )
}