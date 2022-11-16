import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/Login.css';


function Login(){

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        getUserMethod();
    });

    const getUserMethod = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(user) navigate('/');
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
            if (error) throw error;
            alert("Succesfully logged in");
            document.location.reload();
            navigate('/');
        } catch(e){
            alert(e.message);
        }
    };

    return(
        <div>
            <div className='login_container'>
                <div className='login_container_center'>
                    <div className='login_img_div'>
                        <img id='login_img' src={require('../img/construction_img2.jpg')}/>
                    </div>
                    <div className='login_right'>
                        <div className='login_form'>
                            <h2>Login</h2>
                            <div className='login_input'>
                                <span>Email</span>
                                <input 
                                    type = "email" 
                                    name = "email" 
                                    placeholder = "youremail@example.com"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className='login_input'>
                                <span>Password</span>
                                <input 
                                    type = "password" 
                                    name = "password" 
                                    placeholder = "password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div id='sign_in_button'>
                                <a href='#' onClick={hangleSignIn}>Sign In</a>
                            </div><br/>
                            <div className='login_input'>
                                    ¿No tienes una cuenta?&nbsp;
                                    <a href='/Register'>Haz click aquí</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;