import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase/client";
import "../styles/AddServiceHome.css";
import LoadingScreen from "../components/LoadingScreen";
import { Link } from "react-router-dom";

export default function AddServiceHome(){
    let { id } = useParams();
    const navigate = useNavigate();

    const [loadingScreen, setLoadingScreen] = useState(true);
    var displayServices = [];
    const [services, setServices] = useState();
    const [locationId, setLocationId] = useState(null);
    var locationIdD;
    const [confirmInsertAlert, setConfirmInsertAlert] = useState(false);
    const [selection, setSelection] = useState(null);
    const [confirmationAlert, setConfirmationAlert] = useState(null);
    const [noItems, setNoItems] = useState(false);
  
    const checkIfAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if(user){
          const { data, error } = await supabase
          .from('account')
          .select()
          .eq('uuid', user.id);
          setLocationId(data[0].location_id);
          locationIdD = data[0].location_id;
          if(data[0].role != 'administrador'){
              window.alert("No tienes los permisos para acceder a este lugar");
              navigate("/");
          }
          if(data[0].role == 'administrador'){
            getDisplayServices();
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
    .select(`service_id`)
    .eq("location_id", locationIdD);
    if(displayServices.length < data.length){
      for(var i = 0 ; i < data.length ; i++){
        displayServices.push(data[i].service_id)
      }
    }
    console.log(displayServices);
    showServices();
  }

  const showServices = async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("category_id", id);
      for(var i = 0 ; i < displayServices.length ; i++){
        for(var j = 0 ; j < data.length ; j++){
          if(displayServices[i] == data[j].id){
            console.log("Coincide: " + data[j].id);
            data.splice(j, 1);
          }
        }
      }
      console.log(data);
      if(data){
        if(data.length == 0){
          setNoItems(true);
        }
        setServices(data);
        setLoadingScreen(false);
      }
    };
  
    useEffect(() => {
      checkIfAdmin();
    }, [loadingScreen]);

  const insertDb = async () => {
    console.log("entra");
    console.log(selection);
    const { error } = await supabase
    .from('display_services')
    .insert({ service_id: selection, location_id: locationId });
    setConfirmationAlert("Servicio agregado a la página de inicio");
    await delay(2000);
    document.location.reload();
    setConfirmInsertAlert(false);
  }

  const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );

    return(
      <div className="add_service_home_background">
        {!loadingScreen ? 
          <div className="add_service_home_gallery">
              <div className="add_service_home_container">
                {noItems ?
                  <div className="add_service_no_items_alert">No se encontraron resultados</div>
                : <>
                  <div className="add_service_home_item_names">
                      <span>Id</span>
                      <span>Creado el</span>
                      <span>Nombre</span>
                  </div>
                  {services.map((service) => {
                    return (
                        <Link onClick={(e) => setConfirmInsertAlert(true)} key={service.id} className='add_service_home_item'>
                          <div onClick={(e) => setSelection(service.id)} className='add_service_home_item_container'>
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
          <div className="add_service_to_home_background">
            <div className="add_service_to_home_container">
              <span className="add_service_to_home_text">
                  ¿Estás seguro que deseas agregar el servicio con <span>id: {selection}</span> a la pantalla de inicio?
              </span>
              <div className="add_service_to_home_submits">
                  <input
                      id="add_service_to_home_accept"
                      type={'submit'}
                      value={"Aceptar"}
                      onClick={insertDb}
                  />
                  <input
                      id="add_service_to_home_return"
                      type={'submit'}
                      value={"Regresar"}
                      onClick={(e) => setConfirmInsertAlert(false)}
                  />
              </div>
              <span id="add_service_to_home_confirmation_alert">{confirmationAlert}</span>
            </div>
          </div>
          }
      </div>
    )
  
}