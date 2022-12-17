import LoadingScreen from "../components/LoadingScreen";
import { supabase } from "../supabase/client";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/RemoveServiceHome.css";


export default function RemoveServiceHome(){
    let { id } = useParams();
    const navigate = useNavigate();
    
    const [loadingScreen, setLoadingScreen] = useState(true);
    var displayServices = [];
    const [services, setServices] = useState();
    const [selection, setSelection] = useState(null);
    const [confirmInsertAlert, setConfirmInsertAlert] = useState(false);
    const [confirmationAlert, setConfirmationAlert] = useState(null);
    const [noItems, setNoItems] = useState(false);

    const checkIfAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if(user){
        const { data, error } = await supabase
        .from('account')
        .select()
        .eq('uuid', user.id);
        if(data[0].role == 'administrador' || data[0].role == 'gerente'){
          getDisplayServices();
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
    
    const getDisplayServices = async () => {
      const { data, error } = await supabase
      .from('display_services')
      .select(`service_id, services (*) `)
      .eq("location_id", id);
      if(displayServices.length < data.length){
        for(var i = 0 ; i < data.length ; i++){
            displayServices.push(data[i].services);
        }
      }
      if(displayServices.length == data.length){
        if(data.length == 0){
          setNoItems(true);
        }
        setServices(displayServices);
        console.log(displayServices);
        setLoadingScreen(false);
      }
    }

    useEffect(() => {
      checkIfAdmin();
    }, [loadingScreen]);

    const removeDb = async () => {
      console.log(selection);
      const { error } = await supabase
      .from('display_services')
      .delete()
      .eq('service_id', selection);
      setConfirmationAlert("Servicio eliminado de la página de inicio");
      await delay(2000);
      document.location.reload();
      setConfirmInsertAlert(false);
    }

    const delay = ms => new Promise(
      resolve => setTimeout(resolve, ms)
    );

    return(
        <div className="remove_service_home_background">
        {!loadingScreen ? 
          <div className="remove_service_home_gallery">
              <div className="remove_service_home_container">
                {noItems ?
                  <div className="remove_service_no_items_alert">No se encontraron resultados</div>
                : <>
                  <div className="remove_service_home_item_names">
                      <span>Id</span>
                      <span>Creado el</span>
                      <span>Nombre</span>
                  </div>
                  {services.map((service) => {
                    return (
                        <Link onClick={(e) => setConfirmInsertAlert(true)} key={service.id} className='remove_service_home_item'>
                          <div onClick={(e) => setSelection(service.id)} className='remove_service_home_item_container'>
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
          {confirmInsertAlert &&
          <div className="remove_service_to_home_background">
            <div className="remove_service_to_home_container">
              <span className="remove_service_to_home_text">
                  ¿Estás seguro que deseas quitar el servicio con <span>id: {selection}</span> de la pantalla de inicio?
              </span>
              <div className="remove_service_to_home_submits">
                  <input
                      id="remove_service_to_home_accept"
                      type={'submit'}
                      value={"Aceptar"}
                      onClick={removeDb}
                  />
                  <input
                      id="remove_service_to_home_return"
                      type={'submit'}
                      value={"Regresar"}
                      onClick={(e) => setConfirmInsertAlert(false)}
                  />
              </div>
              <span id="remove_service_to_home_confirmation_alert">{confirmationAlert}</span>
            </div>
          </div>
          }
      </div>
    )
}