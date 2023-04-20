import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate, useParams} from 'react-router-dom';
import '../styles/PendingCotizacionesMore.css';
import '../styles/GenericAssets.css';
import { Link } from "react-router-dom";
import LoadingScreen2 from '../components/LoadingScreen2';
import GoBackButton from '../components/GenericAssets';

import TextField from '@mui/material/TextField';
import NavigateBeforeOutlinedIcon from '@mui/icons-material/NavigateBeforeOutlined';
export default function SentCotizacionesUser(){
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [noItems, setNoItems] = useState(false);

    const [cotizaciones, setCotizaciones] = useState(null);
    const [selectedCotizacion, setSelectedCotizacion] = useState(null);

    const [newDriveToAllies, setNewDriveToAllies] = useState(null);
    const [newDrive, setNewDrive] = useState(null);

    useEffect(() => {
        getCotizaciones();
    }, []);

    const getCotizaciones = async () => {
        const { data, error } = await supabase
        .from('cotizaciones')
        .select('*, account_email(*), service_id(*, category_id(*))')
        .not('options_length', 'is', null)
        .eq('is_done', false)
        .order('id', { ascending: false });
        console.log(data);
        if(data.length > 0){
            setCotizaciones(data);
            setIsLoading(false);
        }
        else{
            setNoItems(true);
            setIsLoading(false);
        }
    }

    const sendData = async () => {
        if(newDriveToAllies && newDrive){
            const { error } = await supabase
            .from('cotizaciones')
            .update({ link_drive_sent_to_allies: newDriveToAllies, link_drive_ally: newDrive })
            .eq('id', selectedCotizacion.id);
            console.log(error);
        }
        else if(newDriveToAllies && !newDrive){
            const { error } = await supabase
            .from('cotizaciones')
            .update({ link_drive_sent_to_allies: newDriveToAllies})
            .eq('id', selectedCotizacion.id);
            console.log(error);
        }
        else if(!newDriveToAllies && newDrive){
            const { error } = await supabase
            .from('cotizaciones')
            .update({ link_drive_ally: newDrive })
            .eq('id', selectedCotizacion.id);
            console.log(error);
        }
        else{
            console.log("Faltan campos por llenar");
        }
    }
    
    return(
        <>
            {!isLoading ?
                <div className='generic_background'>
                    <div className='generic_container'>
                        {!noItems ?
                            <>
                                <div className='generic_item_container'>
                                    
                                    {!selectedCotizacion ?
                                        <>
                                            <GoBackButton/>
                                            {cotizaciones.map((cotizacion) => {
                                                return(
                                                    <div className='cotizaciones_pendientes_aliado_container' onClick={(e) => setSelectedCotizacion(cotizacion)}>
                                                        <span className='generic_title font30 posL'>Id de cotizacion: {cotizacion.id}</span>
                                                        <span className='generic_title font16 posL'>Cliente que la solicito: {cotizacion.account_email.email}</span>
                                                    </div>
                                                )
                                            })}
                                        </>
                                        :
                                        <>
                                            <Link onClick={(e) => setSelectedCotizacion(null)} className="generic_back_button">
                                                <NavigateBeforeOutlinedIcon/> Regresar
                                            </Link>
                                            <span className='generic_title font30 posL'>Id de cotizacion: {selectedCotizacion.id}</span>
                                            <Link to={`/profile/${selectedCotizacion.account_email.id}`} className='generic_title font16 posL noDecoration'>Cliente que la solicitó: {selectedCotizacion.account_email.email}</Link>
                                            <span className='generic_title font30 posL'>Servicio: {selectedCotizacion.service_id.name}</span>
                                            <span className='generic_title font30 posL'>Categoria: {selectedCotizacion.service_id.category_id.name}</span>
                                            <a href={`https://${selectedCotizacion.link_drive_sent_to_allies}`} className='generic_title font16 posL noDecoration'>Link que se mandó a aliados</a>
                                            <TextField className='generic_text_field' label="Nuevo Drive para aliados" variant="outlined" onChange={(e) => setNewDriveToAllies(e.target.value)}/>
                                            <a href={`https://${selectedCotizacion.link_drive_ally}`} className='generic_title font16 posL noDecoration'>Link que se mando al cliente</a>
                                            <TextField className='generic_text_field' label="Nuevo Drive para cliente" variant="outlined" onChange={(e) => setNewDrive(e.target.value)}/>
                                            <div className='generic_button font20' style={{backgroundColor: '#ff7f22'}} onClick={sendData}>
                                                Enviar
                                            </div>
                                        </>
                                    }
                                </div>
                            </>
                            :
                            <div>
                                No hay cotizaciones
                            </div>
                        }
                    </div>
                </div>
                :
                <LoadingScreen2/>
            }
        </>
    )
}