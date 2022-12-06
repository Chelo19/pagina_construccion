import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase/client";
import "../styles/AddServiceHome.css";
import LoadingScreen from "../components/LoadingScreen";
import { Link } from "react-router-dom";


export default function AddServiceHome(){
    let { id } = useParams();

    const [loadingScreen, setLoadingScreen] = useState(true);
    const [services, setServices] = useState();
  
    const showServices = async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("category_id", id);
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
                    <Link to={`/add-service-to-home/${service.id}`} style={{ color: 'inherit', textDecoration: 'inherit'}} className="edit_services_services_item">
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