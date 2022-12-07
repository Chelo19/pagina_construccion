import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { useNavigate, useParams } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import { Link } from "react-router-dom";
import "../styles/AddCategory.css";


export default function AddCategory(){
    const { id } = useParams();
    const navigate = useNavigate();
    const [newName, setNewName] = useState(null);
    const [newFile, setNewFile] = useState(null);
    const [alert, setAlert] = useState(null);
    const [loadingScreen, setLoadingScreen] = useState(true);
    var categoryId;
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
                setLoadingScreen(false);
            }
        }
        else{
            window.alert("Inicia sesión como administrador para acceder");
            navigate("/login");
        }
    }

    useEffect(() => {
        checkIfAdmin();
    }, [loadingScreen]);

    const createItem = async () => {
        setAlert("Recuerda esperar la alerta de confirmación antes de abandonar esta página");
        if(newName != null && newFile != null){
            insertDb();
            getItem();
        }
        else{
            window.alert("Favor de ingresar nombre e imagen");
        }
    }
    
    const insertDb = async () => {
        const { error } = await supabase
        .from('categories')
        .insert({ name: newName, location_id: id })
    }

    const getItem = async () => {
        const { data, error } = await supabase
        .from('categories')
        .select()
        .match({ location_id: id, name: newName });
        categoryId = data[0].id;
        uploadBucket();
    }

    const uploadBucket = async () => {
        console.log("Log CATID uploadB: " + categoryId);
        const { data, error } = await supabase
        .storage
        .from('categories-img')
        .upload('/' + `${categoryId}`, newFile[0]);
        getPublicUrl();
    }

    const getPublicUrl = async () => {
        const { data } = supabase
        .storage
        .from('categories-img')
        .getPublicUrl(`${categoryId}`);

        newUrl.push(data.publicUrl.toString());

        const { error } = await supabase
        .from('categories')
        .update({ img_url: newUrl })
        .eq('name', newName);
        document.location.reload();
    }

    
    return(
        <div className="add_category_background">
            {!loadingScreen ?
            <div className="add_category_container">
                <span>Nombre de la nueva categoría</span>
                <input
                id={'add_category_text_input'}
                type={'text'}
                placeholder={'Nombre de la nueva categoría'}
                onChange={(e) => setNewName(e.target.value)}
                />
                <span>Imagen de la nueva categoría</span>
                <input
                  type={"file"}
                  accept={".png, .jpg, .jpeg"}
                  onChange={(e) => setNewFile(e.target.files)}
                />
                <input
                id={'add_category_submit'}
                type={'submit'}
                value={"Crear nueva categoría"}
                onClick={createItem}
                />
                <span id="add_category_alert">{alert}</span>
            </div>
            : <LoadingScreen/>}
        </div>
    )
}