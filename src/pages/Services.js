import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase/client";
import "../styles/Services.css";
import LoadingScreen from "../components/LoadingScreen";
import { Link } from "react-router-dom";

export default function Services() {
  let { id } = useParams();

  const [loadingScreen, setLoadingScreen] = useState(true);
  const [services, setServices] = useState();

  const navigate = useNavigate();

  const showServices = async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("category_id", id)
      .not('img_url', 'is', null);
      console.log(data);
    setServices(data);
    setLoadingScreen(false);
  };

  useEffect(() => {
    showServices();
    console.log(services);
  }, [loadingScreen]);

  return (
    <div className="services_background">
      {!loadingScreen ?
      <div className="services_container">
        <span className="services_title">Nuestros servicios</span>
        <div className="services_gallery">
          {services.map((service) => {
            return(
              <Link to={`/service/${service.id}`} className="services_item" key={service.id}>
                <img src={service.img_url[0]}/>
                <div className="services_item_title">
                  <span>{service.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      : <LoadingScreen/>}
    </div>
  );
}
