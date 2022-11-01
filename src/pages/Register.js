import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import AuthRegister from '../components/AuthRegister';

function Register(){

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    const navigate = useNavigate();

    return(
        <div>
            <AuthRegister/>
            <br/>
        </div>
    );
}

export default Register;