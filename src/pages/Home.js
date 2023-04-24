import {useEffect, useState, useRef} from 'react';
import {supabase} from '../supabase/client';
import UserArea from '../components/UserArea';
import RemoveFromDB from '../components/RemoveFromDB';
import AddToDB from '../components/AddToDB';
import { useNavigate, useParams } from "react-router-dom";
import '../styles/Home.css';
import { AuthRedirect } from '../hooks/authUser';
import LoadingScreen2 from '../components/LoadingScreen2';
import { Link } from 'react-router-dom';
import {Helmet} from "react-helmet";


export default function Home(){
    const [loadingScreen, setLoadingScreen] = useState(true);
    const [enterprises, setEnterprises] = useState(null);
    const [noEnterprises, setNoEnterprises] = useState(false);
    const [servicesForDisplay, setServicesForDisplay] = useState(null);
    const [noServicesForDisplay, setNoServicesForDisplay] = useState(false);
    const [locationId, setLocationId] = useState(1);
    var userLocationId;
    var confirmaciones = [false, false];
    const navigate = useNavigate();
    var locationName;
    var displayServicesSel = [];
    const projects = useRef(null);
    var comprobation = false;
    var maxDS = 0;
    var bestLocation;
    AuthRedirect();

    const { reload } = useParams();

    useEffect(() => {
        if(reload == "0"){
            navigate('/1');
            window.location.reload();
        }
    },[]);

    useEffect(() => {
        supabase.auth.onAuthStateChange(async (event, session) => {
          if (event == "PASSWORD_RECOVERY") {
            navigate('/update-password/');
          }
        })
    }, [])
    
    useEffect(() => {      
        insideUseEffect();
        fetchGeoLocation();
    }, [loadingScreen])    

    const insideUseEffect = () => {
        insertUuid();
        getUserData();
        getServicesHome();
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
                .eq('email', user.email);
                document.location.reload();
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
                setLocationId(data[0].location_id);
                userLocationId = data[0].location_id;
                getEnterprises();
                fkDisplayServices();
            }
            else{
                getEnterprises();
                fkDisplayServices();
            }
        }
        catch{

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
        if(data.length == 0){
            getServicesHome();
        }
        if(data != null){
            setEnterprises(data);
            confirmaciones[0] = true;
        }
        if(confirmaciones[0] && confirmaciones[1]){
            setLoadingScreen(false);
        }
    }

    const fkDisplayServices = async () => {
        const { data, error } = await supabase
        .from('display_services')
        .select(`service_id, services ( id, name, img_url )`)
        .eq("location_id", locationId);
        if(data.length == 0){
            getServicesHome();
        }
        if(displayServicesSel.length >= data.length){
            confirmaciones[1] = true;
            setServicesForDisplay(displayServicesSel);
        }
        else{
            for(var i = 0 ; i < data.length ; i++){
                displayServicesSel.push(data[i].services);
            }
            if(displayServicesSel.length >= data.length){
                confirmaciones[1] = true;
                setServicesForDisplay(displayServicesSel);
            }
        }
        if(confirmaciones[0] && confirmaciones[1]){
            setLoadingScreen(false);
        }
    }

    const getServicesHome = async () => {
        if(locationId != 1){
            getLocationState();
        }
    }

    const getLocationState = async () => {
        const { data, error } = await supabase
        .from('location')
        .select(`states(id)`)
        .eq("id", locationId);
        if(data){
          getLocationsInState(data[0].states.id);
          bestLocation = data[0].states.id;
        }
        else{
            setNoServicesForDisplay(true);
        }
    };

    const getLocationsInState = async (stateId) => {
        const { data, error } = await supabase
        .from('location')
        .select('id')
        .match({ state_id: stateId });
        if(data){
            if(!comprobation){
                comprobation = true;
                getDisplayServicesFromLocation(data);
                getEnterprisesFromLocation(data);
            }
        }
        else{
            setNoServicesForDisplay(true);
        }
    };

    const getEnterprisesFromLocation = async (locations) => {
        let tempArray = [];
        for(var i = 0 ; i < locations.length ; i++){
            const { data, error } = await supabase
            .from('enterprises')
            .select()
            .eq( "location_id", locations[i].id );
            if(data.length > 0){
                tempArray.push(data);
            }
        }
        setEnterprises(tempArray[0]);
    }

    const getDisplayServicesFromLocation = async (locations) => {
        for(var i = 0 ; i < locations.length ; i++){
            const { data, error } = await supabase
            .from('display_services')
            .select(`service_id, services ( id, name, img_url )`)
            .eq( "location_id", locations[i].id );
            if(data.length > 0){
                if(data.length > maxDS){
                    maxDS = data;
                }
            }
        }
        let tempArray = [];
        for(var i = 0 ; i < maxDS.length ; i++){
            tempArray.push(maxDS[i].services);
        }
        setServicesForDisplay(tempArray);
    }

    const executeScroll = () => {
        projects.current.scrollIntoView()   
    }

    const fetchGeoLocation = async () => {
        let url = 'https://ipinfo.io/json?token=f4a64dfc914585';
        let response = await fetch(url);
        let data = await response.json();
    }

    return(
        <div className='home_background'>
            <Helmet>
                <title>Grupo Drec</title>
                <meta name="description" content="La construcción que debes" />
                <meta name="author" content="Marcelo Amado De León Gómez"></meta>
            </Helmet>
            {!loadingScreen
            ? <>
                <div className='background_img'>
                    <div className='background_img_container'>
                        <div className='background_img_separator'>
                            <span id='background_img_title'>DREC</span>
                            <span id='background_img_eslogan'><i>"Demoler, Remodelar, Edificar y Construir, somos DREC, la construcción que une"</i></span>
                        </div>
                        <Link style={{textDecoration: 'inherit'}} onClick={executeScroll} id='background_img_services'>
                            <span>Servicios</span>
                            {/* <div id='background_img_services_img'>
                                <img src={require('../img/flecha.png')}/>
                            </div> */}
                        </Link>
                    </div>
                </div>
                <div className='our_projects_presentation' ref={projects}>
                    <Link to={`/categories2`} style={{textDecoration: 'inherit'}} className='our_projects_presentation_text'>
                        SERVICIOS
                    </Link>
                </div>
                <div className='our_projects'>
                    {!noServicesForDisplay ?
                        <>
                            <div className="categories_cards_container_home">
                            {servicesForDisplay.map((displayService) => {
                                return(
                                <Link to={`/service2/${displayService.id}`} className="categories_card" key={displayService.id}>
                                    <img src={displayService.img_url[0]}/>
                                    <div className="categories_card__head_home">
                                    <span>{displayService.name}</span>
                                    </div>
                                </Link>
                                )
                            })}
                            </div>
                            <Link to={`/categories2`} style={{textDecoration: 'inherit'}} class='our_projects_button'>
                                    <span>Ver más</span>
                                    <div className='our_projects_button_img'>
                                        <img src={require('../img/flecha.png')}/>
                                    </div>
                            </Link>
                        </>
                    : <div className='home_no_items_alert'>
                            <span>Aún no tenemos servicios disponibles en tu área.</span>
                            <span>¡Estamos trabajando para llegar hasta ti!</span>
                        </div>}
                    
                </div>
                <br/>
                <br/>
                {/* <div className='enterprises'>
                    <div className='enterprises_container'>
                        <div className='enterprises_left'>
                            <div className='enterprises_text'>
                                Los mejores aliados para tu proyecto
                            </div>
                        </div>
                        <div className='enterprises_right'>
                            <div className='enterprises_gallery'>
                                {!noEnterprises ?
                                <>
                                    {enterprises.map((enterprise) => {
                                        return(
                                            <div className='enterprises_item' key={enterprise.id}>
                                                <img src={enterprise.img_url}/>
                                            </div>
                                        );
                                    })}
                                </>
                                : <div className='home_no_items_alert'>
                                    <span>Aún no tenemos aliados en tu área.</span>
                                    <span>¡Estamos trabajando para llegar hasta ti!</span>
                                </div>}
                            </div>
                        </div>
                    </div>
                </div> */}
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
                                    <img className='our_features_img' src={require('../img/primero.png')}/>
                                </div>
                            </div>
                            <div className='our_features_item_text'>
                                <span>Optimiza tiempos al cotizar</span>
                            </div>
                        </div>
                        <div className='our_features_item'>
                            <div className='our_features_item_img'>
                                <div className='our_features_item_img_bg'>
                                    <img className='our_features_img' src={require('../img/segundo.png')}/>
                                </div>
                            </div>
                            <div className='our_features_item_text'>
                                <span>Obtén más de una sola cotización</span>
                            </div>
                        </div>
                        <div className='our_features_item'>
                            <div className='our_features_item_img'>
                                <div className='our_features_item_img_bg'>
                                    <img className='our_features_img' src={require('../img/tercero.png')}/>
                                </div>
                            </div>
                            <div className='our_features_item_text'>
                                <span>Todas las áreas de la construcción en una sola plataforma</span>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        : <LoadingScreen2/>}
        </div>
        
    );
}
