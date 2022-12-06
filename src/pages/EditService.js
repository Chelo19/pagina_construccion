import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { useParams } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import "../styles/EditService.css";
import { Link } from "react-router-dom";

export default function EditService() {
  const { id } = useParams();

  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [newName, setNewName] = useState(null);
  const [newDescription, setNewDescription] = useState(null);

  const [selection, setSelection] = useState(null);
  const [newFile, setNewFile] = useState(null);

  const newUrl = [];

  const showService = async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("id", id);
    setService(data[0]);
    setIsLoading(false);
  };

  useEffect(() => {
    showService();
  }, [isLoading]);

  const submitNewData = async () => {
    if(newName != null && newDescription != null){
      const { error } = await supabase
      .from('services')
      .update({ name: newName, description: newDescription })
      .eq('id', id)
      alert('Nombre y descripción agregados correctamente');
      document.location.reload();
      return;
    }
    if(newDescription == null){
      sumbitOnlyName();
      alert('Nombre agregado correctamente');
      document.location.reload();
      return;
    }
    if(newName == null){
      sumbitOnlyDescription();
      alert('Descripción agregada correctamente');
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
    updateBucket();
    updateDb();
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
  }

  const removeDb = async () => {
    const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id)
    console.log(error);
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
                value={`Cambiar imagen de: ${selection}`}>
              </input>
            </div>
          </div>
          <div className="edit_service_remove">
            <span>Recuerda esperar alrededor de 15 segundos antes de abandonar esta página</span>
            <input 
              id='edit_service_remove_input'
              type={"submit"}
              onClick={removeItem}
              value={`Eliminar: ${id}`}>
            </input>
          </div>
        </div>
      ) : <LoadingScreen/>}
    </>
  );
}
