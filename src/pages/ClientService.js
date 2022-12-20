import '../styles/ClientService.css';
import LoadingScreen from "../components/LoadingScreen";
import emailjs from 'emailjs-com';
import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { useNavigate, useParams } from "react-router-dom";

export default function ClientService(){

    const { reload } = useParams();

    useEffect(() => {
        if(reload == "0"){
            console.log("Entra");
            navigate('/client-service/1');
            window.location.reload();
        }
    },[]);


    const navigate = useNavigate();
    const [isMailSent, setIsMailSent] = useState(false);
    const [email, setEmail] = useState(null);
    const [message, setMessage] = useState(null);
    const [confirmationAlert, setConfirmationAlert] = useState(null);
    const [loadingScreen, setLoadingScreen] = useState(true);
    var confirmacionesUser = 0;

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
        <div className="client_service_background">
            {!loadingScreen ?
                <div className='client_service_container'>
                    <div className='client_service_form_container'>
                        <form className='client_service_form' onSubmit={sendEmail}>
                            <span>Dinos en qué te podemos ayudar</span>
                            <textarea className='client_service_form_inputs'
                            onChange={(e) => setMessage(e.target.value)}
                            rows={18}
                            placeholder={"¿En qué podemos ayudarte?"}
                            />
                            <button id='client_service_submit'>Enviar</button>
                            <span>{confirmationAlert}</span>
                        </form>
                    </div>
                    <div className='client_service_img_container'>
                        <div id='client_service_img'>
                            <img src={require('../img/comunicacion.png')}/>
                        </div>
                    </div>
                </div>
            : <LoadingScreen/>}
        </div>
    )
}