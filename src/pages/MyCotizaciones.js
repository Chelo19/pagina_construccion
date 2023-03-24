import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/SentCotizaciones.css';
import '../styles/NoItems.css';
import LoadingScreen2 from '../components/LoadingScreen2';
import { Link } from "react-router-dom";
import _ from 'lodash';

import TurnLeftOutlinedIcon from '@mui/icons-material/TurnLeftOutlined';

export default function MyCotizaciones(){

    // en esta pagina van todas las cotizaciones del usuario que entra a esta pagina
    // cotizaciones solicitadas es cuando le dan click a cotizar en un servicio y esta pendiente a que el administrador se la pase a aliados
    // cotizaciones pendientes son las que estan esperando a ser respondidas por el cliente a partir de las propuestas que el aliado mando
    // cotizaciones presentes son aquellas cuyo proyecto se este llevando a cabo
    // cotizaciones finalizadas son las que su proyecto ya se llevo a cabo

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isRejecting, setIsRejecting] = useState(false);

    const [noItems, setNoItems] = useState(false);

    const [requestedCotizaciones, setRequestedCotizaciones] = useState(null);
    const [pendingCotizaciones, setPendingCotizaciones] = useState(null);
    const [currentCotizaciones, setCurrentCotizaciones] = useState(null);
    const [doneCotizaciones, setDoneCotizaciones] = useState(null);

    const [selectedCotizacionType, setSelectedCotizacionType] = useState(null);
    const [selectedCotizacion, setSelectedCotizacion] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        getCotizaciones();
    }, []);

    const getCotizaciones = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        const { data, error } = await supabase
        .from('cotizaciones')
        .select(`*, service_id(*), account_email(*)`)
        .match({ account_email: user.email })
        .order('id', { ascending: true });
        if(data.length > 0){
            setRequestedCotizaciones(data.filter(cotizacion => {
                return cotizacion.options_length == null;
            }))
            setPendingCotizaciones(data.filter(cotizacion => {
                return cotizacion.options_length != null && cotizacion.option_selected == null && cotizacion.link_drive_ally && cotizacion.is_done == false;
            }))
            setCurrentCotizaciones(data.filter(cotizacion => {
                return cotizacion.options_length != null && cotizacion.option_selected != null && cotizacion.link_drive_ally && cotizacion.is_done == false
            }))
            setDoneCotizaciones(data.filter(cotizacion => {
                return cotizacion.is_done == true;
            }))
        }
        else{
            setNoItems(true);
        }
        setIsLoading(false);
    }

    const selectOption = async () => {
        console.log(selectedOption);
        const { error } = await supabase
        .from('cotizaciones')
        .update({ option_selected: selectedOption })
        .eq('id', selectedCotizacion.id);
        if(!error){
            console.log("Hecho");
        }
        else{
            console.log(error);
        }
    }


    return(
        <>
            {!isLoading ?
                <div className='generic_background'>
                    <div className='generic_container'>
                        {!noItems ?
                            <>
                                {!selectedCotizacion ?
                                    <>
                                        <span>Cotizaciones pendientes</span>
                                        {pendingCotizaciones.map((cotizacion) => {
                                            return(
                                                <Link key={cotizacion.id} onClick={(e) => {setSelectedCotizacion(cotizacion); setSelectedCotizacionType('pending')}}>
                                                    <span>{cotizacion.id}</span>
                                                    <span>{cotizacion.service_id.id}</span>
                                                    {/* <img src={cotizacion.service_id.img_url[0]}/> */}
                                                    
                                                </Link>
                                            )
                                        })}
                                        <span>Cotizaciones solicitadas</span>
                                        {requestedCotizaciones.map((cotizacion) => {
                                            return(
                                                <Link key={cotizacion.id} onClick={(e) => {setSelectedCotizacion(cotizacion); setSelectedCotizacionType('requested')}}>
                                                    <span>{cotizacion.id}</span>
                                                    <span>{cotizacion.service_id.id}</span>
                                                    {/* <img src={cotizacion.service_id.img_url[0]}/> */}
                                                </Link>
                                            )
                                        })}
                                        <span>Cotizaciones presentes</span>
                                        {currentCotizaciones.map((cotizacion) => {
                                            return(
                                                <Link key={cotizacion.id} onClick={(e) => {setSelectedCotizacion(cotizacion); setSelectedCotizacionType('current')}}>
                                                    <span>{cotizacion.id}</span>
                                                    <span>{cotizacion.service_id.id}</span>
                                                    {/* <img src={cotizacion.service_id.img_url[0]}/> */}
                                                </Link>
                                            )
                                        })}
                                        <span>Cotizaciones finalizadas</span>
                                        {doneCotizaciones.map((cotizacion) => {
                                            return(
                                                <Link key={cotizacion.id} onClick={(e) => {setSelectedCotizacion(cotizacion); setSelectedCotizacionType('done')}}>
                                                    <span>{cotizacion.id}</span>
                                                    <span>{cotizacion.service_id.id}</span>
                                                    {/* <img src={cotizacion.service_id.img_url[0]}/> */}
                                                </Link>
                                            )
                                        })}
                                    </>
                                    :
                                    <>
                                        {selectedCotizacionType == 'pending' &&
                                            <div>
                                                <Link onClick={(e) => setSelectedCotizacion(null)}>Regresar</Link>
                                                <span>{selectedCotizacion.service_id.name}</span>
                                                <a href={`https://${selectedCotizacion.link_drive_ally}`}>Link Drive</a>
                                                <span>Selecciona la cotizacion que mejor se adecue a tus necesidades</span>
                                                <select onChange={(e) => setSelectedOption(e.target.value)}>
                                                {_.times(selectedCotizacion.options_length, (i) => (
                                                    <option key={i + 1} value={i + 1}>
                                                        {i + 1}
                                                    </option>
                                                ))}
                                                </select>
                                                <button onClick={selectOption}>Enviar</button>
                                            </div>
                                        }
                                        {selectedCotizacionType == 'requested' &&
                                            <div>
                                                <Link onClick={(e) => setSelectedCotizacion(null)}>Regresar</Link>
                                                <span>{selectedCotizacion.service_id.name}</span>
                                            </div>
                                        }
                                        {selectedCotizacionType == 'current' &&
                                            <div>
                                                <Link onClick={(e) => setSelectedCotizacion(null)}>Regresar</Link>
                                                <span>{selectedCotizacion.service_id.name}</span>
                                            </div>
                                        }
                                        {selectedCotizacionType == 'done' &&
                                            <div>
                                                <Link onClick={(e) => setSelectedCotizacion(null)}>Regresar</Link>
                                                <span>{selectedCotizacion.service_id.name}</span>
                                            </div>
                                        }
                                    </>
                                }
                            </>
                            :
                            <div className='no_items_background'>
                                <div className='no_items_container'>
                                    <div className='no_items_img'>
                                        <img src={require('../img/financiamiento.png')}/>
                                    </div>
                                    <div className='no_items_spans'>
                                        <span className='no_items_span_title'>Aún no existen cotizaciones aceptadas</span>
                                    </div>
                                    <div className="no_items_buttons">
                                        <Link onClick={(e) => navigate(-1)} className="no_items_button" id="no_items_button_return">
                                            Regresar <TurnLeftOutlinedIcon/>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                :
                <LoadingScreen2/>
            }
        </>
    );
}