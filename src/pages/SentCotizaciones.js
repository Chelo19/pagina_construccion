import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/Cotizaciones.css';
import { Link } from "react-router-dom";
import LoadingScreen2 from '../components/LoadingScreen2';
import _ from "lodash";


export default function SentCotizaciones(){
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    const [noItems, setNoItems] = useState(false);
    const [isPopUp, setIsPopUp] = useState(false);
    const [isPopUpReject, setIsPopUpReject] = useState(false);
    const [prompt, setPrompt] = useState(null);
    const [promptStyle, setPromptStyle] = useState(null);
    const [dateStyle, setDateStyle] = useState({color: '#0077b6'});

    const [cotizaciones, setCotizaciones] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedCotizacion ,setSelectedCotizacion] = useState(null);


    useEffect(() => {
        getUser();
    }, []);

    const getUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        getSentCotizaciones(user);
    }

    const getSentCotizaciones = async (user) => {
        console.log(user.email);
        const { data, error } = await supabase
        .from('cotizaciones')
        .select(`*, service_id(*)`)
        .or("option_selected.is.null")
        .match({ is_ended: false, account_email: user.email })
        .order('id', { ascending: true });
        console.log(data);
        console.log(error);
        setCotizaciones(data);
        if(data.length > 0){
            setIsLoading(false);
        }
        else{
            setNoItems(true);
            setIsLoading(false);
        }
    }

    const acceptCotizacion = async () => {
        const { error } = await supabase
        .from('cotizaciones')
        .update({ option_selected: selectedOption })
        .eq('id', selectedCotizacion);
        if(!error){
            setPromptStyle({backgroundColor: '#77DD77'});
            setPrompt('Cotizacion Aceptada');
            await timeout(2000);
            setPrompt(null);
            document.location.reload();
        }
        else{
            console.log(error);
            setPromptStyle({backgroundColor: '#161825'});
            setPrompt('Intenta de nuevo');
            await timeout(2000);
            setPrompt(null);
        }
    }

    const endCotizacion = async () => {
        const { error } = await supabase
        .from('cotizaciones')
        .update({ is_ended: true })
        .eq('id', selectedCotizacion);
        if(!error){
            setPromptStyle({backgroundColor: '#161825'});
            setPrompt('Cotizacion finalizada');
            await timeout(2000);
            setPrompt(null);
            document.location.reload();
        }
        else{
            console.log(error);
            setPromptStyle({backgroundColor: '#161825'});
            setPrompt('Intenta de nuevo');
            await timeout(2000);
            setPrompt(null);
        }
        setPromptStyle({backgroundColor: '#161825'});
        setPrompt('Cotizacion Finalizada');
        await timeout(2000);
        setPrompt(null);
    }

    const selectOption = async (cotizacionId, i) => {
        setIsPopUp(true);
        setSelectedCotizacion(cotizacionId);
        setSelectedOption(i);
    }

    function timeout(number) {
        return new Promise( res => setTimeout(res, number) );
    }

    return(
        <>
            {!isLoading ?
                <div className='cotizaciones_background'>
                    <div className='cotizaciones_container'>
                        {!noItems ?
                        <>
                            {cotizaciones.map((cotizacion) => {
                                return(
                                    <div className='cotizaciones_item' key={cotizacion.id}>
                                        <div className='sent_cotizaciones_item_container'>
                                            <span id='cotizaciones_title'>
                                                {cotizacion.service_id.name}
                                            </span>
                                            <a href={`${cotizacion.link_drive}`}>
                                                <span id='cotizaciones_drive'>
                                                    Link drive
                                                </span>
                                            </a>
                                            <span id='cotizaciones_instructions'>
                                                Selecciona la cotización que se adecúe a tus necesidades
                                            </span>
                                            <div className='sent_cotizaciones_item_buttons'>
                                                {_.times(cotizacion.options_length, (i) => (
                                                    <a className='sent_cotizaciones_item_button' onClick={(e) => selectOption(cotizacion.id, i + 1)} key={i}>
                                                        {i + 1}
                                                    </a>
                                                ))}
                                            </div>
                                            <a className='sent_cotizaciones_item_end_cotizacion' onClick={(e) => {setIsPopUpReject(true); setSelectedCotizacion(cotizacion.id)}}>
                                                <span>Finalizar cotizacion</span>
                                            </a>
                                            <span id='sent_cotizaciones_item_end_date' style={dateStyle}>Fecha límite: 20/10/23</span>
                                        </div>
                                    </div>
                                )})}
                        </> 
                        :
                        <div className='cotizaciones_no_items'>
                            <div className='cotizaciones_no_items_container'>
                                <div className='cotizaciones_no_items_container_text'>
                                    <span>Aún no tienes cotizaciones</span>
                                    <span>Explora nuestros servicios <Link to={'/categories/1'} id='cotizaciones_no_items_container_link'>aquí</Link></span>
                                </div>
                            </div>
                        </div>}
                    </div>
                    {isPopUp &&
                        <div className='popup'>
                            <div className='popup_container'>
                                <div className='popup_item_container'>
                                    <div className='popup_text'>
                                        <span>¿Estás seguro de que deseas aceptar la cotización {selectedOption}?</span>
                                    </div>
                                    <div className='popup_buttons'>
                                        <div className='popup_button' onClick={acceptCotizacion}>
                                            <img src={require('../img/aceptar.png')}/>  
                                        </div>
                                        <div className='popup_button' onClick={(e) => {setIsPopUp(false); setSelectedCotizacion(null); setSelectedOption(null)}}>
                                            <img src={require('../img/rechazar.png')}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    {isPopUpReject &&
                        <div className='popup'>
                            <div className='popup_container'>
                                <div className='popup_item_container'>
                                    <div className='popup_text'>
                                        <span>¿Estás seguro de que quieres finalizar la cotización?</span>
                                    </div>
                                    <div className='popup_buttons'>
                                        <div className='popup_button' onClick={endCotizacion}>
                                            <img src={require('../img/aceptar.png')}/>  
                                        </div>
                                        <div className='popup_button' onClick={(e) => setIsPopUpReject(false)}>
                                            <img src={require('../img/rechazar.png')}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    {prompt &&
                        <div className="reg_log_prompt" style={promptStyle}>
                            {prompt}
                        </div>}
                </div>
            :<LoadingScreen2></LoadingScreen2>}
        </>
    );
}