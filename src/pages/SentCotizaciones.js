import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/SentCotizaciones.css';
import { Link } from "react-router-dom";
import LoadingScreen2 from '../components/LoadingScreen2';
import _ from "lodash";


export default function SentCotizaciones(){
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isRejecting, setIsRejecting] = useState(false);

    const [noItems, setNoItems] = useState(false);
    const [prompt, setPrompt] = useState(null);
    const [promptStyle, setPromptStyle] = useState(null);

    const [cotizaciones, setCotizaciones] = useState(null);
    const [selectedCotizacion, setSelectedCotizacion] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);


    useEffect(() => {
        getUser();
    }, []);

    const getUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        getSentCotizaciones(user);
    }

    const getSentCotizaciones = async (user) => {
        const { data, error } = await supabase
        .from('cotizaciones')
        .select(`*, service_id(*)`)
        .or("option_selected.is.null")
        .match({ is_sent: true, is_ended: false, account_email: user.email })
        .order('id', { ascending: true });
        setCotizaciones(data);
        console.log(data);
        if(data.length > 0){
            setIsLoading(false);
        }
        else{
            setNoItems(true);
            setIsLoading(false);
        }
    }

    const acceptOption = async () => {
        if(selectedCotizacion && selectedOption){
            const { error } = await supabase
            .from('cotizaciones')
            .update({ is_sent: true, option_selected: selectedOption })
            .eq('id', selectedCotizacion.id);
            if(!error){
                setPromptStyle({backgroundColor: '#77DD77'});
                setPrompt(`Has aceptado la opción ${selectedOption}`);
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
        else{
            setPromptStyle({backgroundColor: '#161825'});
            setPrompt('Selecciona una opción');
            await timeout(2000);
            setPrompt(null);
            return;
        }
    }
    
    const endCotizacion = async () => {
        console.log("end");
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

    const setDateStyle = (d) => {
        var now = new Date();
        var date = new Date(d);
        date = date.getTime() + 86098571;   // los 86098571 son para corregir la fecha
        let diff = now - date;      // 7 dias en milisegundos es = 604800000
        if(diff > 345600000){       // pasan 4 dias
            return ({color: '#ff5252'});
        }
        else{
            return ({color: '#0077b6'});
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
                                <span className='sent_cotizaciones_title'>Cotizaciones</span>
                                {cotizaciones.map((cotizacion) => {
                                    return(
                                        <Link className='sent_cotizaiones_item' key={cotizacion.id} onClick={(e) => setSelectedCotizacion(cotizacion)}>
                                            <span>{cotizacion.service_id.name}</span>
                                            <span style={setDateStyle(cotizacion.created_at.split('T')[0])}>Fecha de creación: {cotizacion.created_at.split('T')[0]}</span>
                                        </Link>
                                    );
                                })}
                            </>
                            : 
                            <div className='sent_cotizaciones_cotizacion'>
                                <div className='sent_cotizaciones_cotizacion_content'>
                                    <span><span className='sent_cotizaciones_cotizacion_orange'>Servicio:</span> {selectedCotizacion.service_id.name}</span>
                                    <span><span className='sent_cotizaciones_cotizacion_orange'>Descripción del servicio:</span> {selectedCotizacion.service_id.description}</span>
                                </div>
                                <span className='sent_cotizaciones_cotizacion_instructions'>A continuación se le presentarán {selectedCotizacion.options_length} opción(es), donde elegirá una dependiendo de lo que haya visto en la carpeta de muestra.</span>
                                <a href={`${selectedCotizacion.link_drive}`} className='sent_cotizaciones_cotizacion_link'>Link Drive</a>
                                {(!selectedOption && !isRejecting) &&
                                    <div className='sent_cotizaciones_cotizacion_buttons'>
                                        {_.times(selectedCotizacion.options_length, (i) => (
                                            <Link className='sent_cotizaciones_cotizacion_button' onClick={(e) => setSelectedOption(i + 1)} key={i + 1}>
                                                Cotización: {i + 1}
                                            </Link>
                                        ))}
                                        <Link className='sent_cotizaciones_cotizacion_button' id='sent_cotizaciones_cotizacion_return' onClick={(e) => {setSelectedCotizacion(null); setSelectedOption(null)}}>
                                            Regresar
                                        </Link>
                                        <Link className='sent_cotizaciones_cotizacion_button' id='sent_cotizaciones_cotizacion_reject' onClick={(e) => setIsRejecting(true)}>
                                            Finalizar Cotización
                                        </Link>
                                    </div>
                                }
                                {(selectedOption && !isRejecting) &&
                                    <div className='sent_cotizaciones_cotizacion_buttons'>
                                        <span>¿Estás seguro de que deseas aceptar la opción <span className='sent_cotizaciones_cotizacion_orange'>{selectedOption}</span>?</span>
                                        <Link className='sent_cotizaciones_cotizacion_button' id='sent_cotizaciones_cotizacion_accept' onClick={(e) => acceptOption()}>
                                            Aceptar
                                        </Link>
                                        <Link className='sent_cotizaciones_cotizacion_button' id='sent_cotizaciones_cotizacion_return' onClick={(e) => setSelectedOption(null)}>
                                            Regresar
                                        </Link>
                                    </div>
                                }
                                {isRejecting &&
                                    <div className='sent_cotizaciones_cotizacion_buttons'>
                                        <span>¿Estás seguro de que deseas finalizar la cotización?</span>
                                        <Link className='sent_cotizaciones_cotizacion_button' id='sent_cotizaciones_cotizacion_reject' onClick={(e) => endCotizacion()}>
                                            Finalizar
                                        </Link>
                                        <Link className='sent_cotizaciones_cotizacion_button' id='sent_cotizaciones_cotizacion_return' onClick={(e) => setIsRejecting(false)}>
                                            Regresar
                                        </Link>
                                    </div>
                                }
                            </div>}
                        </>
                        :
                        <>
                            No cienes cotizaciones aún
                        </>}
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