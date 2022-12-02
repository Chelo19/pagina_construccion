import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { useParams } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import "../styles/Service.css";
import "../styles/EditService.css";
import { Link } from "react-router-dom";

export default function EditService() {
  const { id } = useParams();

  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [newName, setNewName] = useState(null);
  const [newDescription, setNewDescription] = useState(null);

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

  const submitNewData = async () => {
    alert('Datos agregados newName: ' + newName + " newDescription: " + newDescription);
    
  }

  return (
    <>
      {!isLoading ? (
        <div className="edit_service_service_background">
          <div className="edit_service_service_display">
            <div className="edit_service_service_display_left">
              <div className="edit_service_service_gallery">
                {console.log(service.img_url)}
                <div id="edit_service_main_service_img" className="edit_service_service_img">
                  <img src={service.img_url[0]}/>
                </div>
                <div id="edit_service_first_service_img" className="edit_service_service_img">
                  <img src={service.img_url[1]}/>1
                </div>
                <div id="edit_service_second_service_img" className="edit_service_service_img">
                  <img src={service.img_url[2]}/>2
                </div>
                <div id="edit_service_third_service_img" className="edit_service_service_img">
                  <img src={service.img_url[3]}/>3
                </div>
                <div id="edit_service_fourth_service_img" className="edit_service_service_img">
                  <img src={service.img_url[4]}/>4
                </div>
              </div>
            </div>
            <div className="edit_service_service_display_mid">
                <div className="edit_service_service_info">
                    <span>
                        <bn>Id: </bn>{service.id}
                    </span>
                    <span>
                        <bn>Id categoría: </bn>{service.category_id}
                    </span>
                    <span>
                        <bn>Nombre actual:</bn><br/>{service.name}
                    </span>
                    <span>
                        <bn>Nuevo nombre:</bn><br/>
                        <input type={'text'}
                        placeholder={'Nuevo nombre'}
                        onChange={(e) => setNewName(e.target.value)}/>
                    </span>
                    <span>
                        <bn>Descripción actual:</bn><br/>{service.description}
                    </span>
                    <span>
                        <bn>Nueva descripción:</bn><br/>
                        <input type={'text'}
                        placeholder={'Nueva descripción'}
                        onChange={(e) => setNewDescription(e.target.value)}/>
                    </span>
                </div>
            </div>
            <div className="edit_service_service_display_right">
                <div className="edit_service_new_info">
                    <span id="edit_service_new_info_title"><bn>Nuevos datos</bn></span>
                    <span><bn>Nuevo nombre:</bn><br/>{newName}</span>
                    <span><bn>Nueva descripción:</bn><br/>{newDescription}</span>
                    <input type={'submit'}
                    value={"Sobreescribir datos"}
                    onClick={submitNewData}
                    />
                </div>
            </div>
          </div>
        </div>
      ) : <LoadingScreen/>}
    </>
  );
}
