import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import UserArea from '../components/UserArea';
import RemoveFromDB from '../components/RemoveFromDB';
import AddToDB from '../components/AddToDB';
import FetchDB from '../components/FetchDB';
import { useNavigate, useParams } from "react-router-dom";
import '../styles/Home.css';
import { AuthRedirect } from '../hooks/authUser';


export default function Home(){
    const [locationId, setLocationId] = useState(1);
    const [locationName, setLocationName] = useState("Monterrey");
    const [loadingScreen, setLoadingScreen] = useState(true);
    const navigate = useNavigate();
    AuthRedirect();

    const getUserData = async () => {
        try{
            const {
            data: { user },
            } = await supabase.auth.getUser();
        
            const { data, error } = await supabase
            .from("account")
            .select()
            .eq("uuid", user.id);
            
            setLocationName(data[0].location);
            console.log(locationName);        //log
            setLoadingScreen(false);
        }
        catch{

        }
    };
        
    const getLocationId = async () => {
        try{
            const { data, error} = await supabase
            .from("location")
            .select()
            .eq("name", locationName);
            setLocationId(data[0].id);    
            console.log(locationId);        //log
            setLoadingScreen(false);
        } catch{

        }
    }

    useEffect(() => {       
        insertUuid(); 
        getUserData();
        getLocationId();
    }, [loadingScreen])              

    const insertUuid = async () => {

        const { data: { user } } = await supabase.auth.getUser();

        if(user){
            const { data, error } = await supabase
            .from('account')
            .select()
            .eq('email', user.email);
            
            if(data[0].uuid == null){
                console.log("ENTRO");
                const { errorInsert } = await supabase
                .from('account')
                .update({uuid: user.id})
                .eq('email', user.email)
            }
        }
        
        
    }
    
    

    return(
        <div>
            {!loadingScreen
            ? <>
                <div className='background_img'>
                    DREC CONSTRUCCIONES
                </div>
                <div className='big_buttons'>
                    <div className='big_buttons_container'>
                        <div className='big_buttons_container_buttons' id='big_button_1'>
                            <img id='construcciones' className='big_buttons_container_buttons_img' src={require('../img/certificate.png')}/>
                            <a href='' className='big_buttons_container_buttons_description' onClick={() => navigate(`/categories/${locationId}`)}>
                                <div className='big_buttons_container_buttons_description_text'>
                                    CONSTRUCCIONES
                                </div>
                            </a>
                        </div>
                        <div className='big_buttons_container_buttons' id='big_button_2'>
                            <img id='construcciones' className='big_buttons_container_buttons_img' src={require('../img/certificate.png')}/>
                            <a href='' className='big_buttons_container_buttons_description' onClick={() => navigate(`/categories/${locationId}`)}>
                                <div className='big_buttons_container_buttons_description_text'>
                                    MATERIALES
                                </div>
                            </a>
                        </div>
                        <div className='big_buttons_container_buttons' id='big_button_3'>
                            <img id='construcciones' className='big_buttons_container_buttons_img' src={require('../img/certificate.png')}/>
                            <a href='' className='big_buttons_container_buttons_description' onClick={() => navigate(`/categories/${locationId}`)}>
                                <div className='big_buttons_container_buttons_description_text'>
                                    SERVICIOS
                                </div>
                            </a>
                        </div>
                        <div className='big_buttons_container_buttons' id='bit_button_4'>
                            <img id='construcciones' className='big_buttons_container_buttons_img' src={require('../img/certificate.png')}/>
                            <a href='' className='big_buttons_container_buttons_description' onClick={() => navigate(`/categories/${locationId}`)}>
                                <div className='big_buttons_container_buttons_description_text'>
                                    NOSOTROS
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
                <div className='our_projects_presentation'>
                    <a href='/Categories' className='our_projects_presentation_text'>
                        NUESTROS PROYECTOS
                    </a>
                </div>
                <div className='our_projects'>
                    <div className='our_projects_container'>
                        <a href='' className='our_projects_container_button' onClick={() => navigate(`/categories/${locationId}`)}>
                            <div className='our_projects_container_button_top'>
                                <img src={require('../img/services/service_4.jpg')}/>
                            </div>
                            <div className='our_projects_container_button_bottom'>
                                <div className='our_projects_container_button_bottom_text'>
                                    SERVICIO 1
                                </div>
                            </div>
                        </a>
                        <a href='' className='our_projects_container_button' onClick={() => navigate(`/categories/${locationId}`)}>
                            <div className='our_projects_container_button_top'>
                                <img src={require('../img/services/service_2.jpg')}/>
                            </div>
                            <div className='our_projects_container_button_bottom'>
                                <div className='our_projects_container_button_bottom_text'>
                                    SERVICIO 2
                                </div>
                            </div>
                        </a>
                        <a href='' className='our_projects_container_button' onClick={() => navigate(`/categories/${locationId}`)}>
                            <div className='our_projects_container_button_top'>
                                <img src={require('../img/services/service_3.jpg')}/>
                            </div>
                            <div className='our_projects_container_button_bottom'>
                                <div className='our_projects_container_button_bottom_text'>
                                    SERVICIO 3
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
                <br/><br/><br/><br/>
                <div className='staff'>
                    <div className='staff_left'>
                        <div className='staff_left_container'>
                            <div className='staff_left_container_text'>
                                Contamos con los mejores socios para la realización de tu servicio
                            </div>
                        </div>
                    </div>
                    <div className='staff_right'>
                        <div className='staff_right_card'>
                            <div className='staff_right_card_top'></div>
                            <div className='staff_right_card_bottom'>
                                <div className='staff_right_card_bottom_content'>
                                        <a className='staff_right_card_bottom_content_name' href='/Login'>Marcelo De León</a>
                                        <div className='staff_right_card_bottom_content_icons'>
                                            <a className='staff_right_card_bottom_content_icons_individual' href='/Login'><img id='logo_fb' src={require('../img/certificate.png')}></img></a>
                                            <a className='staff_right_card_bottom_content_icons_individual' href='/Login'><img id='logo_mail' src={require('../img/certificate.png')}></img></a>
                                            <a className='staff_right_card_bottom_content_icons_individual' href='/Login'><img id='logo_phone' src={require('../img/certificate.png')}></img></a>
                                        </div>
                                    </div>
                                </div>
                        </div>
                        <div className='staff_right_card'>
                            <div className='staff_right_card_top'></div>
                            <div className='staff_right_card_bottom'>
                                <div className='staff_right_card_bottom_content'>
                                        <a className='staff_right_card_bottom_content_name' href='/Login'>Marcelo De León</a>
                                        <div className='staff_right_card_bottom_content_icons'>
                                            <a className='staff_right_card_bottom_content_icons_individual' href='/Login'><img id='logo_fb' src={require('../img/certificate.png')}></img></a>
                                            <a className='staff_right_card_bottom_content_icons_individual' href='/Login'><img id='logo_mail' src={require('../img/certificate.png')}></img></a>
                                            <a className='staff_right_card_bottom_content_icons_individual' href='/Login'><img id='logo_phone' src={require('../img/certificate.png')}></img></a>
                                        </div>
                                    </div>
                                </div>
                        </div>
                        <div className='staff_right_card'>
                            <div className='staff_right_card_top'></div>
                            <div className='staff_right_card_bottom'>
                                <div className='staff_right_card_bottom_content'>
                                    <a className='staff_right_card_bottom_content_name' href='/Login'>Marcelo De León</a>
                                    <div className='staff_right_card_bottom_content_icons'>
                                        <a className='staff_right_card_bottom_content_icons_individual' href='/Login'><img id='logo_fb' src={require('../img/certificate.png')}></img></a>
                                        <a className='staff_right_card_bottom_content_icons_individual' href='/Login'><img id='logo_mail' src={require('../img/certificate.png')}></img></a>
                                        <a className='staff_right_card_bottom_content_icons_individual' href='/Login'><img id='logo_phone' src={require('../img/certificate.png')}></img></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        : <div className='loading_screen'>
            <div className='loading_screen_animation'>
                Cargando datos...
            </div>
            </div>}
        </div>
        
    );
}
