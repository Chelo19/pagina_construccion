import {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {supabase} from '../supabase/client';
import '../styles/Account.css';

export default function Account(){

    const navigate = useNavigate(); 

    useEffect(() => {
        getUserMethod();
    });
    
    const getUserMethod = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(!user) navigate('/Login');
    }

    return(
        <div className='container_center'>
            <div className='container_center_blue'>
                
            </div>
        </div>
    )
}
