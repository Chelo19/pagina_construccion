import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/Contact.css';
import { Link } from "react-router-dom";
import LoadingScreen2 from '../components/LoadingScreen2';
import GoBackButton from '../components/GenericAssets';
import emailjs from 'emailjs-com';

import TurnLeftOutlinedIcon from '@mui/icons-material/TurnLeftOutlined';
import NavigateBeforeOutlinedIcon from '@mui/icons-material/NavigateBeforeOutlined';
import Alert from '@mui/material/Alert';

export default function Contact(){
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [additionalMessage, setAdditionalMessage] = useState(null);

    const [prompt, setPrompt] = useState(null);
    const [promptSeverity, setPromptSeverity] = useState('success');

    useEffect(() => {
        getUserData();
    }, []);

    const getUserData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(user){
            setUserEmail(user.email);
            setIsLoading(false);
        }
    }

    const sendEmail = async () => {
        if(message){
            emailjs.send("service_rqa3brt","template_a3asdl2",{
            additionalMessage: additionalMessage,
            contactEmail: 'grupodrec@gmail.com',
            email: userEmail,
            message: message},
            'a9hJXSTK7xAdC26he');
            setPrompt('¡Tu comentario ha sido enviado correctamente!')
            setPromptSeverity('success');
            await timeout(2000);
            setPrompt(null);
            navigate('/');
        }
    }

    function timeout(number) {
        return new Promise( res => setTimeout(res, number) );
    }

    return(
        <div className="contact_background">
            {!isLoading ?
                <div className='contact_container'>
                    <div className='contact_img_container' id='left_contact_img_container'>
                        <a target="_blank" href='https://www.facebook.com/GrupoDREC?mibextid=ZbWKwL' id='contact_img'>
                            <img src={require('../img/fbicon.png')}/>
                        </a>
                        <a target="_blank" href={'https://www.instagram.com/drec_constructor/'} id='contact_img'>
                            <img src={require('../img/igicon.png')}/>
                        </a>
                    </div>
                    <div className='contact_form_container'>
                        <form className='contact_form' onSubmit={sendEmail}>
                            <span>Contacto</span>
                            <textarea className='contact_form_inputs'
                            onChange={(e) => setMessage(e.target.value)}
                            rows={18}
                            placeholder={"Envía tu mensaje"}
                            />
                            <button id='contact_submit'>Enviar</button>
                        </form>
                    </div>
                    <div className='contact_img_container'>
                        <a target="_blank" href={`https://wa.me/+5218281220943`} id='contact_img'>
                            <img src={require('../img/whatsicon.png')}/>
                        </a>
                        <a target="_blank" href={'mailto:grupodrec@gmail.com'} id='contact_img'>
                            <img src={require('../img/mailicon.png')}/>
                        </a>
                    </div>
                    <div className='contact_links_container'>
                        <a target="_blank" href='https://www.facebook.com/GrupoDREC?mibextid=ZbWKwL' id='contact_link_img'>
                            <img src={require('../img/fbicon.png')}/>
                        </a>
                        <a target="_blank" href={'https://www.instagram.com/drec_constructor/'} id='contact_link_img'>
                            <img src={require('../img/igicon.png')}/>
                        </a>
                        <a target="_blank" href={`https://wa.me/+5218281220943`} id='contact_link_img'>
                            <img src={require('../img/whatsicon.png')}/>
                        </a>
                        <a target="_blank" href={'mailto:grupodrec@gmail.com'} id='contact_link_img'>
                            <img src={require('../img/mailicon.png')}/>
                        </a>
                    </div>
                    {prompt &&
                        <>
                            <Alert className='generic_alert' severity={`${promptSeverity}`} onClose={(e) => setPrompt(null)}>{prompt}</Alert>
                        </>}
                </div>
            :
            <LoadingScreen2/>}
        </div>
    )
}