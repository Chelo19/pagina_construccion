import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/SentCotizaciones.css';
import '../styles/NoItems.css';
import LoadingScreen2 from '../components/LoadingScreen2';
import { Link } from "react-router-dom";
import _ from 'lodash';
import GoBackButton from '../components/GenericAssets';

import TurnLeftOutlinedIcon from '@mui/icons-material/TurnLeftOutlined';
import NavigateBeforeOutlinedIcon from '@mui/icons-material/NavigateBeforeOutlined';

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import 'swiper/css';
import 'swiper/css/pagination';

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
                return cotizacion.is_project == true;
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
                                <div className='generic_item_container'>

                                    {!selectedCotizacion ?
                                        <>
                                            <GoBackButton/>
                                            <div className='generic_form gap20'>

                                                {pendingCotizaciones.length > 0 &&
                                                    <>
                                                    <span className='generic_title font30 posL' style={{margin: "10px 0px"}}>Cotizaciones pendientes</span>
                                                    {pendingCotizaciones.map((cotizacion) => {
                                                        return(
                                                            <div className='project_item project_item_current' onClick={(e) => {setSelectedCotizacion(cotizacion); setSelectedCotizacionType('pending')}} key={cotizacion.id}>
                                                                <div className='project_item_content'>
                                                                    <span>Identificador del proyecto: {cotizacion.id}</span>
                                                                    <span>Servicio: {cotizacion.service_id.name}</span>
                                                                    <span>Categoría: {cotizacion.service_id.category_id.name}</span>
                                                                </div>
                                                                <div className='project_item_img'>
                                                                    <img src={`${cotizacion.service_id.img_url[0]}`}/>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                    </>
                                                }
                                                {requestedCotizaciones.length > 0 &&
                                                    <>
                                                    <span className='generic_title font30 posL' style={{margin: "10px 0px"}}>Cotizaciones solicitadas</span>
                                                    {requestedCotizaciones.map((cotizacion) => {
                                                        return(
                                                            <div className='project_item project_item_current' onClick={(e) => {setSelectedCotizacion(cotizacion); setSelectedCotizacionType('requested')}} key={cotizacion.id}>
                                                                <div className='project_item_content'>
                                                                    <span>Identificador del proyecto: {cotizacion.id}</span>
                                                                    <span>Servicio: {cotizacion.service_id.name}</span>
                                                                    <span>Categoría: {cotizacion.service_id.category_id.name}</span>
                                                                </div>
                                                                <div className='project_item_img'>
                                                                    <img src={`${cotizacion.service_id.img_url[0]}`}/>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                    </>
                                                }
                                                {currentCotizaciones.length > 0 &&
                                                    <>
                                                    <span className='generic_title font30 posL' style={{margin: "10px 0px"}}>Proyectos</span>
                                                    {currentCotizaciones.map((cotizacion) => {
                                                        return(
                                                            <div className='project_item project_item_current' onClick={(e) => {setSelectedCotizacion(cotizacion); setSelectedCotizacionType('current')}} key={cotizacion.id}>
                                                                <div className='project_item_content'>
                                                                    <span>Identificador del proyecto: {cotizacion.id}</span>
                                                                    <span>Servicio: {cotizacion.service_id.name}</span>
                                                                    <span>Categoría: {cotizacion.service_id.category_id.name}</span>
                                                                </div>
                                                                <div className='project_item_img'>
                                                                    <img src={`${cotizacion.service_id.img_url[0]}`}/>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                    </>
                                                }
                                                {doneCotizaciones.length > 0 &&
                                                    <>
                                                    <span className='generic_title font30 posL' style={{margin: "10px 0px"}}>Cotizaciones finalizadas</span>
                                                    {doneCotizaciones.map((cotizacion) => {
                                                        return(
                                                            <div className='project_item project_item_done' onClick={(e) => {setSelectedCotizacion(cotizacion); setSelectedCotizacionType('done')}} key={cotizacion.id}>
                                                                <div className='project_item_content'>
                                                                    <span>Identificador del proyecto: {cotizacion.id}</span>
                                                                    <span>Servicio: {cotizacion.service_id.name}</span>
                                                                    <span>Categoría: {cotizacion.service_id.category_id.name}</span>
                                                                </div>
                                                                <div className='project_item_img'>
                                                                    <img src={`${cotizacion.service_id.img_url[0]}`}/>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                    </>
                                                }
                                            </div>
                                        </>
                                        :
                                        <>
                                            <Link onClick={(e) => setSelectedCotizacion(null)} className="generic_back_button">
                                                <NavigateBeforeOutlinedIcon/> Regresar
                                            </Link>
                                            {selectedCotizacionType == 'pending' &&
                                                <>
                                                    <span className='generic_title font30 posL' style={{margin: "10px 0px"}}>Cotización pendiente</span>
                                                    <div className='profile_content generic_description font20 posL gap20'>
                                                        <span>Servicio: {selectedCotizacion.service_id.name}</span>
                                                        <span>Categoría: {selectedCotizacion.service_id.category_id.name}</span>
                                                    </div>
                                                    <span className='generic_description font18 posL'>{selectedCotizacion.service_id.name}</span>
                                                    <a href={`https://${selectedCotizacion.link_drive_ally}`} className='project_response'>Link Drive</a>
                                                    <span className='generic_title font20 posL'>Selecciona la cotizacion que mejor se adecue a tus necesidades</span>
                                                    <select className='generic_text_field' onChange={(e) => setSelectedOption(e.target.value)}>
                                                    {_.times(selectedCotizacion.options_length, (i) => (
                                                        <option key={i + 1} value={i + 1}>
                                                            {i + 1}
                                                        </option>
                                                    ))}
                                                    </select>
                                                    <a className='generic_button font20' style={{backgroundColor: '#ff7f22'}} onClick={selectOption}>Enviar</a>
                                                </>
                                            }
                                            {selectedCotizacionType == 'requested' &&
                                                <>
                                                    <span className='generic_title font30 posL' style={{margin: "10px 0px"}}>Cotización solicitada</span>
                                                    <span className='generic_description font20 posL'>{selectedCotizacion.service_id.name}</span>
                                                    <Swiper
                                                        spaceBetween={10}
                                                        pagination={{
                                                        dynamicBullets: true,
                                                        }}
                                                        modules={[Pagination]}
                                                        className="service_carousel"
                                                    >
                                                        {selectedCotizacion.service_id.img_url.map((url) => {
                                                            return(
                                                                <SwiperSlide className="service_carousel_slide"><img className="service_carousel_slide_img" src={url}/></SwiperSlide>
                                                            )
                                                        })}
                                                    </Swiper>
                                                </>
                                            }
                                            {selectedCotizacionType == 'current' &&
                                                <>
                                                    <span className='generic_title font30 posL' style={{margin: "10px 0px"}}>Proyecto actual</span>
                                                    <span className='generic_description font20 posL'>{selectedCotizacion.service_id.name}</span>
                                                    <Swiper
                                                        spaceBetween={10}
                                                        pagination={{
                                                        dynamicBullets: true,
                                                        }}
                                                        modules={[Pagination]}
                                                        className="service_carousel"
                                                    >
                                                        {selectedCotizacion.service_id.img_url.map((url) => {
                                                            return(
                                                                <SwiperSlide className="service_carousel_slide"><img className="service_carousel_slide_img" src={url}/></SwiperSlide>
                                                            )
                                                        })}
                                                    </Swiper>
                                                </>
                                            }
                                            {selectedCotizacionType == 'done' &&
                                                <>
                                                    <span className='generic_title font30 posL' style={{margin: "10px 0px"}}>Cotización finalizada</span>
                                                    <span className='generic_description font20 posL'>{selectedCotizacion.service_id.name}</span>
                                                    <Swiper
                                                        spaceBetween={10}
                                                        pagination={{
                                                        dynamicBullets: true,
                                                        }}
                                                        modules={[Pagination]}
                                                        className="service_carousel"
                                                    >
                                                        {selectedCotizacion.service_id.img_url.map((url) => {
                                                            return(
                                                                <SwiperSlide className="service_carousel_slide"><img className="service_carousel_slide_img" src={url}/></SwiperSlide>
                                                            )
                                                        })}
                                                    </Swiper>
                                                </>
                                            }
                                        </>
                                    }
                                </div>
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