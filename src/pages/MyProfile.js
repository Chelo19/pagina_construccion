import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate, useParams} from 'react-router-dom';
import '../styles/Profile.css';
import LoadingScreen2 from '../components/LoadingScreen2';
import { Link } from "react-router-dom";

import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
export default function MyProfile(){
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    
    const [isClient, setIsClient] = useState(false);
    const [isAlly, setIsAlly] = useState(false);
    const [isAdmin, setIsAdmin] = useState(null);
    const [isManager, setIsManager] = useState(null);
    const [userRating, setUserRating] = useState(null);
    const [allyRating, setAllyRating] = useState(null);

    const [profile, setProfile] = useState(null);
    
    useEffect(() => {
        getProfile();
    }, [])
    
    const getProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        getUserRating(user.email);
        getAllyRating(user.email);
        const { data, error } = await supabase
        .from('account')
        .select()
        .match({ uuid: user.id });
        if(data[0].role == 'cliente') setIsClient(true);
        if(data[0].role == 'aliado') setIsAlly(true);
        if(data[0].role == 'administrador') setIsAdmin(true);
        if(data[0].role == 'gerente') setIsManager(true);
        setProfile(data[0]);
        setIsLoading(false);
    }

    const getUserRating = async (userEmail) => { // asi se saca el rating
        let sum = 0;
        const { data, error } = await supabase
        .from('cotizaciones')
        .select('user_rating')
        .not('user_rating', 'is', null)
        .eq('account_email', userEmail);
        if(!error){
            data.map((project) => {
                return(
                    <>{sum += project.user_rating}</>
                )
            })
            setUserRating(sum / data.length);
        }
        else{
            console.log(error);
        }
    }

    const getAllyRating = async (userEmail) => { // asi se saca el rating
        let sum = 0;
        const { data, error } = await supabase
        .from('cotizaciones')
        .select('ally_rating')
        .not('ally_rating', 'is', null)
        .eq('selected_ally_email', userEmail);
        if(!error){
            data.map((project) => {
                return(
                    <>{sum += project.user_rating}</>
                )
            })
            console.log((sum / data.length));
            setAllyRating(sum / data.length);
        }
        else{
            console.log(error);
        }
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
                                {isNaN(userRating) ?
                                    <>
                                        <span><div>Aún no tienes calificaciones, te invitamos a <Link to={'/categories2'} id='profile_link'>ver nuestros servicios</Link></div></span>
                                    </>
                                    :
                                    <>
                                        <span>Calificación como cliente: {userRating}&nbsp;<StarOutlinedIcon/></span>
                                    </>
                                }
                                {isAlly &&
                                <>
                                    {isNaN(allyRating) ?
                                        <>
                                            <span>Aún no tienes calificaciones como aliado</span>
                                        </>
                                    :
                                        <>
                                            <span>Calificación como aliado: {userRating}<StarOutlinedIcon/></span>
                                        </>
                                    }
                                </>
                                }
                                <span id='profile_link'><Link to={'/mis-cotizaciones'}>Mis cotizaciones</Link></span>
                                <span id='profile_link'><Link to={'/mis-proyectos'}>Mis proyectos</Link></span>
                                {isAlly &&
                                    <>
                                        <span id='profile_link'><Link to={'/cotizaciones-pendientes-aliado'}>Cotizaciones pendientes</Link></span>
                                        <span id='profile_link'><Link to={'/proyectos-aceptados-aliado'}>Proyectos aceptados</Link></span>
                                    </>
                                }
                                {isClient &&
                                    <span id='profile_link'><Link to={'/request-ally'}>Quiero ser aliado</Link></span>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            : <LoadingScreen2></LoadingScreen2>}
        </>
    );
}