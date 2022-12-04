import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import { useParams } from "react-router-dom";
import LoadingScreen from '../components/LoadingScreen';
import { Link } from 'react-router-dom';
import '../styles/EditEnterprises.css';

export default function EditEnterprises(){
    const [locationId, setLocationId] = useState(1);
    const [locationName, setLocationName] = useState("Monterrey");
    const [loadingScreen, setLoadingScreen] = useState(true);
    const [enterprises, setEnterprises] = useState();
    const [selection, setSelection] = useState(null);
    const [selectionUrl, setSelectionUrl] = useState(null);
    const [newFile, setNewFile] = useState(null);
    const [publicUrlString, setPublicUrlString] = useState(null);
    const [newName, setNewName] = useState(null);

    const getUserData = async () => {
        try{
            const {
            data: { user },
            } = await supabase.auth.getUser();
            if(user){
                const { data, error } = await supabase
                .from("account")
                .select()
                .eq("uuid", user.id);
                setLocationName(data[0].location);
                getLocationId();
            }
            setLoadingScreen(false);
        }
        catch{

        }
    };
        
    const getLocationId = async () => {
        try{
            const { data, error} = await supabase
            .from("location")
            .select()
            .eq("name", locationName);
            setLocationId(data[0].id);
            setLoadingScreen(false);
        } catch{

        }
    }

    const insideUseEffect = () => {
        getUserData();
        getEnterprises();
    }

    useEffect(() => {      
        insideUseEffect();
    }, [loadingScreen])              

    const getEnterprises = async () => {
        const { data, error } = await supabase
        .from('enterprises')
        .select()
        .eq("location_id", locationId);
        setEnterprises(data);
        setLoadingScreen(false);
    }

    const removeItem = async () => {
        if(selection != null){
            removeBucket();
            removeDb();
        }
        else{
            alert("Por favor selecciona un logo");
        }
    }

    const removeBucket = async () => {
        console.log("Eliminando de Bucket...");
        const { data, error } = await supabase
        .storage
        .from('enterprises-img')
        .remove([`${locationId}` + '/' + selection.toString()]);
    }

    const removeDb = async () => {
        console.log("Eliminando de DB...");
        const { error } = await supabase
        .from('enterprises')
        .delete()
        .eq('id', selection);
    }

    const uploadItem = async () => {
        uploadBucket();
        insertDb();
    }

    const uploadBucket = async () => {
        if(newName != null && newFile != null){
            console.log("Subiendo a Bucket...");
            const { data, error } = await supabase
            .storage
            .from('enterprises-img')
            .upload(`${locationId}` + '/' + `${newName}`, newFile[0]);
            console.log("Sale de UploadBucket");
        }
        else{
            alert("Favor de llenar todos los espacios");
        }
    }


    const insertDb = async () => {
        if(newName != null && newFile != null){
            console.log("Obteniendo PublicURL");
            const { data } = supabase
            .storage
            .from('enterprises-img')
            .getPublicUrl(`${locationId}` + '/' + `${newName}`);
            console.log("PublicURL " + data.publicUrl.toString());
    
            console.log("Subiendo a DB...");
            const { error } = await supabase
            .from('enterprises')
            .insert({ name: newName, img_url: data.publicUrl.toString(), location_id: locationId });
            console.log(error);
        }
    }

    const delay = ms => new Promise(
        resolve => setTimeout(resolve, ms)
    );

    return(
        <div className='edit_enterprises_background'>
            <div className='edit_enterprises_instructions'>
                Selecciona el logo que deseas editar
            </div>
            <div className='edit_enterprises_enterprises'>
                {!loadingScreen
                ?
                <div className='edit_enterprises_enterprises_container'>
                    <div className='edit_enterprises_enterprises_left'>
                        <div className='edit_enterprises_enterprises_text'>
                            Contamos con los mejores aliados para la realización de tu servicio
                        </div>
                    </div>
                    <div className='edit_enterprises_enterprises_right'>
                        <div className='edit_enterprises_enterprises_gallery'>
                            {enterprises.map((enterprise) => {
                            return(
                                <div className='edit_enterprises_enterprises_item' key={enterprise.id} onClick={(e) => setSelection(enterprise.id)}>
                                    <img src={enterprise.img_url}/>
                                    <span>{enterprise.id}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            : <LoadingScreen/>}
            </div>
            <div className='edit_enterprises_selection'>
                <span>Eliminar Logo</span>
                <span>Selecciona el logo a eliminar y dale click al botón "Eliminar logo con id"</span>
                <input 
                    id='edit_enterprises_submit'
                    type={"submit"}
                    onClick={removeItem}
                    value={"Eliminar logo con id: " + selection}>
                </input>
                <span>Agregar Logo</span>
                <span>Agrega una imagen y un nuevo nombre para el logo y da click al botón "Agregar logo"</span>
                <div id='edit_enterprises_new_file'>
                    Nueva imagen:
                    <input
                        type={"file"}
                        accept={".png, .jpg, .jpeg"}
                        onChange={(e) => setNewFile(e.target.files)}
                    />
                </div>
                <input 
                    type={"text"}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder={"Nuevo nombre"}
                />
                <span>Nuevo Nombre: {newName}</span>
                <input 
                    id='edit_enterprises_submit'
                    type={"submit"}
                    onClick={uploadItem}
                    value={"Agregar logo"}>
                </input>
            </div>
        </div>
    )
}