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
        <div className='background'>
            <div className='selections'>
                <div className='selections_item'>
                    <div className='selections_item_left'>
                        <a href='/login' id='package'>
                            <img src={require('../img/package.png')} id='package'/>
                        </a>
                    </div>
                    <div className='selections_item_right'>
                        <a href='/login' className='selections_item_title'>
                            <span>Mis servicios</span>
                        </a>
                        <a href='/login' className='selections_item_description'>
                            <span>Revisa el estado del servicio que hayas contratado</span>
                        </a>
                    </div>
                </div>
                <div className='selections_item'>
                    <div className='selections_item_left'>
                        <a href='/login' id='package'>
                            <img src={require('../img/serviciocliente.png')} id='package'/>
                        </a>
                    </div>
                    <div className='selections_item_right'>
                        <a href='/login' className='selections_item_title'>
                            <span>Servicio al cliente</span>
                        </a>
                        <a href='/login' className='selections_item_description'>
                            <span>Contacta con un socio para resolver dudas que tengas</span>
                        </a>
                    </div>
                </div>
                <div id='data' className='selections_item'>
                    <div className='selections_item_left'>
                        <a href='/login' id='package'>
                            <img src={require('../img/cuenta.png')} id='package'/>
                        </a>
                    </div>
                    <div className='selections_item_right'>
                        <a href='/login' className='selections_item_title'>
                            <span>Mi cuenta</span>
                        </a>
                        <a href='/login' className='selections_item_description'>
                            <span>Tus datos</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
