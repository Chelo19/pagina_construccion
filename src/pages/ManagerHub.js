import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/ManagerHub.css';
import { Link } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';

export default function ManagerHub(){
    const navigate = useNavigate();
    const [loadingScreen, setLoadingScreen] = useState(true);

    const [locationId, setLocationId] = useState(null);

    useEffect(() => {
        getUserMethod();
    }, [loadingScreen])

    const getUserMethod = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(user){
            const { data, error } = await supabase
            .from('account')
            .select()
            .eq('uuid', user.id);
            if(data[0].role == 'gerente'){
                console.log(data[0].location_id);
                setLocationId(data[0].location_id);
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

    return(
        <div className='manager_hub_background'>
            {!loadingScreen ?
            <div className='manager_selections'>
                <Link to={`/edit-users/${locationId}`} className='manager_selections_item'>
                    <div className='manager_selections_item_left'>
                        <Link to={`/edit-users/${locationId}`} id='manager_package' className='manager_selection_logo' style={{ color: 'inherit', textDecoration: 'inherit'}}>
                            <img src={require('../img/package.png')} id='manager_package'/>
                        </Link>
                    </div>
                    <div className='manager_selections_item_right'>
                        <Link to={`/edit-users/${locationId}`} className='manager_selections_item_title'>
                            <span>Editar Usuarios</span>
                        </Link>
                        <Link to={`/edit-users/${locationId}`} className='manager_selections_item_description'>
                            <span>Edita los datos de un usuario en específico</span>
                        </Link>
                    </div>
                </Link>
                <Link to={`/edit-services-select-category/${locationId}`} className='manager_selections_item'>
                    <div className='manager_selections_item_left'>
                        <Link to={`/edit-services-select-category/${locationId}`} id='manager_package' className='manager_selection_logo' style={{ color: 'inherit', textDecoration: 'inherit'}}>
                            <img src={require('../img/package.png')} id='manager_package'/>
                        </Link>
                    </div>
                    <div className='manager_selections_item_right'>
                        <Link to={`/edit-services-select-category/${locationId}`} className='manager_selections_item_title'>
                            <span>Editar Servicios</span>
                        </Link>
                        <Link to={`/edit-services-select-category/${locationId}`} className='manager_selections_item_description'>
                            <span>Edita los datos de un servicio en específico</span>
                        </Link>
                    </div>
                </Link>
            </div>
            : <LoadingScreen/>}
        </div>
    )

}