import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import AuthLogin from '../components/AuthLogin';
import '../styles/Login.css';


function Login(){

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    const navigate = useNavigate();

    return(
        <div className='login'>
            <AuthLogin/>
            <br/>
                Don't have an account?<br/>
            <a href='/Register'>Click here</a>
        </div>
    );
}

export default Login;