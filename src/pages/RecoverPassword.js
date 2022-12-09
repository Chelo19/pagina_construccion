import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/Login.css';


function RecoverPassword(){

    const [email, setEmail] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        getUserMethod();
    });

    const getUserMethod = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(user) navigate('/');
    }

    useEffect(() => {
        supabase.auth.onAuthStateChange(async (event, session) => {
          if (event == "PASSWORD_RECOVERY") {
            const newPassword = prompt("¿Qué contraseña quieres tener?");
            const { data, error } = await supabase.auth
              .updateUser({ password: newPassword })
     
            if (data) alert("Contraseña cambiada correctamente")
            if (error) alert("Algo no salió bien")
          }
        })
    }, [])

    const sendToken = async (e) => {
        e.preventDefault();
        try{
            console.log(email);
            const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: '/update-password/',
            });
            if(!error) window.alert("¡Revisa tu email!");
            else if(error) alert(error.message);
        } catch(error){
            console.log(error);
        }
    }
      
    return(
        <div className='login_background'>
            <div className='login_container'>
                <div className='login_container_center'>
                    <div className='login_img_div'>
                        <img id='login_img' src={require('../img/construction_img2.jpg')}/>
                    </div>
                    <div className='login_right'>
                        <div className='login_form'>
                            <h2>Recuperar contraseña</h2>
                            <div className='login_input'>
                                <span>Email</span>
                                <input 
                                    type = "email" 
                                    name = "email" 
                                    placeholder = "tuemail@gmail.com"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div id='sign_in_button'>
                                <a href='#' onClick={sendToken}>Enviar verificación al correo</a>
                            </div><br/>
                            <div className='login_input'>
                                <a Link to="/login/" onClick={() => navigate(`/login`)}>Regresar a inicio de sesión</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecoverPassword;