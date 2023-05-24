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


export default function CotizacionesContestadasPorAliados(){

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [noItems, setNoItems] = useState(false);

    const [cotizaciones, setCotizaciones] = useState(null);
    const [cotizacionesAllies, setCotizacionesAllies] = useState(null);

    const [selectedCotizacionResponses, setSelectedCotizacionResponses] = useState(null);
    const [selectedCotizacion, setSelectedCotizacion] = useState(null);

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

    const getCotizacionesAllies = async () => {
        const { data, error } = await supabase
        .from('cotizaciones_allies')
        .select('*, ally_email(*), cotizacion_id(*, service_id(*, category_id(*)))')
        .not('ally_response', 'is', null);
        if(data.length > 0){
            setCotizacionesAllies(data);
            console.log(data);
            getCotizaciones();
        }
    }

    useEffect(() => {
        getCotizacionesAllies();
    }, []);

    const getCotizacionResponses = (selectedCotizacion) => {
        setSelectedCotizacionResponses(cotizacionesAllies.filter(cotizacion => {
            return cotizacion.cotizacion_id.id == selectedCotizacion.id;
        }));
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
                                {!selectedCotizacion ?
                                <>
                                    <GoBackButton/>
                                    <div className='generic_form gap20'>
                                        <span className='generic_title font30 posL' style={{margin: "10px 0px"}}>Cotizaciones</span>
                                        {cotizaciones.map((cotizacion) => {
                                            return(
                                                <div className='project_item project_item_done' onClick={(e) => {getCotizacionResponses(cotizacion); setSelectedCotizacion(cotizacion)}} key={cotizacion.id}>
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
                                    <Link onClick={(e) => {setSelectedCotizacionResponses(null); setSelectedCotizacion(null)}} className="generic_back_button">
                                        <NavigateBeforeOutlinedIcon/> Regresar
                                    </Link>
                                    {selectedCotizacionResponses.length > 0 ?
                                        <>
                                            {selectedCotizacionResponses.map((response) => {
                                                return(
                                                    <div className='project_responses_container' key={response.id}>
                                                        <span className='generic_title font30 posL' style={{margin: "10px 0px"}}>Respuesta por: <Link to={`/profile/${response.ally_email.id}`} style={{textDecoration:'none', color:'rgba(255, 127, 34, 0.8)'}}>{response.ally_email.email}</Link></span>
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
                                        :
                                        <>
                                            <div className='no_items_background'>
                                                <div className='no_items_container'>
                                                    <div className='no_items_img'>
                                                        <img src={require('../img/financiamiento.png')}/>
                                                    </div>
                                                    <div className='no_items_spans'>
                                                        <span className='no_items_span_title'>Aún no tiene respuestas esta cotización</span>
                                                    </div>
                                                    <div className="no_items_buttons">
                                                        <Link onClick={(e) => setSelectedCotizacion(null)} className="no_items_button" id="no_items_button_return">
                                                            Regresar <TurnLeftOutlinedIcon/>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    } 
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
                                    <span className='no_items_span_title'>Aún no existen cotizaciones</span>
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