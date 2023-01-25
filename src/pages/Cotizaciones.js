import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/Cotizaciones.css';
import { Link } from "react-router-dom";
import LoadingScreen2 from '../components/LoadingScreen2';

export default function Cotizaciones(){
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    const [cotizaciones, setCotizaciones] = useState(null);

    const [noItems, setNoItems] = useState(false);

    useEffect(() => {
        getCotizaciones();
    }, []);

    const getCotizaciones = async () => {
        const { data, error } = await supabase
        .from('cotizaciones')
        .select(`
            id,
            service_id(*, category_id(*)), 
            account_email(*)
        `)
        setCotizaciones(data);
        if(data.length > 0){
            setIsLoading(false);
        }
        else{
            setNoItems(true);
            window.alert("No hay datos");
        }
    }

    return(
        <>
            {!isLoading ?
                <div className='cotizaciones_background'>
                    <div className='cotizaciones_container'>
                        {cotizaciones.map((cotizacion) => {
                            return(
                                <div className='cotizaciones_item' key={cotizacion.id}>
                                    <div className='cotizaciones_item_container'>
                                        <span id='cotizaciones_item_user'>
                                            <Link to={`/profile/${cotizacion.account_email.id}`}>
                                                {cotizacion.account_email.name}
                                            </Link>
                                        </span>
                                        <span id='cotizaciones_item_id'>
                                            <Link to={`/profile/${cotizacion.account_email.id}`}>
                                                id: {cotizacion.account_email.id}
                                            </Link>
                                        </span>
                                        <span id='cotizaciones_item_action'>
                                            Quiere cotizar
                                        </span>
                                        <span id='cotizaciones_item_service'>
                                            {cotizacion.service_id.name}
                                        </span>
                                        <span id='cotizaciones_item_category'>
                                            {cotizacion.service_id.category_id.name}
                                        </span>
                                    </div>
                                    <div className='cotizaciones_item_buttons'>
                                        <Link to={`/select-allies/${cotizacion.id}`} className='cotizaciones_item_button'>
                                            <img src={require('../img/usuario_header2.png')}/>
                                        </Link>
                                        <div className='cotizaciones_item_button'>
                                            +
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            :<LoadingScreen2></LoadingScreen2>}
        </>
    );
}