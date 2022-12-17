import { useEffect, useState } from 'react';
import {supabase} from '../supabase/client';
import LoadingScreen from '../components/LoadingScreen';
import { useNavigate, useParams } from "react-router-dom";
import '../styles/EditServices.css';
import { Link } from 'react-router-dom';

export default function EditServices(){
    let { id } = useParams();
    const navigate = useNavigate();

    const [loadingScreen, setLoadingScreen] = useState(true);
    const [services, setServices] = useState();
    const [noItems, setNoItems] = useState(false);

    const checkIfAdmin = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(user){
            const { data, error } = await supabase
            .from('account')
            .select()
            .eq('uuid', user.id);
            if(data[0].role == 'administrador' || data[0].role == 'gerente'){
              showServices();
            }
            else{
                window.alert("No tienes los permisos para acceder a este lugar");
                navigate("/");
            }
        }
        else{
            window.alert("Inicia sesión como administrador para acceder");
            navigate("/login");
        }
    }

    const showServices = async () => {
        const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("category_id", id);
        setServices(data);
        setLoadingScreen(false);
    };

    useEffect(() => {
        checkIfAdmin();
        console.log(services);
    }, [loadingScreen]);

    return(
        <div className="edit_services_background">
        {!loadingScreen ? 
          <div className="edit_services_gallery">
              <div className="edit_services_container">
                {noItems ?
                  <div className="edit_services_no_items_alert">No se encontraron resultados</div>
                : <>
                  <div className="edit_services_item_names">
                      <span>Id</span>
                      <span>Creado el</span>
                      <span>Nombre</span>
                  </div>
                  {services.map((service) => {
                    return (
                        <Link to={`/edit-service/${service.id}`} key={service.id} className='edit_services_item'>
                          <div className='edit_services_item_container'>
                            <span>{service.id}</span>
                            <span>{service.created_at}</span>
                            <span>{service.name}</span>
                          </div>
                        </Link>
                      );
                  })}
                </>
                }
              </div>
          </div>
          : <LoadingScreen/>}
        </div>
    )
}