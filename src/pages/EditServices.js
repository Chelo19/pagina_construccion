import { useEffect, useState } from 'react';
import {supabase} from '../supabase/client';
import LoadingScreen from '../components/LoadingScreen';
import { useNavigate, useParams } from "react-router-dom";
import '../styles/EditServices.css';
import { Link } from 'react-router-dom';

export default function EditServices(){
    let { id } = useParams();

    const [loadingScreen, setLoadingScreen] = useState(true);
    const [services, setServices] = useState();

    const navigate = useNavigate();

    const showServices = async () => {
        const { data, error } = await supabase
        .from("services")
        .select("*");
        setServices(data);
        setLoadingScreen(false);
    };

    useEffect(() => {
        showServices();
        console.log(services);
    }, [loadingScreen]);

    return(
    <div className="edit_services_services_background">
        <div className="edit_services_services_gallery">
            {!loadingScreen
              ? services.map((service) => {
                return (
                    <Link to={`/edit-service/${service.id}`} style={{ color: 'inherit', textDecoration: 'inherit'}} className="edit_services_services_item">
                        <div className="edit_services_services_img">
                            <img src={service.img_url[0]}/>
                        </div>
                        <div className="edit_services_services_item_content">
                            <div className="edit_services_services_title">
                                <h1>{service.name}</h1>
                            </div>
                            <div className="edit_services_services_id">
                                <span>id categoría: <b>{service.category_id}</b></span>
                            </div>
                            <div className="edit_services_services_id">
                                <span>id servicio: <b>{service.id}</b></span>
                            </div>
                        </div>
                    </Link>
                  );
                })
                : <LoadingScreen/>}
        </div>
      </div>
    )
}