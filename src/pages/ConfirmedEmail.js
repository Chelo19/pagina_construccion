import { useNavigate, useParams } from "react-router-dom";
import '../styles/ConfirmedEmail.css';

export default function ConfirmedEmail(){
    return(
        <div className="confirmed_email_background">
            <div className="confirmed_email_container">
                <div className="confirmed_email_display">
                    <img id="confirmed_email_logo" src={require('../img/logodrecfullsize.png')}/>
                    <span id="confirmed_email_title">¡Gracias por confirmar tu email!</span>
                    <a href="/" className="confirmed_email_button">Regresar al menú principal</a>
                </div>
            </div>
        </div>
    )
}