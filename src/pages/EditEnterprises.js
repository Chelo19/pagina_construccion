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
            console.log(data[0].id);
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
        console.log(data);
        setLoadingScreen(false);
    }

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
                                <div className='edit_enterprises_enterprises_item' key={enterprise.id}>
                                    <img src={enterprise.img_url[0]}/>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            : <LoadingScreen/>}
            </div>
        </div>
    )
}