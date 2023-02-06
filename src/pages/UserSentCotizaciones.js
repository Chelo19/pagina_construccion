import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/SentCotizaciones.css';
import LoadingScreen2 from '../components/LoadingScreen2';
import { Link } from "react-router-dom";
import { async } from 'q';

export default function UserSentCotizaciones(){
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isRejecting, setIsRejecting] = useState(false);

    const [noItems, setNoItems] = useState(false);
    const [prompt, setPrompt] = useState(null);
    const [promptStyle, setPromptStyle] = useState(null);

    const [sentCotizaciones, setSentCotizaciones] = useState(null);
    const [pendingCotizaciones, setPendingCotizaciones] = useState(null);
    const [endedCotizaciones, setEndedCotizaciones] = useState(null);
    const [selectedCotizacion, setSelectedCotizacion] = useState(null);
    
    let count = 0;

    useEffect(() => {
        getUser();
    }, []);

    const getUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        getSentCotizaciones(user);
        getPendingCotizaciones(user);
        getEndedCotizaciones(user);
        if(count > 2){
            setIsLoading(false);
        }
        else{
        }
    }

    const getSentCotizaciones = async (user) => {
        const { data, error } = await supabase
        .from('cotizaciones')
        .select(`*, service_id(*)`)
        .or("option_selected.is.null")
        .match({ is_sent: false, is_ended: false, account_email: user.email })
        .order('id', { ascending: true });
        setSentCotizaciones(data);
        if(data) count++;
    }
    
    const getPendingCotizaciones = async (user) => {
        const { data, error } = await supabase
        .from('cotizaciones')
        .select(`*, service_id(*)`)
        .or("option_selected.is.null")
        .match({ is_sent: true, is_ended: false, account_email: user.email })
        .order('id', { ascending: true });
        setPendingCotizaciones(data);
        if(data) count++;
    }

    const getEndedCotizaciones = async (user) => {
        const { data, error } = await supabase
        .from('cotizaciones')
        .select(`*, service_id(*)`)
        .match({ is_ended: true, account_email: user.email })
        .order('id', { ascending: true });
        setEndedCotizaciones(data);
        if(data) count++;
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

    return(
        <>
            {!isLoading ?
                <div className='sent_cotizaciones_background'>
                    <div className='sent_cotizaciones_container'>
                        {!noItems ?
                        <>
                            {!selectedCotizacion ?
                            <>
                                <span className='sent_cotizaciones_title'>Cotizaciones Enviadas</span>
                                {pendingCotizaciones.length > 0 ? 
                                <>
                                    {sentCotizaciones.map((cotizacion) => {
                                        return(
                                            <Link className='sent_cotizaiones_item' key={cotizacion.id} onClick={(e) => setSelectedCotizacion(cotizacion)}>
                                                <span>{cotizacion.service_id.name}</span>
                                                <span>Fecha: {cotizacion.created_at.split('T')[0]}</span>
                                            </Link>
                                        );
                                    })}
                                </>
                                :
                                <>
                                    Aún no tienes cotizaciones enviadas
                                </>
                                }
                                <Link to={'/sent-cotizaciones'} className='sent_cotizaciones_title'>Cotizaciones Pendientes</Link>
                                {pendingCotizaciones.length > 0 ? 
                                <>
                                    {pendingCotizaciones.map((cotizacion) => {
                                        return(
                                            <Link to={'/sent-cotizaciones'} className='sent_cotizaiones_item' key={cotizacion.id}>
                                                <span>{cotizacion.service_id.name}</span>
                                                <span>Fecha: {cotizacion.created_at.split('T')[0]}</span>
                                            </Link>
                                        );
                                    })}
                                </>
                                :
                                <>
                                    Aún no tienes cotizaciones pendientes
                                </>
                                }
                                <span className='sent_cotizaciones_title'>Cotizaciones Terminadas</span>
                                {endedCotizaciones.length > 0 ? 
                                <>
                                    {endedCotizaciones.map((cotizacion) => {
                                        return(
                                            <Link className='sent_cotizaiones_item' key={cotizacion.id} onClick={(e) => setSelectedCotizacion(cotizacion)}>
                                                <span>{cotizacion.service_id.name}</span>
                                                <span>Fecha: {cotizacion.created_at.split('T')[0]}</span>
                                            </Link>
                                        );
                                    })}
                                </>
                                :
                                <>
                                    Aún no tienes cotizaciones finalizadas
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
                        <>
                            No tienes cotizaciones aún
                        </>
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