import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import UserArea from '../components/UserArea';
import RemoveFromDB from '../components/RemoveFromDB';
import AddToDB from '../components/AddToDB';
import FetchDB from '../components/FetchDB';
import { useNavigate, useParams } from "react-router-dom";
import '../styles/Home.css';
import { AuthRedirect } from '../hooks/authUser';
import LoadingScreen from '../components/LoadingScreen';


export default function Home(){
    const [locationId, setLocationId] = useState(1);
    const [locationName, setLocationName] = useState("Monterrey");
    const [loadingScreen, setLoadingScreen] = useState(true);
    const [enterprises, setEnterprises] = useState();
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
        getEnterprises();
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

    const getEnterprises = async () => {
        const { data, error } = await supabase
        .from('enterprises')
        .select();
        setEnterprises(data);
        console.log(data);
    }
    
    

    return(
        <div>
            {!loadingScreen
            ? <>
                <div className='background_img'>
                    <span id='background_img_title'>DREC</span>
                    <span id='background_img_eslogan'><i>"La construcción que siempre debiste tener"</i></span>
                </div>
                
                <div className='our_projects_presentation'>
                    <a Link to="/categories/" onClick={() => navigate(`/categories/${locationId}`)} className='our_projects_presentation_text'>
                        NUESTROS SERVICIOS
                    </a>
                </div>
                <div className='our_projects'>
                    <div className='our_projects_container'>
                        <a Link to="/categories/" className='our_projects_container_button' onClick={() => navigate(`/categories/${locationId}`)}>
                            <div className='our_projects_container_button_top'>
                                <img src={require('../img/services/service_4.jpg')}/>
                            </div>
                            <div className='our_projects_container_button_bottom'>
                                <div className='our_projects_container_button_bottom_text'>
                                    SERVICIO 1
                                </div>
                            </div>
                        </a>
                        <a Link to="/categories/" className='our_projects_container_button' onClick={() => navigate(`/categories/${locationId}`)}>
                            <div className='our_projects_container_button_top'>
                                <img src={require('../img/services/service_2.jpg')}/>
                            </div>
                            <div className='our_projects_container_button_bottom'>
                                <div className='our_projects_container_button_bottom_text'>
                                    SERVICIO 2
                                </div>
                            </div>
                        </a>
                        <a Link to="/categories/" className='our_projects_container_button' onClick={() => navigate(`/categories/${locationId}`)}>
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
                <div className='enterprises'>
                    <div className='enterprises_container'>
                        <div className='enterprises_left'>

                        </div>
                        <div className='enterprises_right'>

                        </div>
                    </div>
                </div>
            </>
        : <LoadingScreen/>}
        </div>
        
    );
}
