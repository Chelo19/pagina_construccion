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
    const [isAccepting, setIsAccepting] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);

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
        if(selectedRequest.is_ally_request){
            const { error } = await supabase
            .from('account')
            .update({ role: 'aliado' })
            .eq('id', selectedRequest.account_email.id);
            if(!error){
                const { error } = await supabase
                .from('requests')
                .update({ is_solved: true })
                .eq('id', selectedRequest.id);
                if(!error){
                    setPromptStyle({backgroundColor: '#77DD77'});
                    setPrompt('Solicitud Aceptada');
                    await timeout(2000);
                    setPrompt(null);
                    document.location.reload();
                }
                else{
                    console.log(error);
                    console.log("1");
                    setPromptStyle({backgroundColor: '#161825'});
                    setPrompt('Intenta de nuevo');
                    await timeout(2000);
                    setPrompt(null);
                    return;
                }
            }
            else{
                console.log(error);
                console.log("2");
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
        .eq('id', selectedRequest.id);
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
                        {!selectedRequest ?
                            <>
                                <span className='requests_title'>Solicitudes</span>
                                {requests.map((request) => {
                                    return(
                                        <div className='requests_item' onClick={(e) => setSelectedRequest(request)} key={request.id}>
                                            <span>{request.account_email.email}</span>
                                            <span>id de cuenta: {request.account_email.id}</span>
                                            {request.is_ally_request &&
                                                <span>Solicita ser aliado</span>
                                            }
                                        </div>
                                    );
                                })}
                            </>
                        : 
                            <div className='requests_selected_request'>
                                <div className='requests_selected_request_content'>
                                    <span><span className='requests_selected_request_orange'>id de solicitud:</span> {selectedRequest.id}</span>
                                    <span><span className='requests_selected_request_orange'>Email:</span> {selectedRequest.account_email.email}</span>
                                    <span><span className='requests_selected_request_orange'>id de cuenta:</span> {selectedRequest.account_email.id}</span>
                                    <span><span className='requests_selected_request_orange'>Nombre de la empresa:</span> {selectedRequest.enterprise_name}</span>
                                    <span><span className='requests_selected_request_orange'>RFC:</span> {selectedRequest.rfc}</span>
                                    <span><span className='requests_selected_request_orange'>Plan seleccionado:</span> {selectedRequest.plan_selection == 1 && <>Mensual</>}{selectedRequest.plan_selection == 2 && <>Anual</>}</span>
                                    <span className='requests_selected_request_orange'>Categorías:</span>
                                    {selectedRequest.categories.map((category) => {
                                        return(
                                            <span key={category}>- {category}</span>
                                        );
                                    })}
                                </div>
                                {(!isAccepting && !isRejecting) &&
                                    <div className='requests_selected_request_buttons'>
                                        <div className='requests_selected_request_button' id='requests_selected_request_button_accept' onClick={(e) => setIsAccepting(true)}>
                                            Aceptar solicitud
                                        </div>
                                        <div className='requests_selected_request_button' id='requests_selected_request_button_reject' onClick={(e) => setIsRejecting(true)}>
                                            Rechazar solicitud
                                        </div>
                                        <div className='requests_selected_request_button' id='requests_selected_request_button_exit' onClick={(e) => setSelectedRequest(null)}>
                                            Regresar
                                        </div>
                                    </div>
                                }
                                {isAccepting &&
                                    <div className='requests_selected_request_buttons'>
                                        <span>Seguro que quieres aceptar esta solicitud?</span>
                                        <div className='requests_selected_request_button' id='requests_selected_request_button_accept' onClick={acceptRequest}>
                                            Aceptar
                                        </div>
                                        <div className='requests_selected_request_button' id='requests_selected_request_button_exit' onClick={(e) => setIsAccepting(false)}>
                                            Regresar
                                        </div>
                                    </div>
                                }
                                {isRejecting &&
                                    <div className='requests_selected_request_buttons'>
                                        <span>Seguro que quieres rechazar esta solicitud?</span>
                                        <div className='requests_selected_request_button' id='requests_selected_request_button_reject' onClick={rejectRequest}>
                                            Rechazar
                                        </div>
                                        <div className='requests_selected_request_button' id='requests_selected_request_button_exit' onClick={(e) => setIsRejecting(false)}>
                                            Regresar
                                        </div>
                                    </div>
                                }
                            </div>}
                    </div>
                    {prompt &&
                        <div className="reg_log_prompt" style={promptStyle}>
                            {prompt}
                        </div>}
                </div>
            : <LoadingScreen2></LoadingScreen2>}
        </>
    );
}