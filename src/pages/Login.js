import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/Login.css';
import LoadingScreen from '../components/LoadingScreen';


function Login(){

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [user, setUser] = useState(null);
    const [loadingScreen, setLoadingScreen] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        getUserMethod();
    }, [loadingScreen]);

    const getUserMethod = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(user) navigate('/');
        setLoadingScreen(false);
    }

    const hangleSignIn = async (e) => {
        e.preventDefault();
        try{
            console.log(email + " " + password);
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
              });
            console.log(data);
            if (error){
                alert("Correo o contraseña no válido");
                return;
            } 
            alert("Has iniciado sesión correctamente");
            document.location.reload();
            navigate('/');
        } catch(e){
            alert(e.message);
        }
    };

    return(
        <div className='login_background'>
            {
                !loadingScreen ? <div className='login_container'>
                <div className='login_container_center'>
                    <div className='login_img_div'>
                        <img id='login_img' src={require('../img/construction_img2.jpg')}/>
                    </div>
                    <div className='login_right'>
                        <div className='login_form'>
                            <h2>Iniciar Sesión</h2>
                            <div className='login_input'>
                                <span>Email</span>
                                <input 
                                    type = "email" 
                                    name = "email" 
                                    placeholder = "tuemail@gmail.com"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className='login_input'>
                                <span>Contraseña</span>
                                <input 
                                    type = "password" 
                                    name = "password" 
                                    placeholder = "contraseña"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div id='sign_in_button'>
                                <a href='#' onClick={hangleSignIn}>Iniciar sesión</a>
                            </div><br/>
                            <div className='login_input'>
                                ¿No tienes una cuenta?&nbsp;
                                <a Link to="/register/" onClick={() => navigate(`/register`)}>Haz click aquí</a>
                            </div>
                            <div className='login_input'>
                                ¿Olvidaste tu contraseña?&nbsp;
                                <a Link to="/recover-password/" onClick={() => navigate(`/recover-password`)}>Recuperar cuenta</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            : <LoadingScreen/>}
            
        </div>
    );
}

export default Login;