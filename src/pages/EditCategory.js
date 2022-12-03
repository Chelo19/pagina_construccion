import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { useParams } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import "../styles/Service.css";
import "../styles/EditService.css";
import { Link } from "react-router-dom";

export default function EditCategory() {
  const { id } = useParams();

  const [category, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [newName, setNewName] = useState(null);

  const showCategory = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id);
    console.log(data);
    setCategory(data[0]);
    setIsLoading(false);
  };

  useEffect(() => {
    showCategory();
  }, [isLoading]);

  const submitNewData = async () => {
    if(newName != null){
      const { error } = await supabase
      .from('categories')
      .update({ name: newName })
      .eq('id', id)
      alert('Nombre y descripción agregados correctamente');
      document.location.reload();
      return;
    }
  }


  return (
    <>
      {!isLoading ? (
        <div className="edit_service_service_background">
          <div className="edit_service_service_display">
            <div className="edit_service_service_display_left">
              <div className="edit_service_service_gallery">
                <div id="edit_service_main_service_img" className="edit_service_service_img">
                  <img src={category.img_url[0]}/>
                </div>
              </div>
            </div>
            <div className="edit_service_service_display_mid">
                <div className="edit_service_service_info">
                    <span>
                        <bn>Id: </bn>{category.id}
                    </span>
                    <span>
                        <bn>Nombre actual:</bn><br/>{category.name}
                    </span>
                    <span>
                        <bn>Nuevo nombre:</bn><br/>
                        <input type={'text'}
                        placeholder={'Nuevo nombre'}
                        onChange={(e) => setNewName(e.target.value)}/>
                    </span>
                </div>
            </div>
            <div className="edit_service_service_display_right">
                <div className="edit_service_new_info">
                    <span id="edit_service_new_info_title"><bn>Nuevos datos</bn></span>
                    <span><bn>Nuevo nombre:</bn><br/>{newName}</span>
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
