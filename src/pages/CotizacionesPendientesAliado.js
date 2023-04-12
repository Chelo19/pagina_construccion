import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/GenericAssets.css';
import { Link } from "react-router-dom";
import LoadingScreen2 from '../components/LoadingScreen2';
import GoBackButton from '../components/GenericAssets';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import { match } from 'react-router-dom';

import NavigateBeforeOutlinedIcon from '@mui/icons-material/NavigateBeforeOutlined';
import TurnLeftOutlinedIcon from '@mui/icons-material/TurnLeftOutlined';

export default function CotizacionesPendientesAliado(){
    // en esta pestana va un campo donde el aliado ve las cotizaciones que le llegaron que le mando el administrador para subir una archivo

    const navigate = useNavigate();
    const [cotizaciones, setCotizaciones] = useState(null);
    const [selectedCotizacion, setSelectedCotizacion] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [files, setFiles] = useState(null);
    const [noItems, setNoItems] = useState(false);

    const getCotizaciones = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        const { data, error } = await supabase
        .from('cotizaciones_allies')
        .select(`*, cotizacion_id(*, service_id(*, category_id(*))), ally_email(*)`)
        .eq('ally_email', user.email)
        .or("ally_response.is.null");
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

    useEffect(() => {
        getCotizaciones();
    }, []);

    const uploadBucket = async () => {
        console.log(selectedCotizacion);
        console.log(files);
        let haveError = false;
        let urlsArray = [];
        for(let i = 0 ; i < files.length ; i++){
            const { data, error } = await supabase
            .storage
            .from('ally-files')
            .upload('/' + `${selectedCotizacion.cotizacion_id.id}` + '/' + `${selectedCotizacion.ally_email.id}` + '/' + i, files[i]);
            urlsArray.push(`/${data.path}`);
            if(error){
                haveError = true;
                console.log(error);
            }
        }
        if(!haveError){
            updateDb(urlsArray)
        }
        else{
            console.log('Hay un error');
        }
    }

    const updateDb = async (urlsArray) => {
        const { error } = await supabase
        .from('cotizaciones_allies')
        .update({ ally_response: urlsArray })
        .eq('id', selectedCotizacion.id);
        if(!error){
            await timeout(2000);
            document.location.reload();
        }
    }

    function timeout(number) {
        return new Promise( res => setTimeout(res, number) );
    }

    return(
        <>
        {!isLoading ?
            <div className="generic_background">
                <div className="generic_container">
                    {!noItems ?
                        <>
                            <div className='generic_item_container'>
                                {!selectedCotizacion ? 
                                    <>
                                        <GoBackButton/>
                                        {cotizaciones.map((cotizacion) => {
                                            return(
                                                <div className='cotizaciones_pendientes_aliado_container' key={cotizacion.id}>
                                                    <span className='generic_title font30 posL'>Servicio: {cotizacion.cotizacion_id.service_id.name}</span>
                                                    <span className='generic_title font22 posL'>Categoria: {cotizacion.cotizacion_id.service_id.category_id.name}</span>
                                                    <Link className='generic_button' style={{backgroundColor: '#ff7f22'}} onClick={(e) => setSelectedCotizacion(cotizacion)}>Agregar archivo</Link>
                                                </div>
                                            )
                                        })}
                                    </>
                                    :
                                    <>
                                        <Link onClick={(e) => setSelectedCotizacion(null)} className="generic_back_button">
                                            <NavigateBeforeOutlinedIcon/> Regresar
                                        </Link>
                                        <div className='cotizaciones_pendientes_aliado_selected_container'>
                                            <span className='generic_title font30 posL'>Identificador: {selectedCotizacion.id}</span>
                                            <a className='generic_title font22 posL' href={`https://${selectedCotizacion.cotizacion_id.link_drive_sent_to_allies}`}>Link Drive</a>para ver los archivos
                                            <Button
                                                className="generic_button"
                                                id="add_service2_form_input"
                                                style={{letterSpacing: '1px'}}
                                                variant="contained"
                                                component="label"
                                                >
                                                Agregar &nbsp;<AttachFileOutlinedIcon/>
                                                <input
                                                    type="file"
                                                    multiple="multiple"
                                                    hidden
                                                    onChange={(e) => setFiles(e.target.files)}
                                                />
                                            </Button>
                                            <Link className='generic_button' style={{backgroundColor: '#ff7f22'}} onClick={uploadBucket}>Enviar</Link>
                                        </div>
                                    </>    
                                }
                            </div>
                        </>
                        :
                        <div className='no_items_background'>
                            <div className='no_items_container'>
                                <div className='no_items_img'>
                                    <img src={require('../img/financiamiento.png')}/>
                                </div>
                                <div className='no_items_spans'>
                                    <span className='no_items_span_title'>Aún no tienes cotizaciones pendientes</span>
                                </div>
                                <div className="no_items_buttons">
                                    <Link onClick={(e) => navigate(-1)} className="no_items_button" id="no_items_button_return">
                                        Regresar <TurnLeftOutlinedIcon/>
                                    </Link>
                                </div>
                            </div>
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