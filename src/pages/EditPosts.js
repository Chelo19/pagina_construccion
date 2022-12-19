import {useEffect, useState} from 'react';
import { useNavigate, useParams } from "react-router-dom";
import {supabase} from '../supabase/client';
import '../styles/EditPosts.css';
import { Link } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';

export default function EditPosts(){

    const { id } = useParams();
    const navigate = useNavigate();
    const [loadingScreen, setLoadingScreen] = useState(true);

    const [services , setServices] = useState(null);
    const [serviceSelection, setServiceSelection] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [inService, setInService] = useState(false);
    const [serviceImgUrl, setServiceImgUrl] = useState(null);
    const [containerStyle, setContainerStyle] = useState(null);
    const [itemsStyle, setItemsStyle] = useState(null);
    const [noItems, setNoItems] = useState(false);

    const [newTitle, setNewTitle] = useState(null);
    const [newDescription, setNewDescription] = useState(null);
    const [fileList, setFileList] = useState(null);
    var newUrls = [];
    

    useEffect(() => {
        getClientServices();
    }, [loadingScreen]);

    const getClientServices = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(!user) navigate('/Login');
        const { data, error } = await supabase
        .from('my_services')
        .select()
        .eq('user_uuid', id);
        if(data.length > 0){
            setServices(data);
        }
        else{
            setNoItems(true);
        }
        setLoadingScreen(false);
    };

    const selectService = async (selection) => {
        setServiceSelection(selection);
        var res = services.filter(service => {
            return service.id === selection
        })
        setSelectedService(res);
        setServiceImgUrl(res[0].img_url)
        setInService(true);
        setItemsStyle({ "display": "none" });
        setContainerStyle({ "display": "flex" });
    }

    const deselectService = async () => {
        setInService(false);
        setItemsStyle({ "display": "flex" });
        setContainerStyle(null);
        setNewTitle(null);
        setNewDescription(null);
        setFileList(null);
        newUrls = [];
    }

    const updatePost = async () => {
        if(fileList){
            updateBucket();
        }
        if(!newTitle && !newDescription){
            return;
        }
        updateDb();
        document.location.reload();
    }

    const updateDb = async () => {
        if(newTitle && newDescription){
            const { error } = await supabase
            .from('my_services')
            .update({ name: newTitle, description: newDescription })
            .eq('id', selectedService[0].id);
            document.location.reload();
            return;
        }
        if(newTitle){
            const { error } = await supabase
            .from('my_services')
            .update({ name: newTitle })
            .eq('id', selectedService[0].id);
            document.location.reload();
            return;
        }
        if(newDescription){
            const { error } = await supabase
            .from('my_services')
            .update({ description: newDescription })
            .eq('id', selectedService[0].id);
            document.location.reload();
            return;
        }
    }

    const updateBucket = async () => {
        removeBucket();
        for(var i = 0 ; i < fileList.length ; i++){
            const { data, error } = await supabase
            .storage
            .from('my-services-img')
            .upload(`/${selectedService[0].id}/${i}`, fileList[i]);
            console.log(error);
        }
        getPublicUrls();
    }

    const removeBucket = async () => {
        for(var i = selectedService[0].img_url.length - 1 ; i >= 0 ; i--){
            const { data, error } = await supabase
            .storage
            .from('my-services-img')
            .remove([`${selectedService[0].id}` + '/' + `${i}`]);
            console.log(error);
        }
    }

    const getPublicUrls = async () => {
        for(var i = 0 ; i < fileList.length ; i++){
            const { data } = supabase
            .storage
            .from('my-services-img')
            .getPublicUrl(`/${selectedService[0].id}/${i}`);
            newUrls.push(data.publicUrl.toString());
        }
        const { error } = await supabase
        .from('my_services')
        .update({ img_url: newUrls })
        .eq('id', selectedService[0].id);
    }

    const deletePost = async () => {
        for(var i = selectedService[0].img_url.length - 1 ; i >= 0 ; i--){
            const { data, error } = await supabase
            .storage
            .from('my-services-img')
            .remove([`${selectedService[0].id}` + '/' + `${i}`]);
        }
        const { error } = await supabase
        .from('my_services')
        .delete()
        .eq('id', selectedService[0].id);
        document.location.reload();
    }

    return(
        <div className='edit_posts_background'>
            {!loadingScreen ?
            <div className='edit_posts_container'>
                <div className='edit_posts_container_right'>
                    {!noItems ? 
                        <div className='edit_posts_services_container' style={containerStyle}>
                            {services.map((service) => {
                                return(
                                    <Link onClick={(e) => selectService(service.id)} key={service.id} className='edit_posts_service' style={itemsStyle}>
                                        <div className='edit_posts_title'>
                                            <span>
                                                {service.name}
                                            </span>
                                        </div>
                                        <div className='edit_posts_img'>
                                            <img src={service.img_url[0]}/>
                                        </div>
                                    </Link>
                                )
                            })}
                            {inService &&
                                <div className='edit_posts_in_service'>
                                    <div className='edit_posts_in_service_container'>
                                        <div className='edit_posts_in_service_left'>
                                            <div className='edit_posts_in_service_title'>
                                                <span>
                                                    {selectedService[0].name}
                                                </span>
                                            </div>
                                            <Link className='edit_posts_in_service_return_button' onClick={(e) => deselectService()}>
                                                <img src={require('../img/flecha.png')}/>
                                            </Link>
                                            <div className='edit_posts_in_service_description'>
                                                <span>
                                                    {selectedService[0].description}
                                                </span>
                                            </div>
                                            <div className='edit_posts_in_service_img'>
                                                {serviceImgUrl.map((serviceImg) => {
                                                    return(
                                                        <div key={serviceImg} className='edit_posts_in_service_img_individual_img'>
                                                            <img src={serviceImg}/>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                        <div className='edit_posts_in_service_right'>
                                            <span>Nuevo Nombre</span>
                                            <input className='edit_posts_in_service_inputs'
                                            type={'text'}
                                            placeholder={'Nuevo nombre'}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                            />
                                            <span>Nueva Descripción</span>
                                            <textarea className='edit_posts_in_service_inputs'
                                            rows={10}
                                            placeholder={'Nueva descripción'}
                                            onChange={(e) => setNewDescription(e.target.value)}
                                            />
                                            <span>Nuevas Imágenes</span>
                                            <input className='edit_posts_in_service_inputs_files' type="file" onChange={(e) => setFileList(e.target.files)} multiple
                                            accept=".jpg, .jpeg, .png"/>
                                            <div className='create_posts_popup_buttons_container'>
                                                <Link onClick={(e) => updatePost()} className='create_posts_popup_buttons' id='edit_posts_popup_create'>
                                                    Actualizar
                                                </Link>
                                                <div className="edit_posts_remove">
                                                    <span>--- Zona de peligro ---</span>
                                                    <div className="edit_posts_remove_options">
                                                        <Link onClick={(e) => deletePost()} id='edit_posts_remove_input'>Eliminar</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    :   <div className='edit_posts_no_items'>
                            <span>Este usuario no tiene ningún servicio activo aún</span>
                            <Link to={"/admin-hub/"} className='edit_posts_no_items_back'>
                                <span>
                                    Regresar
                                </span>
                                <div className='edit_posts_no_items_back_arrow'>
                                    <img src={require('../img/flecha.png')}/>
                                </div>
                            </Link>
                        </div>}
                </div>
            </div>
            : <LoadingScreen/>}
        </div>
    )
    
}