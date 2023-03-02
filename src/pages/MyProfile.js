import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate, useParams} from 'react-router-dom';
import '../styles/Profile.css';
import LoadingScreen2 from '../components/LoadingScreen2';
import { Link } from "react-router-dom";

export default function MyProfile(){
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    
    const [isAlly, setIsAlly] = useState(false);

    const [profile, setProfile] = useState(null);
    
    useEffect(() => {
        getProfile();
    }, [])
    
    const getProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
        .from('account')
        .select()
        .match({ uuid: user.id });
        if(data[0].role == 'aliado') setIsAlly(true);
        setProfile(data[0]);
        setIsLoading(false);
    }

    return(
        <>
            {!isLoading ? 
                <div className='profile_background'>
                    <div className='profile_container'>
                        <div className='profile_display'>
                            <span id='profile_title'>Perfil de {isAlly ? <>aliado</> : <>usuario</>}</span>
                            <div className='profile_img'>
                                <img src={require('../img/aliados.png')}/>
                            </div>
                            <div className='profile_content'>
                                <span>Id: {profile.id}</span>
                                <span>Nombre: {profile.name}</span>
                                <span>Email: {profile.email}</span>
                                <span>Teléfono: {profile.phone}</span>
                                <span>Monterrey, N.L., Mexico</span>
                                <span id='profile_link'><Link to={'/mis-cotizaciones'}>Mis cotizaciones</Link></span>
                                <span id='profile_link'><Link to={'/'}>Mis proyectos</Link></span>
                                {isAlly &&
                                    <>
                                        <span id='profile_link'><Link to={'/'}>Cotizaciones pendientes</Link></span>
                                        <span id='profile_link'><Link to={'/'}>Proyectos aceptados</Link></span>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            : <LoadingScreen2></LoadingScreen2>}
        </>
    );
}