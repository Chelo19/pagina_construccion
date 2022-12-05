import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/AdminHub.css';
import '../styles/Account.css';
import { Link } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';

export default function AdminHub(){
    const navigate = useNavigate();
    
    const [locationId, setLocationId] = useState(1);
    const [loadingScreen, setLoadingScreen] = useState(true);

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
            if(data[0].role != 'administrador'){
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
            setLocationId(data[0].location_id);
        }
        catch{

        }
    };

    return(
        <div className="admin_background">
            {!loadingScreen ? 
            <div className='selections'>
                <Link to={`/edit-services/${locationId}`} id='edit_services' className='selections_item'>
                    <div className='selections_item_left'>
                        <Link to={`/edit-services/${locationId}`} id='package' className='selection_logo' style={{ color: 'inherit', textDecoration: 'inherit'}}>
                            <img src={require('../img/package.png')} id='package'/>
                        </Link>
                    </div>
                    <div className='selections_item_right'>
                        <Link to={`/edit-services/${locationId}`} className='selections_item_title'>
                            <span>Editar Servicios</span>
                        </Link>
                        <Link to={`/edit-services/${locationId}`} className='selections_item_description'>
                            <span>Edita los datos de un servicio en específico</span>
                        </Link>
                    </div>
                </Link>
                <Link to={`/edit-categories/${locationId}`} id='edit_categories' className='selections_item'>
                    <div className='selections_item_left'>
                        <Link to={`/edit-categories/${locationId}`} id='package' className='selection_logo'>
                            <img src={require('../img/package.png')} id='package'/>
                        </Link>
                    </div>
                    <div className='selections_item_right'>
                        <Link to={`/edit-categories/${locationId}`} className='selections_item_title'>
                            <span>Editar Categorías</span>
                        </Link>
                        <Link to={`/edit-categories/${locationId}`} className='selections_item_description'>
                            <span>Edita los datos de una categoría en específico</span>
                        </Link>
                    </div>
                </Link>
                <Link to={`/edit-enterprises/${locationId}`} id='edit_logos' className='selections_item'>
                    <div className='selections_item_left'>
                        <Link to={`/edit-enterprises/${locationId}`} id='package' className='selection_logo'>
                            <img src={require('../img/package.png')} id='package'/>
                        </Link>
                    </div>
                    <div className='selections_item_right'>
                        <Link to={`/edit-enterprises/${locationId}`} className='selections_item_title'>
                            <span>Editar Logos</span>
                        </Link>
                        <Link to={`/edit-enterprises/${locationId}`} className='selections_item_description'>
                            <span>Edita los logos de la página principal</span>
                        </Link>
                    </div>
                </Link>
                <Link to={`/add-category/${locationId}`} id='add_category' className='selections_item'>
                    <div className='selections_item_left'>
                        <Link to={`/add-category/${locationId}`} id='package' className='selection_logo'>
                            <img src={require('../img/package.png')} id='package'/>
                        </Link>
                    </div>
                    <div className='selections_item_right'>
                        <Link to={`/add-category/${locationId}`} className='selections_item_title'>
                            <span>Agregar Categoría</span>
                        </Link>
                        <Link to={`/add-category/${locationId}`} className='selections_item_description'>
                            <span>Agrega una categoría</span>
                        </Link>
                    </div>
                </Link>
            </div>
            : <LoadingScreen/>}
        </div>
    )
}