import {useEffect, useState, useRef} from 'react';
import {supabase} from '../supabase/client';
import UserArea from '../components/UserArea';
import RemoveFromDB from '../components/RemoveFromDB';
import AddToDB from '../components/AddToDB';
import { useNavigate, useParams } from "react-router-dom";
import '../styles/Home.css';
import { AuthRedirect } from '../hooks/authUser';
import LoadingScreen from '../components/LoadingScreen';
import { Link } from 'react-router-dom';


export default function Home(){
    const [loadingScreen, setLoadingScreen] = useState(true);
    const [enterprises, setEnterprises] = useState(null);
    const [noEnterprises, setNoEnterprises] = useState(false);
    const [servicesForDisplay, setServicesForDisplay] = useState(null);
    const [noServicesForDisplay, setNoServicesForDisplay] = useState(false);
    const [locationId, setLocationId] = useState(1);
    var confirmaciones = [false, false];
    const navigate = useNavigate();
    var locationName;
    var displayServicesSel = [];
    const projects = useRef(null);
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
    }

    useEffect(() => {
        console.log(servicesForDisplay);
    })
    
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
            setNoEnterprises(true);
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
            setNoServicesForDisplay(true);
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

    const executeScroll = () => {
        projects.current.scrollIntoView()   
    }

    const fetchGeoLocation = async () => {
        let url = 'https://ipinfo.io/json?token=f4a64dfc914585';
        let response = await fetch(url);
        let data = await response.json();
        console.log(data);
    }

    return(
        <div className='home_background'>
            {!loadingScreen
            ? <>
                <div className='background_img'>
                    <div className='background_img_container'>
                        <div className='background_img_separator'>
                            <span id='background_img_title'>DREC</span>
                            <span id='background_img_eslogan'><i>"La construcción que debes tener"</i></span>
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
                    <Link to={`/categories/${locationId}`} style={{textDecoration: 'inherit'}} className='our_projects_presentation_text'>
                        SERVICIOS
                    </Link>
                </div>
                <div className='our_projects'>
                    {!noServicesForDisplay ?
                        <>
                            <div className="categories_cards_container_home">
                            {servicesForDisplay.map((displayService) => {
                                return(
                                <Link to={`/service/${displayService.id}`} className="categories_card" key={displayService.id}>
                                    <img src={displayService.img_url[0]}/>
                                    <div className="categories_card__head_home">
                                    <span>{displayService.name}</span>
                                    </div>
                                </Link>
                                )
                            })}
                            </div>
                            <Link to={`/categories/${locationId}`} style={{textDecoration: 'inherit'}} class='our_projects_button'>
                                    <span>Ver más</span>
                                    <div class='our_projects_button_img'>
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
                <div className='enterprises'>
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
