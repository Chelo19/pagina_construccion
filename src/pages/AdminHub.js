import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/AdminHub.css';
import '../styles/Account.css';
import { Link } from 'react-router-dom';

export default function AdminHub(){
    const navigate = useNavigate();
    
    const [locationId, setLocationId] = useState(1);
    const [locationName, setLocationName] = useState("Monterrey");

    useEffect(() => {
        getUserMethod();
        getUserData();
        getLocationId();
        console.log(locationId);
    }, []);

    const getUserMethod = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(user){
            const { data, error } = await supabase
            .from('account')
            .select()
            .eq('uuid', user.id);
            console.log(data[0].role);
            if(data[0].role != 'administrador'){
                navigate("/Login");
            }
        }
        else{
            navigate("/Login");
        }
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
            
            setLocationName(data[0].location);
            console.log(locationName);        //log
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
            console.log(locationId);        //log
        } catch{

        }
    }

    return(
        <div className="admin_background">
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
                <Link to={`/edit-categories/${locationId}`} id='edit_users' className='selections_item'>
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
                <Link to={`/edit-enterprises/${locationId}`} id='edit_something' className='selections_item'>
                    <div className='selections_item_left'>
                        <Link to={`/edit-enterprises/${locationId}`} id='package' className='selection_logo'>
                            <img src={require('../img/package.png')} id='package'/>
                        </Link>
                    </div>
                    <div className='selections_item_right'>
                        <Link to={`/edit-enterprises/${locationId}`} className='selections_item_title'>
                            <span>Edita algo</span>
                        </Link>
                        <Link to={`/edit-enterprises/${locationId}`} className='selections_item_description'>
                            <span>Edita los datos de algo</span>
                        </Link>
                    </div>
                </Link>
            </div>
        </div>
    )
}