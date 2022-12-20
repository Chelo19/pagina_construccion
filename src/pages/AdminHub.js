import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate, useParams} from 'react-router-dom';
import '../styles/AdminHub.css';
import '../styles/Account.css';
import { Link } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';

export default function AdminHub(){
    const navigate = useNavigate();
    
    const [locationId, setLocationId] = useState(1);
    const [loadingScreen, setLoadingScreen] = useState(true);

    const { reload } = useParams();

    useEffect(() => {
        if(reload == "0"){
            navigate('/admin-hub/1');
            window.location.reload();
        }
    },[]);

    useEffect(() => {
        getUserMethod();
        getUserData();
    }, [loadingScreen]);

    const getUserMethod = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(user){
            const { data, error } = await supabase
            .from('account')
            .select()
            .eq('uuid', user.id);
            if(data[0].role == 'administrador' || data[0].role == 'gerente'){
            }
            else{
                alert("No tienes los permisos para acceder a este lugar");
                navigate("/");
            }
        }
        else{
            navigate("/");
        }
        setLoadingScreen(false);
    }

    const getUserData = async () => {
        try{
            const {
            data: { user },
            } = await supabase.auth.getUser();
        
            const { data, error } = await supabase
            .from("account")
            .select()
            .eq("uuid", user.id);
            console.log(data);
            setLocationId(data[0].admin_location_id);
        }
        catch{

        }
    };

    return(
        <div className="admin_background">
            {!loadingScreen ? 
            <div className='admin_selections'>
                <Link to={`/edit-services-select-category/${locationId}`} id='edit_services' className='admin_selections_item'>
                    <div className='admin_selections_item_left'>
                        <Link to={`/edit-services-select-category/${locationId}`} id='admin_package' className='admin_selection_logo' style={{ color: 'inherit', textDecoration: 'inherit'}}>
                            <img src={require('../img/package.png')} id='admin_package'/>
                        </Link>
                    </div>
                    <div className='admin_selections_item_right'>
                        <Link to={`/edit-services-select-category/${locationId}`} className='admin_selections_item_title'>
                            <span>Editar Servicios</span>
                        </Link>
                        <Link to={`/edit-services-select-category/${locationId}`} className='admin_selections_item_description'>
                            <span>Edita los datos de un servicio en específico</span>
                        </Link>
                    </div>
                </Link>
                <Link to={`/add-service-select-category/${locationId}`} id='admin_add_service' className='admin_selections_item'>
                    <div className='admin_selections_item_left'>
                        <Link to={`/add-service-select-category/${locationId}`} id='admin_package' className='admin_selection_logo'>
                            <img src={require('../img/package.png')} id='admin_package'/>
                        </Link>
                    </div>
                    <div className='admin_selections_item_right'>
                        <Link to={`/add-service-select-category/${locationId}`} className='admin_selections_item_title'>
                            <span>Agregar Servicio</span>
                        </Link>
                        <Link to={`/add-service-select-category/${locationId}`} className='admin_selections_item_description'>
                            <span>Agrega un servicio</span>
                        </Link>
                    </div>
                </Link>
                <Link to={`/edit-categories/${locationId}`} id='admin_edit_categories' className='admin_selections_item'>
                    <div className='admin_selections_item_left'>
                        <Link to={`/edit-categories/${locationId}`} id='admin_package' className='admin_selection_logo'>
                            <img src={require('../img/package.png')} id='admin_package'/>
                        </Link>
                    </div>
                    <div className='admin_selections_item_right'>
                        <Link to={`/edit-categories/${locationId}`} className='admin_selections_item_title'>
                            <span>Editar Categorías</span>
                        </Link>
                        <Link to={`/edit-categories/${locationId}`} className='admin_selections_item_description'>
                            <span>Edita los datos de una categoría en específico</span>
                        </Link>
                    </div>
                </Link>
                <Link to={`/add-category/${locationId}`} id='admin_add_category' className='admin_selections_item'>
                    <div className='admin_selections_item_left'>
                        <Link to={`/add-category/${locationId}`} id='admin_package' className='admin_selection_logo'>
                            <img src={require('../img/package.png')} id='admin_package'/>
                        </Link>
                    </div>
                    <div className='admin_selections_item_right'>
                        <Link to={`/add-category/${locationId}`} className='admin_selections_item_title'>
                            <span>Agregar Categoría</span>
                        </Link>
                        <Link to={`/add-category/${locationId}`} className='admin_selections_item_description'>
                            <span>Agrega una categoría</span>
                        </Link>
                    </div>
                </Link>
                <Link to={`/add-service-home-select-category/${locationId}`} id='admin_add_service_home_display' className='admin_selections_item'>
                    <div className='admin_selections_item_left'>
                        <Link to={`/add-service-home-select-category/${locationId}`} id='admin_package' className='admin_selection_logo'>
                            <img src={require('../img/package.png')} id='admin_package'/>
                        </Link>
                    </div>
                    <div className='admin_selections_item_right'>
                        <Link to={`/add-service-home-select-category/${locationId}`} className='admin_selections_item_title'>
                            <span>Agregar Servicio a Home</span>
                        </Link>
                        <Link to={`/add-service-home-select-category/${locationId}`} className='admin_selections_item_description'>
                            <span>Agrega un servicio a home</span>
                        </Link>
                    </div>
                </Link>
                <Link to={`/remove-service-home/${locationId}`} id='admin_add_service_home_display' className='admin_selections_item'>
                    <div className='admin_selections_item_left'>
                        <Link to={`/remove-service-home/${locationId}`} id='admin_package' className='admin_selection_logo'>
                            <img src={require('../img/package.png')} id='admin_package'/>
                        </Link>
                    </div>
                    <div className='admin_selections_item_right'>
                        <Link to={`/remove-service-home/${locationId}`} className='admin_selections_item_title'>
                            <span>Quitar Servicio de Home</span>
                        </Link>
                        <Link to={`/remove-service-home/${locationId}`} className='admin_selections_item_description'>
                            <span>Quita un servicio de home</span>
                        </Link>
                    </div>
                </Link>
                <Link to={`/edit-enterprises/${locationId}`} id='admin_edit_logos' className='admin_selections_item'>
                    <div className='admin_selections_item_left'>
                        <Link to={`/edit-enterprises/${locationId}`} id='admin_package' className='admin_selection_logo'>
                            <img src={require('../img/package.png')} id='admin_package'/>
                        </Link>
                    </div>
                    <div className='admin_selections_item_right'>
                        <Link to={`/edit-enterprises/${locationId}`} className='admin_selections_item_title'>
                            <span>Editar Logos</span>
                        </Link>
                        <Link to={`/edit-enterprises/${locationId}`} className='admin_selections_item_description'>
                            <span>Edita los logos de la página principal</span>
                        </Link>
                    </div>
                </Link>
                <Link to={`/create-posts/${locationId}`} id='admin_edit_logos' className='admin_selections_item'>
                    <div className='admin_selections_item_left'>
                        <Link to={`/create-posts/${locationId}`} id='admin_package' className='admin_selection_logo'>
                            <img src={require('../img/package.png')} id='admin_package'/>
                        </Link>
                    </div>
                    <div className='admin_selections_item_right'>
                        <Link to={`/create-posts/${locationId}`} className='admin_selections_item_title'>
                            <span>Crear Posts</span>
                        </Link>
                        <Link to={`/create-posts/${locationId}`} className='admin_selections_item_description'>
                            <span>Crea Posts</span>
                        </Link>
                    </div>
                </Link>
                <Link to={`/edit-posts-select-user/${locationId}`} id='admin_edit_logos' className='admin_selections_item'>
                    <div className='admin_selections_item_left'>
                        <Link to={`/edit-posts-select-user/${locationId}`} id='admin_package' className='admin_selection_logo'>
                            <img src={require('../img/package.png')} id='admin_package'/>
                        </Link>
                    </div>
                    <div className='admin_selections_item_right'>
                        <Link to={`/edit-posts-select-user/${locationId}`} className='admin_selections_item_title'>
                            <span>Edita Posts</span>
                        </Link>
                        <Link to={`/edit-posts-select-user/${locationId}`} className='admin_selections_item_description'>
                            <span>Edita un Post</span>
                        </Link>
                    </div>
                </Link>
            </div>
            : <LoadingScreen/>}
        </div>
    )
}