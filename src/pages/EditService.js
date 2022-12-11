import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { useNavigate, useParams } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import "../styles/EditService.css";
import { Link } from "react-router-dom";

export default function EditService() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const [newName, setNewName] = useState(null);
  const [newDescription, setNewDescription] = useState(null);

  const [selection, setSelection] = useState(null);
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
        if(data[0].role != 'administrador'){
          window.alert("No tienes los permisos para acceder a este lugar");
          navigate("/");
        }
        if(data[0].role == 'administrador'){
          showService();
        }
    }
    else{
        window.alert("Inicia sesión como administrador para acceder");
        navigate("/login");
    }
  }

  const showService = async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("id", id);
    setService(data[0]);
    setIsLoading(false);
  };

  useEffect(() => {
    checkIfAdmin();
  }, [isLoading]);

  const submitNewData = async () => {
    if(newName != null && newDescription != null){
      const { error } = await supabase
      .from('services')
      .update({ name: newName, description: newDescription })
      .eq('id', id)
      window.alert('Nombre y descripción agregados correctamente');
      document.location.reload();
      return;
    }
    else if(!newName && !newDescription){
      window.alert("Ingresa los campos a cambiar");
      return;
    }
    if(newDescription == null){
      sumbitOnlyName();
      window.alert('Nombre agregado correctamente');
      document.location.reload();
      return;
    }
    if(newName == null){
      sumbitOnlyDescription();
      window.alert('Descripción agregada correctamente');
      document.location.reload();
      return;
    }
  }

  const sumbitOnlyName = async () => {
    const { error } = await supabase
    .from('services')
    .update({ name: newName })
    .eq('id', id)
  }

  const sumbitOnlyDescription = async () => {
    const { error } = await supabase
    .from('services')
    .update({ description: newDescription })
    .eq('id', id)
  }

  const uploadItem = async () => {
    if(newFile){
      updateBucket();
      updateDb();
    }
    else if(!newFile){
      window.alert("Favor de ingresar una imagen");
    }
  }

  const updateBucket = async () => {
    const { data, error } = await supabase
    .storage
    .from('services-img')
    .update(`${service.category_id}` + '/' + `${service.id}` + '-' + `${selection}`, newFile[0], {
      cacheControl: '3600',
      upsert: false
    })
    document.location.reload();
  }


  const uploadBucket = async () => {
    if(newFile != null){
        console.log("Subiendo a Bucket...");
        const { data, error } = await supabase
        .storage
        .from('services-img')
        .upload(`${service.category_id}` + '/' + `${service.id}` + '-' + `${selection}`, newFile[0]);
        console.log('Route: ' + `${service.category_id}` + '/' + `${service.id}` + '-' + `${selection}`);
        console.log("Sale de UploadBucket");
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
    .from('services-img')
    .getPublicUrl(`${service.category_id}` + '/' + `${service.id}` + '-');

    for(var i = 0 ; i < 5 ; i++){
      newUrl.push(data.publicUrl.toString() + `${i}`);
    }

    console.log("Actualizando DB...");
    const { error } = await supabase
    .from('services')
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
      .from('services-img')
      .remove([`${service.category_id}` + '/' + `${service.id}` + `-${i}`])
      console.log(data);
      console.log(error);
    }
    confirmacionesRemove[0] = true;
    if(confirmacionesRemove[0] && confirmacionesRemove[1]){
      window.alert("Categoría eliminada correctamente");
      navigate(`/admin-hub/`);
    }
  }

  const removeDb = async () => {
    const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id)
    console.log(error);
    confirmacionesRemove[1] = true;
    if(confirmacionesRemove[0] && confirmacionesRemove[1]){
      window.alert("Categoría eliminada correctamente");
      setAlert("Ya puedes abandonar esta página");
      navigate(`/admin-hub/`);
    }
  }

  return (
    <>
      {!isLoading ? (
        <div className="edit_service_service_background">
          <div className="edit_service_service_display">
            <div className="edit_service_service_display_left">
              <div className="edit_service_service_gallery">
                <div id="edit_service_main_service_img" className="edit_service_service_img" onClick={(e) => setSelection(0)}>
                  <img src={service.img_url[0]}/>
                  <span>0</span>
                </div>
                <div id="edit_service_first_service_img" className="edit_service_service_img" onClick={(e) => setSelection(1)}>
                  <img src={service.img_url[1]}/>
                  <span>1</span>
                </div>
                <div id="edit_service_second_service_img" className="edit_service_service_img" onClick={(e) => setSelection(2)}>
                  <img src={service.img_url[2]}/>
                  <span>2</span>
                </div>
                <div id="edit_service_third_service_img" className="edit_service_service_img" onClick={(e) => setSelection(3)}>
                  <img src={service.img_url[3]}/>
                  <span>3</span>
                </div>
                <div id="edit_service_fourth_service_img" className="edit_service_service_img" onClick={(e) => setSelection(4)}>
                  <img src={service.img_url[4]}/>
                  <span>4</span>
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
          <div className="edit_service_selection">
            <div className="edit_service_selection_space">
              <span>Imagen a cambiar: {selection}</span>
              <div id='edit_service_new_file'>
                Nueva imagen:
                <input
                  type={"file"}
                  accept={".png, .jpg, .jpeg"}
                  onChange={(e) => setNewFile(e.target.files)}
                />
              </div>
              <input 
                id='edit_service_submit'
                type={"submit"}
                onClick={uploadItem}
                value={`Cambiar imagen: ${selection}`}>
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
                value={`Eliminar: ${service.name}`}>
              </input>
              <span>{alert}</span>
            </div>
          </div>
        </div>
      ) : <LoadingScreen/>}
    </>
  );
}
