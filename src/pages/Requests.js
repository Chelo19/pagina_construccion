import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/Requests.css';
import '../styles/RegLog.css';
import LoadingScreen from '../components/LoadingScreen';
import { Link } from "react-router-dom";

export default function Requests(){
    const navigate = useNavigate();
    
    const [prompt, setPrompt] = useState(null);
    const [promptStyle, setPromptStyle] = useState(null);

    const acceptRequest = async () => {
        setPromptStyle({backgroundColor: '#77DD77'});
        setPrompt('Petición aceptada');
        await timeout(2000);
        setPrompt(null);
    }

    const rejectRequest = async () => {
        setPromptStyle({backgroundColor: '#ff5252'});
        setPrompt('Petición rechazada');
        await timeout(2000);
        setPrompt(null);
    }

    function timeout(number) {
        return new Promise( res => setTimeout(res, number) );
    }

    return(
        <div className='requests_background'>
            <div className='requests_container'>
                <div className='requests_item'>
                    <div className='requests_item_container'>
                        <span id='requests_item_user'>
                            <Link to={'/profile/1'}>
                                Marcelo Amado De Leon Gomez
                            </Link>
                        </span>
                        <span id='requests_item_id'>
                            <Link to={'/profile/1'}>
                                id: 55
                            </Link>
                        </span>
                        <span id='requests_item_request'>
                            Solicita ser aliado
                        </span>
                        <div className='requests_item_buttons'>
                            <div className='requests_item_button' onClick={acceptRequest}>
                                <img src={require('../img/aceptar.png')}/>  
                            </div>
                            <div className='requests_item_button' onClick={rejectRequest}>
                                <img src={require('../img/rechazar.png')}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='requests_item'>
                    <div className='requests_item_container'>
                        <span id='requests_item_user'>
                            <Link to={'/profile/1'}>
                                Juan Perez Lopez
                            </Link>
                        </span>
                        <span id='requests_item_id'>
                            <Link to={'/profile/1'}>
                                id: 99
                            </Link>
                        </span>
                        <span id='requests_item_request'>
                            Solicita ser aliado
                        </span>
                        <div className='requests_item_buttons'>
                            <div className='requests_item_button' onClick={acceptRequest}>
                                <img src={require('../img/aceptar.png')}/>  
                            </div>
                            <div className='requests_item_button' onClick={rejectRequest}>
                                <img src={require('../img/rechazar.png')}/>
                            </div>
                        </div>
                    </div>
                </div>
                {prompt &&
                    <div className="reg_log_prompt" style={promptStyle}>
                    {prompt}
                </div>}
            </div>
        </div>
    );
}