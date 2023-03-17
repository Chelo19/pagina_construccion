import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/GenericAssets.css';
import { Link } from "react-router-dom";
import LoadingScreen2 from '../components/LoadingScreen2';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import { match } from 'react-router-dom';

export default function CotizacionesPendientesAliado(){
    // en esta pestana va un campo donde el aliado ve las cotizaciones que le llegaron que le mando el administrador para subir una archivo

    const [cotizaciones, setCotizaciones] = useState(null);
    const [selectedCotizacion, setSelectedCotizacion] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [files, setFiles] = useState(null);
    const [noItems, setNoItems] = useState(false);

    const getCotizaciones = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        const { data, error } = await supabase
        .from('cotizaciones_allies')
        .select(`*, cotizacion_id(*), ally_email(*)`)
        .eq('ally_email', user.email)
        .or("ally_response.is.null");
        console.log(error);
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
            urlsArray.push(`https://xadwiefldpzbsdciapia.supabase.co/storage/v1/object/public/ally-files/${data.path}`);
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
                            {!selectedCotizacion ? 
                                <div>
                                    {cotizaciones.map((cotizacion) => {
                                        return(
                                            <div key={cotizacion.id}>
                                                <span>{cotizacion.id}</span>
                                                <span>{cotizacion.ally_email.email}</span>
                                                <Link onClick={(e) => setSelectedCotizacion(cotizacion)}>Agregar archivo</Link>
                                            </div>
                                        )
                                    })}
                                </div>
                                :
                                <>
                                    {selectedCotizacion.id}
                                    <a href={`${selectedCotizacion.link_drive}`}>Link Drive</a>para ver los archivos
                                    <Button
                                        className="add_service2_form_item"
                                        id="add_service2_form_input"
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
                                    <Link onClick={uploadBucket}>Enviar</Link>
                                </>    
                            }
                        </>
                        :
                        <>
                            No tienes cotizaciones
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