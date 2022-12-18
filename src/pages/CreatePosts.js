import {useEffect, useState} from 'react';
import { useNavigate, useParams } from "react-router-dom";
import {supabase} from '../supabase/client';
import '../styles/CreatePosts.css';
import { Link } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';
import { upload } from '@testing-library/user-event/dist/upload';

export default function CreatePosts(){
    
    const navigate = useNavigate();
    let { id } = useParams();
    const [loadingScreen, setLoadingScreen] = useState(true);
    const [users, setUsers] = useState(null);
    const [noItems, setNoItems] = useState(false);
    const [popUp, setPopUp] = useState(false);
    const [fileList, setFileList] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    var newUrls = [];

    const [postName, setPostName] = useState(null);
    const [postDescription, setPostDescription] = useState(null);

    useEffect(() => {
        getLocalUsers();
    }, [loadingScreen])

    const getLocalUsers = async () => {
        const { data, error } = await supabase
        .from('account')
        .select()
        .order('id', { ascending: true })
        .match({ location_id: id });
        if(data.length == 0){
            setNoItems(true);
        }
        setUsers(data);
        setLoadingScreen(false);
    }

    const createPostPopUp = async (selection) => {
        setPopUp(true);
        for(var i = 0 ; i < users.length ; i++){
            if(users[i].id == selection){
                setSelectedUser(users[i]);
            }
        }
    }

    const cancelPopUp = () => {
        setPopUp(false);
        setFileList(null);
        setPostName(null);
        setPostDescription(null);
    }

    const handleFileChange = (e) => {
        setFileList(e.target.files);
    };

    const insertDb = async () => {
        if(postName && postDescription && fileList.length > 0){
            const { error } = await supabase
            .from('my_services')
            .insert({ user_uuid: selectedUser.uuid, name: postName, description: postDescription });
            uploadBucket();
        }
        else{
            window.alert("Faltan campos por llenar");
        }
    }

    const uploadBucket = async () => {
        const { data, error } = await supabase
        .from('my_services')
        .select()
        .match({ user_uuid: selectedUser.uuid, img_url: '{}' });
        var postId = data[0].id;
        for(var i = 0 ; i < fileList.length ; i++){
            console.log('/' + `${postId}` + '/' + `${i}`, fileList[i]);
            const { data, error } = await supabase
            .storage
            .from('my-services-img')
            .upload('/' + `${postId}` + '/' + `${i}`, fileList[i]);
        }
        getPublicUrls(postId);
    };

    const getPublicUrls = async (postId) => {
        for(var i = 0 ; i < fileList.length ; i++){
            const { data } = supabase
            .storage
            .from('my-services-img')
            .getPublicUrl('/' + `${postId}` + '/' + `${i}`);
            newUrls.push(data.publicUrl.toString());
        }
        updateDb(postId);
    }

    const updateDb = async (postId) => {
        const { error } = await supabase
        .from('my_services')
        .update({ img_url: newUrls })
        .eq('id', postId);
    }

    return(
        <div className='create_posts_background'>
            {!loadingScreen ? 
            <>
                <span className='create_posts_title'>Crear nuevo post</span>
                <div className="create_posts_gallery">
                    <div className="create_posts_container">
                        {noItems ?
                            <div className="create_posts_no_items_alert">No se encontraron resultados</div>
                        : <>
                            <div className="create_posts_item_names">
                                <span>Id</span>
                                <span>Email</span>
                                <span>Teléfono</span>
                                <span>Nombre</span>
                            </div>
                            {users.map((user) => {
                            return(
                                <Link onClick={(e) => createPostPopUp(user.id)} key={user.id} className='create_posts_item'>
                                    <span>{user.id}</span>
                                    <span>{user.email}</span>
                                    <span>{user.phone}</span>
                                    <span>{user.name}</span>
                                </Link>);
                            })}
                        </>}
                    </div>
                </div>
                {popUp &&
                    <div className='create_posts_popup_background'>
                        <div className='create_posts_popup_container'>
                            <div className='create_posts_popup_form'>
                                <input className='create_posts_popup_form_inputs'
                                type={"text"}
                                placeholder={"Nombre"}
                                onChange={(e) => setPostName(e.target.value)}
                                />
                                <textarea className='create_posts_popup_form_inputs'
                                rows={10}
                                placeholder={"Descripción"}
                                onChange={(e) => setPostDescription(e.target.value)}
                                />
                                <span>Imágenes</span>
                                <input className='create_posts_popup_form_input_files' type="file" onChange={(e) => handleFileChange(e)} multiple/>
                            </div>
                            <div className='create_posts_popup_right'>
                                <div className='create_posts_popup_user'>
                                    <span id='create_posts_popup_user_title'>Creando post para:</span>
                                    <span>Nombre: {selectedUser.name}</span>
                                    <span>Email: {selectedUser.email}</span>
                                    <span>Teléfono: {selectedUser.phone}</span>
                                    <span>Id: {selectedUser.id}</span>
                                </div>
                                <div className='create_posts_popup_buttons_container'>
                                    <Link onClick={(e) => insertDb()} className='create_posts_popup_buttons' id='create_posts_popup_create'>
                                        Crear
                                    </Link>
                                    <Link onClick={(e) => cancelPopUp()} className='create_posts_popup_buttons' id='create_posts_popup_erase'>
                                        Cancelar
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </>
            : <LoadingScreen/>}
        </div>
    )

}