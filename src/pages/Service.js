import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import "../styles/Service.css";
import { useParams } from "react-router-dom";

export default function Service(props) {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const showService = async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("id", id);
    console.log(data);
    setService(data[0]);
    setIsLoading(false);
  };

  useEffect(() => {
    showService();
  }, [isLoading]);

  return (
    <>
      {!isLoading ? (
        <div className="service_background">
          <div className="service_display">
            <div className="service_display_left">
              <div className="service_gallery">
                {console.log(service.img_url)}
                <div id="main_service_img" className="service_img">
                  <img src={service.img_url[0]} />
                </div>
                <div id="first_service_img" className="service_img">
                  <img src={service.img_url[1]} />
                </div>
                <div id="second_service_img" className="service_img">
                  <img src={service.img_url[2]} />
                </div>
                <div id="third_service_img" className="service_img">
                  <img src={service.img_url[3]} />
                </div>
                <div id="fourth_service_img" className="service_img">
                  <img src={service.img_url[4]} />
                </div>
              </div>
            </div>
            <div className="service_display_right">
              <div className="service_info">
                <h2>{service.name}</h2>
                <br />
                <span>{service.description}</span>
                <br />
                <div className="service_info_cotizar">
                  <a Link to="/service/" >Cotizar servicio con un socio</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        "Cargando contenido..."
      )}
    </>
  );
}
