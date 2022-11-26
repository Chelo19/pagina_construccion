import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase/client";
import Service from "./Service";
import "../styles/Services.css";

export default function Services() {
  let { id } = useParams();
  const [loadingScreen, setLoadingScreen] = useState(true);
  const [services, setServices] = useState();
  const navigate = useNavigate();
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

  return (
    <div className="services_background">
      <div className="services_gallery">

        {!loadingScreen
          ? services.map((service) => {
            return (
              <div className="services_item" key={service.id} onClick={() => navigate(`/service/${service.id}`)}>
                <div className="services_img">
                  <img src={service.img_url[0]}/>
                </div>
                <div className="services_item_content">
                  <div className="services_title">
                    <h1>{service.name}</h1>
                  </div>
                  <div className="services_description">
                    <span>{service.description}</span>
                  </div>
                </div>
              </div>
              );
            })
            
            : "Cargando contenido..."}
      </div>
    </div>
    
  );
}
