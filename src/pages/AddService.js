import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase/client";
import "../styles/AddService.css";
import LoadingScreen from "../components/LoadingScreen";
import { Link } from "react-router-dom";
import {AdminComprobation} from "../components/AdminComprobation";

export default function AddService(){
    const { id } = useParams();
    const navigate = useNavigate();

    const [loadingScreen, setLoadingScreen] = useState(true);
    const [newName, setNewName] = useState(null);
    const [newDescription, setNewDescription] = useState(null);
    const [newFile0, setNewFile0] = useState(null);
    const [newFile1, setNewFile1] = useState(null);
    const [newFile2, setNewFile2] = useState(null);
    const [newFile3, setNewFile3] = useState(null);
    const [newFile4, setNewFile4] = useState(null);
    const [correctAlert, setCorrectAlert] = useState(null);
    var serviceId;
    const newUrl = [];
    var publicUrl;
    var locationId;

    useEffect(() => {
        checkIfAdmin();
    }, [loadingScreen])

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
                setLoadingScreen(false);
            }
        }
        else if(!user){
            window.alert("Inicia sesión como administrador para acceder");
            navigate("/login");
        }
    }

    const createItem = async () => {
        if(newName != null && newFile0 != null && newFile1 != null && newFile2 != null && newFile3 != null && newFile4 != null){
            setCorrectAlert('Espera un momento en lo que se crea el servicio');
            getCategoryLocationId();
            insertDb();
            comprobation();
        }
        else{
            window.alert("Favor de ingresar todos los campos");
        }
    }
    
    const insertDb = async () => {
        const { error } = await supabase
        .from('services')
        .insert({ name: newName, description: newDescription, category_id: id })
    }

    const getCategoryLocationId = async () => {
        const { data, error } = await supabase
        .from('categories')
        .select("location_id")
        .eq("id", id);
        locationId = data[0].location_id;
        if(locationId == undefined){
            getCategoryLocationId();
        }
    }

    const comprobation = async () => {
        const { data, error } = await supabase
        .from('services')
        .select('*')
        .match({ category_id: id, name: newName, description: newDescription });
        if(data.length >= 2){
            window.alert("Ya existe un servicio igual");
        }
        else{
            getItem();
        }
    }

    const getItem = async () => {
        const { data, error } = await supabase
        .from('services')
        .select()
        .match({ category_id: id, name: newName, description: newDescription });
        if(data[0])
        console.log(data[0]);
        console.log(data[0].id);
        serviceId = data[0].id;
        if(newFile0 != null && newFile1 != null && newFile2 != null && newFile3 != null && newFile4 != null){
            uploadBuckets();
        }
    }

    const uploadBuckets = async () => {
        uploadBucket0();
        uploadBucket1();
        uploadBucket2();
        uploadBucket3();
        uploadBucket4();
        insertPublicUrl();
    }

    const uploadBucket0 = async () => {
        const { data, error } = await supabase
        .storage
        .from('services-img')
        .upload('/' + `${id}` + '/' + `${serviceId}` + '-0', newFile0[0]);
        console.log(data);
        getPublicUrl();
    }

    const uploadBucket1 = async () => {
        const { data, error } = await supabase
        .storage
        .from('services-img')
        .upload('/' + `${id}` + '/' + `${serviceId}` + '-1', newFile1[0]);
        console.log(data);
    }

    const uploadBucket2 = async () => {
        const { data, error } = await supabase
        .storage
        .from('services-img')
        .upload('/' + `${id}` + '/' + `${serviceId}` + '-2', newFile2[0]);
        console.log(data);
    }

    const uploadBucket3 = async () => {
        const { data, error } = await supabase
        .storage
        .from('services-img')
        .upload('/' + `${id}` + '/' + `${serviceId}` + '-3', newFile3[0]);
        console.log(data);
    }

    const uploadBucket4 = async () => {
        const { data, error } = await supabase
        .storage
        .from('services-img')
        .upload('/' + `${id}` + '/' + `${serviceId}` + '-4', newFile4[0]);
        console.log(data);
    }
    
    const getPublicUrl = async () => {
        const { data } = supabase
        .storage
        .from('services-img')
        .getPublicUrl('/' + `${id}` + '/' + `${serviceId}`);
        publicUrl = data.publicUrl.toString();
        for(var i = 0 ; i < 5 ; i++){
            newUrl.push(publicUrl + `-${i}`)
        }
    }

    const insertPublicUrl = async () => {
        console.log(newUrl);
        if(newUrl.length == 5){
            const { error } = await supabase
            .from('services')
            .update({ img_url: newUrl, location_id: locationId })
            .eq('id', serviceId);
            window.alert("Servicio agregado correctamente");
            document.location.reload();
        }
        else{
            console.log("Aun no se llena");
            await delay(2000);
            insertPublicUrl();
        }
    }

    const delay = ms => new Promise(
        resolve => setTimeout(resolve, ms)
    );

    return(
        <div className="add_service_background">
            {!loadingScreen ?
                <div className="add_service_container">
                    <div className="add_service_texts">
                        <span className="add_service_instructions">Nombre</span>
                        <input
                        id={'add_service_text_input'}
                        type={'text'}
                        placeholder={'Nombre del nuevo servicio'}
                        onChange={(e) => setNewName(e.target.value)}
                        />
                        <span className="add_service_instructions">Descripción</span>
                        <textarea
                        className="add_service_textarea"
                        rows={20}
                        placeholder={'Descripción del nuevo servicio'}
                        onChange={(e) => setNewDescription(e.target.value)}
                        />
                    </div>
                    <div className="add_service_imgs">
                        <div className="add_service_imgs_container">
                            <span id="add_service_reminder">La relación de aspecto ideal para la imagen es de 4:3</span>
                            <div className="add_service_img_inputs">
                                <div className="add_service_imgs_containers">
                                    Primera imagen:&nbsp;
                                    <input
                                    type={"file"}
                                    accept={".png, .jpg, .jpeg"}
                                    onChange={(e) => setNewFile0(e.target.files)}
                                    />
                                </div>
                                <div className="add_service_imgs_containers">
                                    Segunda imagen:&nbsp;
                                    <input
                                    type={"file"}
                                    accept={".png, .jpg, .jpeg"}
                                    onChange={(e) => setNewFile1(e.target.files)}
                                    />
                                </div>
                                <div className="add_service_imgs_containers">
                                    Tercera imagen:&nbsp;
                                    <input
                                    type={"file"}
                                    accept={".png, .jpg, .jpeg"}
                                    onChange={(e) => setNewFile2(e.target.files)}
                                    />
                                </div>
                                <div className="add_service_imgs_containers">
                                    Cuarta imagen:&nbsp;
                                    <input
                                    type={"file"}
                                    accept={".png, .jpg, .jpeg"}
                                    onChange={(e) => setNewFile3(e.target.files)}
                                    />
                                </div>
                                <div className="add_service_imgs_containers">
                                    Quinta imagen:&nbsp;
                                    <input
                                    type={"file"}
                                    accept={".png, .jpg, .jpeg"}
                                    onChange={(e) => setNewFile4(e.target.files)}
                                    />
                                </div>
                            </div>
                            <input
                                id="add_service_submit"
                                type={'submit'}
                                value={"Crear nuevo servicio"}
                                onClick={createItem}
                            />
                            <span id="add_service_reminder">Recuerda esperar hasta el mensaje correcto antes de salir de esta página</span>
                            <span id="add_service_reminder">{correctAlert}</span>
                        </div>
                    </div>
                
            </div>
            : <LoadingScreen/>} 
        </div>
    )
}