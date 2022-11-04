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
            <div className='orange_background'>
                <AuthLogin/>    
            </div>
            
        </div>
    );
}

export default Login;