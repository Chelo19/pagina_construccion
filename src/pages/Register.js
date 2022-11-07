import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import AuthRegister from '../components/AuthRegister';
import '../styles/Register.css';


function Register(){

    const navigate = useNavigate();

    useEffect(() => {
        getUserMethod();
    });

    const getUserMethod = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(user) navigate('/');
    }

    return(
        <div className='register'>
            <div className='orange_background'>
                <AuthRegister/>    
            </div>
        </div>
    );
}

export default Register;