import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/Login.css';


function UpdatePassword(){

    const [newPassword, setNewPassword] = useState(null);
    const [hash, setHash] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        getUserMethod();
    });

    const getUserMethod = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(!user) navigate('/');
    }
    
    useEffect(() => {
        setHash(window.location.hash);
    }, [])

    const changePasswordWithToken = async (e) => {
        e.preventDefault();
        
        try{
            if(!hash){
                return alert("No token");    
            }
            else if(hash){
                const hashArr = hash.substring(1).split('&').map((param) => param.split('='));
                console.log(hashArr);
            }
        } catch(error){
            console.log(error);
        }
        const { data, error } = await supabase.auth
        .updateUser({ password: newPassword });

        if (data) alert("Cambio de contraseña correcto");
        if (error) alert("Ocurrió un error al cambiar tu contraseña");
    }

    const changePassword = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase.auth
        .updateUser({ password: newPassword });

        if (data) alert("Cambio de contraseña correcto");
        if (error) alert("Ocurrió un error al cambiar tu contraseña");
    }

    return(
        <div>
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdatePassword;