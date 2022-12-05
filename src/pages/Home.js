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
import { Link } from 'react-router-dom';


export default function Home(){
    const [loadingScreen, setLoadingScreen] = useState(true);
    const [enterprises, setEnterprises] = useState();
    const [servicesForDisplay, setServicesForDisplay] = useState(null);
    const [uLocationId, setULocationId] = useState(1);
    const navigate = useNavigate();
    var locationName;
    var locationId = 1;
    var displayServicesSel = [];
    var displayServices = [];
    var services = [];
    AuthRedirect();
    
    useEffect(() => {      
        insideUseEffect();
    }, [loadingScreen])    

    const insideUseEffect = () => {
        insertUuid();
        getUserData();
    }
    
    const insertUuid = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(user){
            const { data, error } = await supabase
            .from('account')
            .select()
            .eq('email', user.email);
            
            if(data[0].uuid == null){
                console.log("Anadiendo UUID");
                const { errorInsert } = await supabase
                .from('account')
                .update({uuid: user.id})
                .eq('email', user.email)
            }
        }
    }
    
    const getUserData = async () => {
        try{
            const { data: { user } } = await supabase.auth.getUser();
            if(user){
                const { data, error } = await supabase
                .from("account")
                .select()
                .eq("uuid", user.id);
                locationName = data[0].location;
                getLocationId();
            }
            else{
                getEnterprises();
            }
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
            locationId = data[0].id;
            getEnterprises();
            setULocationId(locationId);
        } catch{

        }
    };

    const getEnterprises = async () => {
        const { data, error } = await supabase
        .from('enterprises')
        .select()
        .eq( 'location_id' , locationId );
        setEnterprises(data);
        setLoadingScreen(false);
        servicesHomePage();
    }

    const servicesHomePage = async () => {
        getDisplayServices();
        getServices();
        setDisplayServices();
    }

    const getDisplayServices = async () => {
        const { data, error } = await supabase
        .from("display_services")
        .select("service_id")
        .eq("location_id", locationId);
        if(displayServices.length >= data.length){
        }
        else{
            for(var i = 0 ; i < data.length ; i++){
                displayServices.push(data[i].service_id);
            }
        }
        console.log(displayServices);
        setLoadingScreen(false);
    };

    const getServices = async () => {
        const { data, error } = await supabase
        .from("services")
        .select("*");
        if(services.length >= data.length){
        }
        else{
            for(var i = 0 ; i < data.length ; i++){
                services.push(data[i]);
            }
        }
        console.log(services);
        setLoadingScreen(false);
    };

    const setDisplayServices = async () => {
        if(servicesForDisplay == null){
            for(var i = 0 ; i < services.length ; i++){
                for(var j = 0 ; j < displayServices.length ; j++){
                    if(services[i].id == displayServices[j]){
                        displayServicesSel.push(services[i]);
                    }
                }
            }
            setServicesForDisplay(displayServicesSel);
        }
        else{

        }
        console.log(displayServicesSel);
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
                    <Link to={`/categories/${uLocationId}`} style={{ color: 'inherit', textDecoration: 'inherit'}} className='our_projects_presentation_text'>
                        NUESTROS SERVICIOS
                    </Link>
                </div>
                <div className='our_projects'>
                    <div className='our_projects_container'>
                        {console.log(servicesForDisplay)}
                        {servicesForDisplay.map((displayService) => {
                            return(
                                <Link to={`/service/${displayService.id}`} className='our_projects_container_button' key={displayService.id}>
                                    <div className='our_projects_container_button_top'>
                                        <img src={displayService.img_url[0]}/>
                                    </div>
                                    <div className='our_projects_container_button_bottom'>
                                        <div className='our_projects_container_button_bottom_text'>
                                            {displayService.name}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                        
                    </div>
                </div>
                <br/>
                <div className='enterprises'>
                    <div className='enterprises_container'>
                        <div className='enterprises_left'>
                            <div className='enterprises_text'>
                                Contamos con los mejores aliados para la realización de tu servicio
                            </div>
                        </div>
                        <div className='enterprises_right'>
                            <div className='enterprises_gallery'>
                                {enterprises.map((enterprise) => {
                                    return(
                                        <div className='enterprises_item' key={enterprise.id}>
                                            <img src={enterprise.img_url}/>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        : <LoadingScreen/>}
        </div>
        
    );
}
