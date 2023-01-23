import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate, useParams} from 'react-router-dom';
import '../styles/Profile.css';
import LoadingScreen2 from '../components/LoadingScreen2';
import { Link } from "react-router-dom";

export default function Profile(){
    const navigate = useNavigate();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);

    const [isAlly, setIsAlly] = useState(true);
    const [isAdmin, setIsAdmin] = useState(true);
    
    const [profile, setProfile] = useState(null);
    const [noItems, setNoItems] = useState(false);

    useEffect(() => {
        getProfile();
    }, [])

    const getProfile = async() => {
        const { data, error } = await supabase
        .from('account')
        .select()
        .match({ id: id });
        if(data){
            setProfile(data[0]);
            setIsLoading(false);
        }
        if(data.length == 0){
            setNoItems(true);
        }
    }

    return(
        <>
            {!isLoading ? 
                <div className='profile_background'>
                    <div className='profile_container'>
                        <div className='profile_display'>
                            {!noItems ?
                                <>
                                    <span id='profile_title'>Perfil de usuario</span>
                                    <div className='profile_img'>
                                        <img src={require('../img/aliados.png')}/>
                                    </div>
                                    <div className='profile_content'>
                                        <span>Id: {profile.id}</span>
                                        <span>Nombre: {profile.name}</span>
                                        <span>Email: {profile.email}</span>
                                        <span>Teléfono: {profile.phone}</span>
                                        <span>Monterrey, N.L., Mexico</span>
                                        {isAlly ?
                                            <>
                                                <span id='profile_link'><Link to={'/'}>Servicios y categorias</Link></span>
                                                <span id='profile_link'><Link to={'/'}>Cotizaciones</Link></span>
                                                <span id='profile_link'><Link to={'/'}>Proyectos</Link></span>
                                            </>
                                        : 
                                        <>
                                            <span id='profile_link'><Link to={'/'}>Mis cotizaciones</Link></span>
                                            <span id='profile_link'><Link to={'/'}>Mis proyectos</Link></span>
                                        </>
                                        }
                                    </div>
                                    {isAdmin &&
                                        <div className='profile_buttons'>
                                            <div className='profile_button'>
                                                <div className='profile_button_img'>
                                                    <img src={require('../img/bloquear.png')}/>
                                                </div>
                                                <div className='profile_button_text'>
                                                    <span>Bloquear usuario</span>
                                                </div>
                                            </div>
                                            <div className='profile_button'>
                                                <div className='profile_button_img'>
                                                    <img src={require('../img/editar.png')}/>
                                                </div>
                                                <div className='profile_button_text'>
                                                    <span>Editar usuario</span>
                                                </div>
                                            </div>
                                            <div className='profile_button'>
                                                <div className='profile_button_img'>
                                                    <img src={require('../img/eliminar.png')}/>
                                                </div>
                                                <div className='profile_button_text'>
                                                    <span>Eliminar usuario</span>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    <span id='profile_link'><Link to={'/'}>Quiero ser aliado</Link></span>
                                </>
                            : <div className='profile_no_items'>No se encontró usuario con Id: {id}</div>}
                        </div>
                    </div>
                </div>
            : <LoadingScreen2></LoadingScreen2>}
        </>
    );
}