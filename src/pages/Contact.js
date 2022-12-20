import '../styles/Contact.css';
import LoadingScreen from "../components/LoadingScreen";
import emailjs from 'emailjs-com';
import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from 'react-router-dom';

export default function Contact(){
    const navigate = useNavigate();
    const [superAdminPhone, setSuperAdminPhone] = useState(+528672207801);
    const [isMailSent, setIsMailSent] = useState(false);
    const [email, setEmail] = useState(null);
    const [message, setMessage] = useState(null);
    const [confirmationAlert, setConfirmationAlert] = useState(null);
    const [loadingScreen, setLoadingScreen] = useState(true);
    var confirmacionesUser = 0;

    const { reload } = useParams();

    useEffect(() => {
        if(reload == "0"){
            navigate('/contact/1');
            window.location.reload();
        }
    },[]);

    const getUserData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(user){
            setEmail(user.email);
            setLoadingScreen(false);
        }
        else if(!user){
            confirmacionesUser++;
            console.log(confirmacionesUser);
            if(confirmacionesUser >= 2){
                navigate('/');
            }
        }
    }

    const sendEmail = async () => {
        if(message){
            console.log(email);
            console.log(message);
            emailjs.send("service_rqa3brt","template_a3asdl2",{
            email: email,
            message: message},
            'a9hJXSTK7xAdC26he');
            setConfirmationAlert("Tu mensaje ha sido enviado correctamente");
            window.alert("Tu mensaje ha sido enviado correctamente");
        }
    }

    useEffect(() => {
        getUserData();
      }, [loadingScreen]);

    return(
        <div className="contact_background">
            {!loadingScreen ?
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
                            <span>{confirmationAlert}</span>
                        </form>
                    </div>
                    <div className='contact_img_container'>
                        <a target="_blank" href={`https://wa.me/${superAdminPhone}`} id='contact_img'>
                            <img src={require('../img/whatsicon.png')}/>
                        </a>
                        <a target="_blank" href={'/'} id='contact_img'>
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
                        <a target="_blank" href={`https://wa.me/${superAdminPhone}`} id='contact_link_img'>
                            <img src={require('../img/whatsicon.png')}/>
                        </a>
                        <a target="_blank" href={'/'} id='contact_link_img'>
                            <img src={require('../img/mailicon.png')}/>
                        </a>
                    </div>
                </div>
            : <LoadingScreen/>}
        </div>
    )
}