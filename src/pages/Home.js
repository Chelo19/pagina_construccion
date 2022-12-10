import {useEffect, useState, useRef} from 'react';
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
    const [enterprises, setEnterprises] = useState(null);
    const [servicesForDisplay, setServicesForDisplay] = useState(null);
    const [uLocationId, setULocationId] = useState(1);
    var confirmaciones = [false, false];
    const navigate = useNavigate();
    var locationName;
    var locationId = 1;
    var displayServicesSel = [];
    const projects = useRef(null);
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
                console.log("Añadiendo UUID");
                const { error } = await supabase
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
                fkDisplayServices();
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
            getDataBases();
            setULocationId(locationId);
        } catch{

        }
    };

    const getDataBases = async () => {
        getEnterprises();
        fkDisplayServices();
        if(confirmaciones[0] && confirmaciones[1]){
            console.log("Sale de getDB");
            setLoadingScreen(false);
        }
    }

    const getEnterprises = async () => {
        const { data, error } = await supabase
        .from('enterprises')
        .select()
        .eq( 'location_id' , locationId );
        if(data != null){
            setEnterprises(data);
            console.log("Sale de getEnter");
            confirmaciones[0] = true;
        }
        if(confirmaciones[0] && confirmaciones[1]){
            console.log("Sale de getDB");
            setLoadingScreen(false);
        }
    }

    const fkDisplayServices = async () => {
        const { data, error } = await supabase
        .from('display_services')
        .select(`service_id, services ( id, name, img_url )`)
        .eq("location_id", locationId);
        console.log(data);
        console.log(error);
        if(displayServicesSel.length >= data.length){
            console.log("displayServicesSel esta lleno");
            console.log("Sale de fkDisp");
            confirmaciones[1] = true;
            setServicesForDisplay(displayServicesSel);
        }
        else{
            for(var i = 0 ; i < data.length ; i++){
                console.log("entra al for");
                console.log(displayServicesSel);
                displayServicesSel.push(data[i].services);
            }
            if(displayServicesSel.length >= data.length){
                console.log("displayServicesSel esta lleno");
                console.log("Sale de fkDisp");
                confirmaciones[1] = true;
                setServicesForDisplay(displayServicesSel);
            }
        }
        if(confirmaciones[0] && confirmaciones[1]){
            console.log("Sale de getDB");
            setLoadingScreen(false);
        }
    }

    const executeScroll = () => {
        projects.current.scrollIntoView()   
    }

    return(
        <div className='home_background'>
            {!loadingScreen
            ? <>
                <div className='background_img'>
                    <div className='background_img_container'>
                        <span id='background_img_title'>DREC</span>
                        <span id='background_img_eslogan'><i>"La construcción que debes tener"</i></span>
                    </div>
                        <Link style={{textDecoration: 'inherit'}} onClick={executeScroll} id='background_img_services'>
                            <span>Servicios</span>
                            <div id='background_img_services_img'>
                                <img src={require('../img/flecha.png')}/>
                            </div>
                        </Link>
                </div>
                <div className='our_projects_presentation' ref={projects}>
                    <Link to={`/categories/${uLocationId}`} style={{textDecoration: 'inherit'}} className='our_projects_presentation_text'>
                        SERVICIOS
                    </Link>
                </div>
                <div className='our_projects'>
                    <div className='our_projects_container'>
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
                    <Link to={`/categories/${uLocationId}`} style={{textDecoration: 'inherit'}} class='our_projects_button'>
                            <span>Ver más</span>
                            <div class='our_projects_button_img'>
                                <img src={require('../img/flecha.png')}/>
                            </div>
                        </Link>
                </div>
                <br/>
                <br/>
                <div className='enterprises'>
                    <div className='enterprises_container'>
                        <div className='enterprises_left'>
                            <div className='enterprises_text'>
                                Los mejores aliados para tu proyecto
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
                <br/>
                <br/>
                <div className='our_features'>
                    <div className='our_features_title'>
                        <span>Para tu proyecto</span>
                    </div>
                    <div className='our_features_container'>
                        <div className='our_features_item'>
                            <div className='our_features_item_img'>
                                <div className='our_features_item_img_bg'>
                                    <img className='our_features_img' src={require('../img/calidad.png')}/>
                                </div>
                            </div>
                            <div className='our_features_item_text'>
                                <span>La mejor calidad</span>
                            </div>
                        </div>
                        <div className='our_features_item'>
                            <div className='our_features_item_img'>
                                <div className='our_features_item_img_bg'>
                                    <img className='our_features_img' src={require('../img/supervision.png')}/>
                                </div>
                            </div>
                            <div className='our_features_item_text'>
                                <span>Supervision en todo el proyecto</span>
                            </div>
                        </div>
                        <div className='our_features_item'>
                            <div className='our_features_item_img'>
                                <div className='our_features_item_img_bg'>
                                    <img className='our_features_img' src={require('../img/garantia.png')}/>
                                </div>
                            </div>
                            <div className='our_features_item_text'>
                                <span>Garantía</span>
                            </div>
                        </div>
                        <div className='our_features_item'>
                            <div className='our_features_item_img'>
                                <div className='our_features_item_img_bg'>
                                    <img className='our_features_img' src={require('../img/financiamiento.png')}/>
                                </div>
                            </div>
                            <div className='our_features_item_text'>
                                <span>Financiamiento</span>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        : <LoadingScreen/>}
        </div>
        
    );
}
