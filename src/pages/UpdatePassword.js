import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/Login.css';
import LoadingScreen from "../components/LoadingScreen";


function UpdatePassword(){

    const [newPassword, setNewPassword] = useState(null);
    const [hash, setHash] = useState(null);
    const [loadingScreen, setLoadingScreen] = useState(true);
    const [updatePasswordAlert, setUpdatePasswordAlert] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        getUserMethod();
    });

    const getUserMethod = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        console.log(user);
        supabase.auth.onAuthStateChange(async (event, session) => {
            console.log(event);
            if (event == "PASSWORD_RECOVERY") {
                console.log("Entra");
              const newPassword = prompt("¿Qué contraseña quieres tener?");
              const { data, error } = await supabase.auth
                .updateUser({ password: newPassword })
       
              if (data){
                window.alert("Contraseña cambiada correctamente");
              }
              if (error) window.alert("Algo no salió bien");
            }
          })
        // if(!user) navigate('/');
        setLoadingScreen(false);
    }

    const changePassword = async (e) => {
        setUpdatePasswordAlert("Cambiando Contraseña...");
        e.preventDefault();
        const { data, error } = await supabase.auth
        .updateUser({ password: newPassword });

        if (data){
            window.alert("¡Contraseña cambiada correctamente!");
            setUpdatePasswordAlert("¡Contraseña cambiada correctamente!");
            navigate('/account');
        } 
        if (error) alert("Ocurrió un error al cambiar tu contraseña");
    }

    return(
        <div className='login_background'>
            {!loadingScreen ?
            <div className='login_container'>
                <div className='login_container_center'>
                    <div className='login_img_div'>
                        <img id='login_img' src={require('../img/construction_img2.jpg')}/>
                    </div>
                    <div className='login_right'>
                        <div className='login_form'>
                            <h2>Cambiar contraseña</h2>
                            <div className='login_input'>
                                <span>Nueva contraseña</span>
                                <input 
                                    type = "password" 
                                    name = "newPassword" 
                                    placeholder = "contraseña"
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <div id='sign_in_button'>
                                <a href='#' onClick={changePassword}>Cambiar contraseña</a>
                            </div><br/>
                            <div className='login_input'>
                                <a href="javascript:history.back()">Regresar</a>
                            </div>
                            <div className="register_alert">
                                <span>{updatePasswordAlert}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            : <LoadingScreen/>}
        </div>
    );
}

export default UpdatePassword;