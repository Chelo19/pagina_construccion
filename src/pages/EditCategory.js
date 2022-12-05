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

  const [newFile, setNewFile] = useState(null);
  
  const newUrl = [];

  const showCategory = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id);
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

  const updateItem = async () => {
    updateDb();
    updateBucket();
  }

  const updateBucket = async () => {
    const { data, error } = await supabase
    .storage
    .from('categories-img')
    .update(`${category.id}`, newFile[0], {
      cacheControl: '3600',
      upsert: false
    })
    document.location.reload();
  }

  const uploadBucket = async () => {
    if(newFile != null){
      const { data, error } = await supabase
      .storage
      .from('categories-img')
      .upload(`${category.id}`, newFile[0]);
      document.location.reload();
    }
    else{
      alert("Favor de ingresar una imagen");
    }
  }

  const updateDb = async () => {
    console.log("Obteniendo PublicURL");
    const { data } = supabase
    .storage
    .from('categories-img')
    .getPublicUrl(`${category.id}`);
    console.log(data.publicUrl.toString());

    newUrl.push(data.publicUrl.toString());

    console.log("Actualizando DB...");
    const { error } = await supabase
    .from('categories')
    .update({ img_url: newUrl })
    .eq('id', id);
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
          <div className="edit_service_selection">
            <div className="edit_service_selection_space">
              <span>Cambiar imagen de la categoría: {category.name}</span>
              <div id='edit_service_new_file'>
                Nueva imagen:
                <input
                  type={"file"}
                  accept={".png, .jpg, .jpeg"}
                  onChange={(e) => setNewFile(e.target.files)}
                />
              </div>
              <input 
                id='edit_enterprises_submit'
                type={"submit"}
                onClick={updateItem}
                value={`Cambiar imagen`}>
              </input>
            </div>
          </div>
        </div>
      ) : <LoadingScreen/>}
    </>
  );
}
