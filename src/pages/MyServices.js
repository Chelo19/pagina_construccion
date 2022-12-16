import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {supabase} from '../supabase/client';
import '../styles/MyServices.css';

export default function MyServices(){

    const navigate = useNavigate();

    useEffect(() => {
        getClientServices();
    });

    const getClientServices = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(!user) navigate('/Login');
        const { data, error } = await supabase
        .from('client_services')
        .select('name')
        .eq('client_uuid', user.id);
        console.log(data); //intentar ensenar el array
    };

    return(
        <div className='my_services_background'>
            <div className='my_services_container'>
                <div className='my_services_container_left'>

                </div>
                <div className='my_services_container_right'>

                </div>
            </div>
        </div>
    )
}