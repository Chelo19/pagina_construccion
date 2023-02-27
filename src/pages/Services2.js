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
    const [noItems, setNoItems] = useState(false);

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
        if(data.length > 0){
            setIsLoading(false);
        }
        else{
            setNoItems(true);
            setIsLoading(false);
        }
    };
  
    return(
        <>
            {!isLoading ?
                <div className="services_background">
                    <div className="services_container">
                        {!noItems ?
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
                                                    <Link to={`/service2/${service.id}`} className="gallery_item_button">Ver más</Link>
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        :
                        <div className='no_items_background'>
                            <div className='no_items_container'>
                                <div className='no_items_img'>
                                    <img src={require('../img/financiamiento.png')}/>
                                </div>
                                <div className='no_items_spans'>
                                    <span className='no_items_span_title'>Aún no existen servicios en esta categoría</span>
                                    <span className='no_items_span_text'>Puedes explorar nuestros diferentes servicios dando click <Link to={'/categories2'}>aquí</Link></span>
                                </div>
                            </div>
                        </div>}
                    </div>
                </div>
                :
                <LoadingScreen2/>
            }
        </>
    );
}
