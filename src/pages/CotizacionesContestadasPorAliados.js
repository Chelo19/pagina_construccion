import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/GenericAssets.css';
import { Link } from "react-router-dom";
import LoadingScreen2 from '../components/LoadingScreen2';

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
    const [uniqueIds, setUniqueIds] = useState(null);

    const getCotizaciones = async () => {
        const { data, error } = await supabase
        .from('cotizaciones_allies')
        .select('*')
        .not('ally_response', 'is', null)
        if(data.length > 0){
            console.log(data);
            setCotizaciones(data);
            checkUniqueIds(data);
            setIsLoading(false);
        }
        else{
            setNoItems(true);
            setIsLoading(false);
        }
    }

    const checkUniqueIds = async (data) => {
        setUniqueIds([...new Set(data.map(cotizacion => cotizacion.cotizacion_id))]);
    }

    useEffect(() => {
        getCotizaciones();
    }, []);

    const getCotizacionData = async (cotid) => {
        const { data, error } = await supabase
        .from('cotizaciones_allies')
        .select('*, ally_email(*), cotizacion_id(*)')
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
                            {!selectedCotizacionResponses ?
                            <>
                                {uniqueIds.map((cotizacionesId) => {
                                    return(
                                        <Link onClick={(e) => getCotizacionData(cotizacionesId)} key={cotizacionesId.id}>
                                            Cotizacion: {cotizacionesId}
                                        </Link>
                                    )
                                })}
                            </>
                            :
                            <>
                                <span onClick={(e) => setSelectedCotizacionResponses(null)}>Regresar</span>
                                {selectedCotizacionResponses.map((response) => {
                                    return(
                                        <div key={response.id}>
                                            {response.ally_email.id}
                                            {response.ally_email.email}
                                            {response.ally_email.name}
                                            {response.ally_response.map((file) => {
                                                return(
                                                    <Link onClick={(e) => downloadFile(file)} key={file}>
                                                        {file}
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                    )
                                })}
                            </>
                            }
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