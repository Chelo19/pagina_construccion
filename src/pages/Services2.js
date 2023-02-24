import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase/client";
import "../styles/Services2.css";
import "../styles/Gallery.css";
import LoadingScreen2 from "../components/LoadingScreen2";
import { Link } from "react-router-dom";

export default function Services2() {
    let { id } = useParams();

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    const [services, setServices] = useState();

    useEffect(() => {
        showServices();
    }, []);

    const showServices = async () => {
        const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("category_id", id)
        .not('img_url', 'is', null);
        setServices(data);
        console.log(data);
        if(data){
            setIsLoading(false);
        }
    };
  
    return(
        <>
            {!isLoading ?
                <div className="services_background">
                    <div className="services_container">
                        <div className="gallery">
                            {services.map((service) => {
                                return(
                                    <Link to={`/service/${service.id}`} className="gallery_item">
                                        <div className="gallery_item_img">
                                            <img src={`${service.img_url[0]}`}/>
                                        </div>
                                        <div className="gallery_item_content">
                                            <span className="gallery_item_content_title">{service.name}</span>
                                            <span className="gallery_item_content_description">{service.description}</span>
                                            <div className="gallery_item_buttons">
                                                <Link to={`/service/${service.id}`} className="gallery_item_button">Ver más</Link>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </div>
                :
                <LoadingScreen2/>
            }
        </>
    );
}
