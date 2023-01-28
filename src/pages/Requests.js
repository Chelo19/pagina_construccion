import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/Requests.css';
import '../styles/RegLog.css';
import LoadingScreen2 from '../components/LoadingScreen2';
import { Link } from "react-router-dom";

export default function Requests(){
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    
    const [prompt, setPrompt] = useState(null);
    const [promptStyle, setPromptStyle] = useState(null);
    const [noItems, setNoItems] = useState(false);
    const [isPopUp, setIsPopUp] = useState(false);
    const [isPopUpReject, setIsPopUpReject] = useState(false);

    const [requests, setRequests] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);

    useEffect(() => {
        getRequests();
    }, []);

    const getRequests = async () => {
        const { data, error } = await supabase
        .from('requests')
        .select('*, account_email(*)')
        .match({ is_solved: false })
        .order('id', { ascending: true });
        setRequests(data);
        setIsLoading(false);
    }

    const acceptRequest = async () => {
        let currentRequest = requests.filter((request) => {
            return request.id == selectedRequest
        });
        if(currentRequest[0].is_ally_request){
            const { error } = await supabase
            .from('account')
            .update({ role: 'aliado' })
            .eq('id', currentRequest[0].account_email.id);
            if(!error){
                const { error } = await supabase
                .from('requests')
                .update({ is_solved: true })
                .eq('id', selectedRequest);
                setPromptStyle({backgroundColor: '#77DD77'});
                setPrompt('Solicitud Aceptada');
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
    }

    const rejectRequest = async () => {
        const { error } = await supabase
        .from('requests')
        .update({ is_solved: true })
        .eq('id', selectedRequest);
        if(!error){
            setPromptStyle({backgroundColor: '#ff5252'});
            setPrompt('Petición rechazada');
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

    function timeout(number) {
        return new Promise( res => setTimeout(res, number) );
    }

    return(
        <>
            {!isLoading ?
                <div className='requests_background'>
                    <div className='requests_container'>
                        {!noItems ?
                        <>
                            {requests.map((request) => {
                                return(
                                    <div className='requests_item' key={request.id}>
                                        <div className='requests_item_container'>
                                            <span id='requests_item_request'>
                                                Solicitud {request.id}
                                            </span>
                                            <span id='requests_item_user'>
                                                <Link to={'/profile/1'}>
                                                    {request.account_email.name}
                                                </Link>
                                            </span>
                                            <span id='requests_item_id'>
                                                <Link to={'/profile/1'}>
                                                    id: {request.account_email.id}
                                                </Link>
                                            </span>
                                            {request.is_ally_request &&
                                                <span id='requests_item_request'>
                                                    Solicita ser aliado
                                                </span>
                                            }
                                            <div className='requests_item_buttons' onClick={(e) => setSelectedRequest(request.id)}>
                                                <div className='requests_item_button' onClick={(e) => setIsPopUp(true)}>
                                                    <img src={require('../img/aceptar.png')}/>  
                                                </div>
                                                <div className='requests_item_button' onClick={(e) => setIsPopUpReject(true)}>
                                                    <img src={require('../img/rechazar.png')}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </>
                        :
                        <div className='cotizaciones_no_items'>
                            <div className='cotizaciones_no_items_container'>
                                <div className='cotizaciones_no_items_container_text'>
                                    <span>Aún no hay solicitudes</span>
                                </div>
                            </div>
                        </div>}
                        {prompt &&
                            <div className="reg_log_prompt" style={promptStyle}>
                            {prompt}
                        </div>}
                    </div>
                    {isPopUp &&
                        <div className='popup'>
                            <div className='popup_container'>
                                <div className='popup_item_container'>
                                    <div className='popup_text'>
                                        <span>¿Estás seguro de que deseas <span id='popup_text_accept'>aceptar</span> la solicitud {selectedRequest}?</span>
                                    </div>
                                    <div className='popup_buttons'>
                                        <div className='popup_button' onClick={(e) => acceptRequest()}>
                                            <img src={require('../img/aceptar.png')}/>  
                                        </div>
                                        <div className='popup_button' onClick={(e) => setIsPopUp(false)}>
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
                                        <span>¿Estás seguro de que deseas <span id='popup_text_reject'>rechazar</span> la solicitud {selectedRequest}?</span>
                                    </div>
                                    <div className='popup_buttons'>
                                        <div className='popup_button' onClick={(e) => rejectRequest()}>
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
                </div>
            :<LoadingScreen2></LoadingScreen2>}
        </>
    );
}