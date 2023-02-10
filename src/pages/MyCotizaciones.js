import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/SentCotizaciones.css';
import '../styles/NoItems.css';
import LoadingScreen2 from '../components/LoadingScreen2';
import { Link } from "react-router-dom";
import { async } from 'q';

export default function MyCotizaciones(){
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isRejecting, setIsRejecting] = useState(false);

    const [noItems, setNoItems] = useState(false);
    const [prompt, setPrompt] = useState(null);
    const [promptStyle, setPromptStyle] = useState(null);

    const [sentCotizaciones, setSentCotizaciones] = useState(null);
    const [acceptedCotizaciones, setAcceptedCotizaciones] = useState(null);
    const [pendingCotizaciones, setPendingCotizaciones] = useState(null);
    const [endedCotizaciones, setEndedCotizaciones] = useState(null);
    const [selectedCotizacion, setSelectedCotizacion] = useState(null);
    
    let count = 0;

    useEffect(() => {
        getUser();
    }, []);

    const getUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        getCotizaciones(user);
    }

    const getCotizaciones = async (user) => {
        const { data, error } = await supabase
        .from('cotizaciones')
        .select(`*, service_id(*)`)
        .match({ account_email: user.email })
        .order('id', { ascending: true });
        if(data.length > 0) setIsLoading(false);
        else{
            setNoItems(true);
            setIsLoading(false);
        }
        setAcceptedCotizaciones(data.filter(cotizacion => {
            return cotizacion.is_ended === false && cotizacion.option_selected != null;
        }))
        setSentCotizaciones(data.filter(cotizacion => {
            return cotizacion.is_sent === false && cotizacion.is_ended === false && cotizacion.option_selected === null;
        }))
        setPendingCotizaciones(data.filter(cotizacion => {
            return cotizacion.is_sent === true && cotizacion.is_ended === false && cotizacion.option_selected === null;
        }))
        setEndedCotizaciones(data.filter(cotizacion => {
            return cotizacion.is_ended === true;
        }))
    }

    const endCotizacion = async () => {
        if(isRejecting){
            const { error } = await supabase
            .from('cotizaciones')
            .update({ is_ended: true })
            .eq('id', selectedCotizacion.id);
            if(!error){
                setPromptStyle({backgroundColor: '#161825'});
                setPrompt('Cotización finalizada');
                await timeout(2000);
                setPrompt(null);
                document.location.reload();
                return;
            }
            else{
                console.log(error);
                setPromptStyle({backgroundColor: '#161825'});
                setPrompt('Intenta de nuevo');
                await timeout(2000);
                setPrompt(null);
                return;
            }
        }
    }

    function timeout(number) {
        return new Promise( res => setTimeout(res, number) );
    }

    console.log(sentCotizaciones);

    return(
        <>
            {!isLoading ?
                <div className='sent_cotizaciones_background'>
                    <div className='sent_cotizaciones_container'>
                        {!noItems ?
                        <>
                            {!selectedCotizacion ?
                            <>
                                {pendingCotizaciones.length > 0 &&
                                <>
                                    <Link to={'/cotizaciones-pendientes'} className='user_sent_cotizaciones_title'>Cotizaciones Pendientes</Link>
                                    {pendingCotizaciones.map((cotizacion) => {
                                        return(
                                            <Link to={'/cotizaciones-pendientes'} className='sent_cotizaiones_item' key={cotizacion.id}>
                                                <span>{cotizacion.service_id.name}</span>
                                                <span>Fecha: {cotizacion.created_at.split('T')[0]}</span>
                                            </Link>
                                        );
                                    })}
                                </>}
                                {acceptedCotizaciones.length > 0 &&
                                <>
                                    <span className='user_sent_cotizaciones_title'>Cotizaciones Aceptadas</span>
                                    {acceptedCotizaciones.map((cotizacion) => {
                                        return(
                                            <Link className='sent_cotizaiones_item' key={cotizacion.id} onClick={(e) => setSelectedCotizacion(cotizacion)}>
                                                <span>{cotizacion.service_id.name}</span>
                                                <span>Fecha: {cotizacion.created_at.split('T')[0]}</span>
                                            </Link>
                                        );
                                    })}
                                </>}
                                {sentCotizaciones.length > 0 &&
                                <>
                                    <span className='user_sent_cotizaciones_title'>Cotizaciones Solicitadas</span>
                                    {sentCotizaciones.map((cotizacion) => {
                                        return(
                                            <Link className='sent_cotizaiones_item' key={cotizacion.id} onClick={(e) => setSelectedCotizacion(cotizacion)}>
                                                <span>{cotizacion.service_id.name}</span>
                                                <span>Fecha: {cotizacion.created_at.split('T')[0]}</span>
                                            </Link>
                                        );
                                    })}
                                </>}
                                {endedCotizaciones.length > 0 &&
                                <>
                                    <span className='user_sent_cotizaciones_title'>Cotizaciones Terminadas</span>
                                    {endedCotizaciones.map((cotizacion) => {
                                        return(
                                            <Link className='sent_cotizaiones_item' key={cotizacion.id} onClick={(e) => setSelectedCotizacion(cotizacion)}>
                                                <span>{cotizacion.service_id.name}</span>
                                                <span>Fecha: {cotizacion.created_at.split('T')[0]}</span>
                                            </Link>
                                        );
                                    })}
                                </>}
                            </>
                            :
                            <>
                                <div className='sent_cotizaciones_cotizacion'>
                                    <div className='sent_cotizaciones_cotizacion_content'>
                                        <span><span className='sent_cotizaciones_cotizacion_orange'>Servicio:</span> {selectedCotizacion.service_id.name}</span>
                                        <span><span className='sent_cotizaciones_cotizacion_orange'>Descripción del servicio:</span> {selectedCotizacion.service_id.description}</span>
                                        <span><span className='sent_cotizaciones_cotizacion_orange'>Esta cotización fue creada el:</span> {selectedCotizacion.created_at.split('T')[0]}</span>
                                        {!selectedCotizacion.is_ended ?
                                        <>
                                            {!isRejecting ?
                                            <>
                                                <div className='sent_cotizaciones_cotizacion_buttons'>
                                                    <Link className='sent_cotizaciones_cotizacion_button' id='sent_cotizaciones_cotizacion_reject' onClick={(e) => setIsRejecting(true)}>
                                                        Finalizar Cotización
                                                    </Link>
                                                    <Link className='sent_cotizaciones_cotizacion_button' id='sent_cotizaciones_cotizacion_return' onClick={(e) => setSelectedCotizacion(null)}>
                                                        Regresar
                                                    </Link>
                                                </div>
                                            </>
                                            :
                                            <>
                                                <span>¿Estás seguro de que deseas finalizar la cotización?</span>
                                                <div className='sent_cotizaciones_cotizacion_buttons'>
                                                    <Link className='sent_cotizaciones_cotizacion_button' id='sent_cotizaciones_cotizacion_reject' onClick={endCotizacion}>
                                                        Finalizar
                                                    </Link>
                                                    <Link className='sent_cotizaciones_cotizacion_button' id='sent_cotizaciones_cotizacion_return' onClick={(e) => setIsRejecting(false)}>
                                                        Regresar
                                                    </Link>
                                                </div>
                                            </>}
                                        </>
                                        :
                                        <>
                                            <Link className='sent_cotizaciones_cotizacion_button' id='sent_cotizaciones_cotizacion_return' onClick={(e) => setSelectedCotizacion(null)}>
                                                Regresar
                                            </Link>
                                        </>}
                                    </div>
                                </div>
                            </>
                            }
                        </>
                        :
                        <div className='no_items_background'>
                            <div className='no_items_container'>
                                <div className='no_items_img'>
                                    <img src={require('../img/financiamiento.png')}/>
                                </div>
                                <div className='no_items_spans'>
                                    <span className='no_items_span_title'>Aún no cuentas con cotizaciones</span>
                                    <span className='no_items_span_text'>Puedes explorar nuestros diferentes servicios dando click <Link to={'/categories/1'}>aquí</Link></span>
                                </div>
                            </div>
                        </div>
                        }
                    </div>
                    {prompt &&
                        <div className="reg_log_prompt" style={promptStyle}>
                            {prompt}
                        </div>}
                </div>
            :<LoadingScreen2></LoadingScreen2>}
        </>
    );
}