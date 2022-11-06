import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import AuthLogin from '../components/AuthLogin';
import '../styles/Login.css';


function Login(){

    const navigate = useNavigate();

    useEffect(() => {
        getUserMethod();
    });

    const getUserMethod = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(user) navigate('/');
    }

    return(
        <div className='login'>
            <div className='orange_background'>
                <AuthLogin/>    
            </div>
            
        </div>
    );
}

export default Login;