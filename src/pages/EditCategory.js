import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { useNavigate, useParams } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import "../styles/Service.css";
import "../styles/EditService.css";
import "../styles/EditCategory.css";
import { Link } from "react-router-dom";

export default function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [locationId, setLocationId] = useState(null);

  const [newName, setNewName] = useState(null);

  const [newFile, setNewFile] = useState(null);

  var confirmacionesRemove = [false, false];
  
  const newUrl = [];

  const checkIfAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if(user){
      const { data, error } = await supabase
      .from('account')
      .select()
      .eq('uuid', user.id);
      setLocationId(data[0].location_id);
      console.log(data[0].location_id);
      if(data[0].role == 'administrador' || data[0].role == 'gerente'){
        showCategory();
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

  const showCategory = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id);
    setCategory(data[0]);
    setIsLoading(false);
  };

  useEffect(() => {
    checkIfAdmin();
  }, [isLoading]);

  const submitNewData = async () => {
    if(newName != null){
      const { error } = await supabase
      .from('categories')
      .update({ name: newName })
      .eq('id', id)
      window.alert('Nombre agregado correctamente');
      document.location.reload();
      return;
    }
    else{
      window.alert("Ingresa los campos a cambiar");
      return;
    }
  }

  const updateItem = async () => {
    if(newFile){
      updateDb();
      updateBucket();
    }
    else if(!newFile){
      window.alert("Favor de ingresar una imagen");
    }
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
      window.alert("Favor de ingresar una imagen");
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

  const removeItem = async () => {
    removeBucket();
    removeDb();
  }

  const removeBucket = async () => {
    console.log("Eliminando de Bucket...");
    for(var i = 0 ; i < 5 ; i++){
      const { data, error } = await supabase
      .storage
      .from('categories-img')
      .remove([`${id}`]);
      console.log(data);
      console.log(error);
    }
    confirmacionesRemove[0] = true;
    if(confirmacionesRemove[0] && confirmacionesRemove[1]){
      window.alert("Categoría eliminada correctamente");
      setAlert("Ya puedes abandonar esta página");
      navigate(`/edit-categories/${locationId}`);
    }
  }

  const removeDb = async () => {
    const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)
    console.log(error);
    confirmacionesRemove[1] = true;
    if(confirmacionesRemove[0] && confirmacionesRemove[1]){
      window.alert("Categoría eliminada correctamente");
      setAlert("Ya puedes abandonar esta página");
      navigate(`/edit-categories/${locationId}`);
    }
  }

  return (
    <>
      {!isLoading ? (
        <div className="edit_category_background">
          <div className="edit_category_display">
            <div className="edit_category_display_left">
              <div id="edit_service_cat_img">
                <img src={category.img_url[0]}/>
              </div>
            </div>
            <div className="edit_category_display_mid">
                <div className="edit_category_info">
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
            <div className="edit_category_display_right">
                <div className="edit_category_new_info">
                    <span id="edit_category_new_info_title"><bn>Nuevos datos</bn></span>
                    <span><bn>Nuevo nombre:</bn><br/>{newName}</span>
                    <input type={'submit'}
                    value={"Sobreescribir datos"}
                    onClick={submitNewData}
                    />
                </div>
            </div>
          </div>
          <div className="edit_category_selection">
            <div className="edit_category_selection_space">
              <span>Cambiar imagen de la categoría: {category.name}</span>
              <div id='edit_category_new_file'>
                Nueva imagen:
                <input
                  type={"file"}
                  accept={".png, .jpg, .jpeg"}
                  onChange={(e) => setNewFile(e.target.files)}
                />
              </div>
              <input 
                id='edit_category_submit'
                type={"submit"}
                onClick={updateItem}
                value={`Cambiar imagen`}>
              </input>
            </div>
          </div>
          <div className="edit_service_remove">
            <span>--- Zona de peligro ---</span>
            <div className="edit_service_remove_options">
              <span>Eliminar servicio</span>
              <input 
                id='edit_service_remove_input'
                type={"submit"}
                onClick={removeItem}
                value={`Eliminar: ${category.name}`}>
              </input>
              <span>{alert}</span>
            </div>
          </div>
        </div>
      ) : <LoadingScreen/>}
    </>
  );
}
