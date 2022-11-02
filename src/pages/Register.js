import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import AuthRegister from '../components/AuthRegister';
import '../styles/Register.css';


function Register(){

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    const navigate = useNavigate();

    return(
        <div className='register'>
            <AuthRegister/>
            <br/>
                Already have an account?<br/>
            <a href='/Login'>Click here</a>
        </div>
    );
}

export default Register;