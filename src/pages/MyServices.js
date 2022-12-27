import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {supabase} from '../supabase/client';
import '../styles/MyServices.css';
import { Link } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';

export default function MyServices(){

    const navigate = useNavigate();
    const [loadingScreen, setLoadingScreen] = useState(true);

    const [services , setServices] = useState(null);
    const [serviceSelection, setServiceSelection] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [inService, setInService] = useState(false);
    const [serviceImgUrl, setServiceImgUrl] = useState(null);
    const [containerStyle, setContainerStyle] = useState(null);
    const [itemsStyle, setItemsStyle] = useState(null);
    const [noItems, setNoItems] = useState(false);

    useEffect(() => {
        getClientServices();
    }, [loadingScreen]);

    const getClientServices = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(!user) navigate('/Login');
        const { data, error } = await supabase
        .from('my_services')
        .select()
        .eq('user_uuid', user.id);
        if(data.length > 0){
            setServices(data);
            console.log(data);
        }
        else{
            setNoItems(true);
        }
        setLoadingScreen(false);
    };

    const selectService = async (selection) => {
        setServiceSelection(selection);
        var res = services.filter(service => {
            return service.id === selection
        })
        setSelectedService(res);
        setServiceImgUrl(res[0].img_url)
        setInService(true);
        setItemsStyle({ "display": "none" });
        setContainerStyle({ "display": "flex" });
    }

    const deselectService = async () => {
        setInService(false); 
        setItemsStyle({ "display": "flex" });
        setContainerStyle(null);
    }

    return(
        <div className='my_services_background'>
            {!loadingScreen ?
            <div className='my_services_container'>
                <div className='my_services_container_left'>
                    <div className='my_services_sidebar_container'>

                    </div>
                </div>
                <div className='my_services_container_right'>
                    {!noItems ? 
                        <div className='my_services_services_container' style={containerStyle}>
                            {services.map((service) => {
                                return(
                                    <Link onClick={(e) => selectService(service.id)} key={service.id} className='my_services_service' style={itemsStyle}>
                                        <div className='my_services_title'>
                                            <span>
                                                {service.name}
                                            </span>
                                            <span id='my_services_date'>
                                                {service.created_at[8]+service.created_at[9]}
                                                {service.created_at[4]+service.created_at[5]+service.created_at[6]+service.created_at[7]}
                                                {service.created_at[2]+service.created_at[3]}
                                            </span>
                                        </div>
                                        <div className='my_services_img'>
                                            <img src={service.img_url[0]}/>
                                        </div>
                                    </Link>
                                )
                            })}
                            {inService &&
                                <div className='my_services_in_service'>
                                    <div className='my_services_in_service_container'>
                                        <div className='my_services_in_service_title'>
                                            <span>
                                                {selectedService[0].name}
                                            </span>
                                        </div>
                                        <Link className='my_services_in_service_return_button' onClick={(e) => deselectService()}>
                                            <img src={require('../img/flecha.png')}/>
                                        </Link>
                                        <div className='my_services_in_service_description'>
                                            <span>
                                                Fecha:&nbsp;
                                                {selectedService[0].created_at[8]+selectedService[0].created_at[9]}
                                                {selectedService[0].created_at[4]+selectedService[0].created_at[5]+selectedService[0].created_at[6]+selectedService[0].created_at[7]}
                                                {selectedService[0].created_at[2]+selectedService[0].created_at[3]}
                                            </span>
                                            <span>
                                                {selectedService[0].description}
                                            </span>
                                        </div>
                                        <div className='my_services_in_service_img'>
                                            {serviceImgUrl.map((serviceImg) => {
                                                return(
                                                    <div key={serviceImg} className='my_services_in_service_img_individual_img'>
                                                        <img src={serviceImg}/>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    :   <div className='my_services_no_items'>
                            <span>No tienes ningún servicio activo aún</span>
                            <Link to={"/account/"} className='my_services_no_items_back'>
                                <span>
                                    Regresar
                                </span>
                                <div className='my_services_no_items_back_arrow'>
                                    <img src={require('../img/flecha.png')}/>
                                </div>
                            </Link>
                        </div>}
                </div>
            </div>
            : <LoadingScreen/>}
        </div>
    )
}