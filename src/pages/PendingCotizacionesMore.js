import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate, useParams} from 'react-router-dom';
import '../styles/PendingCotizacionesMore.css';
import '../styles/GenericAssets.css';
import { Link } from "react-router-dom";
import LoadingScreen2 from '../components/LoadingScreen2';
import GoBackButton from '../components/GenericAssets';

import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';


export default function PendingCotizacionesMore(){
    const navigate = useNavigate();
    const { cotid } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [noItems, setNoItems] = useState(false);

    const [cotizacion, setCotizacion] = useState(null);
    const [drive, setDrive] = useState(null);
    const [allyCount, setAllyCount] = useState(null);
    const [deadLine, setDeadLine] = useState(null);

    const [prompt, setPrompt] = useState(null);
    const [promptSeverity, setPromptSeverity] = useState('success');

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

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

    const sendData = async () => {
        if(drive && allyCount && deadLine){
            const { error } = await supabase
            .from('cotizaciones')
            .update({ link_drive_ally: drive, options_length: allyCount })
            .eq('id', cotid);
            if(!error){
                setPrompt('Datos enviados correctamente')
                setPromptSeverity('success');
                await timeout(2000);
                navigate(-1);
            }
            else{
                console.log(error);
                setPrompt(error.message);
                setPromptSeverity('error');
            }
        }
        else{
            setPrompt("Faltan campos por llenar");
            setPromptSeverity('error');
        }
    }

    const endCotizacion = async () => {
        // aqui tiene que eliminar la cotizacion
        const { error } = await supabase
        .from('cotizaciones')
        .update({ is_ended: true })
        .eq('id', cotid);
        if(!error){
            setPrompt('Cotización finalizada correctamente')
            setPromptSeverity('success');
            await timeout(2000);
            navigate(-1);
        }
        else{
            console.log(error);
            setPrompt(error.message);
            setPromptSeverity('error');
        }
    }

    function timeout(number) {
        return new Promise( res => setTimeout(res, number) );
    }

    return(
        <>
            {!isLoading ?
                <div className='generic_background'>
                    <div className='generic_container'>
                        <div className='pending_cotizaciones_more_display'>
                            {!noItems ?
                                <div className='generic_form gap20'>
                                    <GoBackButton/>
                                    <span class='generic_title font30 posL'>Id de cotización: {cotid}</span>
                                    <div className='profile_content generic_description font20 posL gap20'>
                                        <span>Id de servicio: {cotizacion.service_id.id}</span>
                                        <span>Servicio: {cotizacion.service_id.name}</span>
                                        <span>Id de categoría: {cotizacion.service_id.category_id.id}</span>
                                        <span>Categoría: {cotizacion.service_id.category_id.name}</span>
                                    </div>
                                    <TextField className='generic_text_field' label="Link drive" variant="outlined" onChange={(e) => setDrive(e.target.value)}/>
                                    <TextField className='generic_text_field' label="Cantidad de aliados" variant="outlined" onChange={(e) => setAllyCount(e.target.value)}/>
                                    <TextField className='generic_text_field' label="Fecha límite" variant="outlined" onChange={(e) => setDeadLine(e.target.value)}/>   {/* esto no funciona porque almacena una cadena en vez de un valor timestamp */}
                                    <div className='generic_button font20' style={{backgroundColor: '#ff7f22'}} onClick={sendData}>
                                        Enviar
                                    </div>
                                    <div className='generic_button font20' style={{backgroundColor: '#ff5252'}} onClick={handleClickOpen}>
                                        Finalizar cotización
                                    </div>
                                    <Dialog
                                        open={open}
                                        onClose={handleClose}
                                        aria-labelledby="alert-dialog-title"
                                        aria-describedby="alert-dialog-description"
                                    >
                                        <DialogTitle id="alert-dialog-title">
                                        {"¿Quieres finalizar la cotización?"}
                                        </DialogTitle>
                                        <DialogContent>
                                        <DialogContentText id="alert-dialog-description">
                                            ¿Estás seguro de que deseas finalizar la cotización?
                                        </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                        <Button onClick={handleClose}>Regresar</Button>
                                        <Button onClick={() => {endCotizacion(); handleClose()}} autoFocus>
                                            Finalizar
                                        </Button>
                                        </DialogActions>
                                    </Dialog>
                                </div>
                            : <div className='profile_no_items'>No se encontró cotizacion con Id: {cotid}</div>}
                        </div>
                    </div>
                    {prompt &&
                        <>
                            <Alert className='generic_alert' severity={`${promptSeverity}`} onClose={(e) => setPrompt(null)}>{prompt}</Alert>
                        </>}
                </div>
            :
            <LoadingScreen2/>
            }
        </>
    )
}