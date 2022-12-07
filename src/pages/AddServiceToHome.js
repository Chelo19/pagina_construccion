import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase/client";
import "../styles/AddServiceToHome.css";
import LoadingScreen from "../components/LoadingScreen";

export default function AddServiceToHome(){
    let { id } = useParams();
    const navigate = useNavigate();

    const [loadingScreen, setLoadingScreen] = useState(true);
    const [locationId, setLocationId] = useState(null);

    const checkIfAdmin = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(user){
            const { data, error } = await supabase
            .from('account')
            .select()
            .eq('uuid', user.id);
            if(data[0].role != 'administrador'){
                window.alert("No tienes los permisos para acceder a este lugar");
                navigate("/");
            }
            if(data[0].role == 'administrador'){
                getDb();
            }
        }
        else{
            window.alert("Inicia sesión como administrador para acceder");
            navigate("/login");
        }
    }

    const insertDb = async () => {
        const { error } = await supabase
        .from('display_services')
        .insert({ service_id: id, location_id: locationId });
        alert("Servicio agregado a la página de inicio");
        window.history.back();
    }

    const getDb = async () => {
        const { data, error } = await supabase
          .from("services")
          .select("location_id")
          .eq("id", id);
        setLocationId(data[0].location_id);
        setLoadingScreen(false);
      };
    
      useEffect(() => {
        checkIfAdmin();
      }, [loadingScreen]);

      const goBack = async () => {
        window.history.back();
      }

    return(
        <div className="add_service_to_home_background">
            {!loadingScreen ?
                <div className="add_service_to_home_container">
                    <div className="add_service_to_home_text">
                        ¿Estás seguro que deseas agregar el servicio con <span>id: {id}</span> a la pantalla de inicio?
                    </div>
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
                            onClick={goBack}
                        />
                    </div>
                </div>
            : <LoadingScreen/>}
        </div>
    )
}