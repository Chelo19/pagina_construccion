import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase/client";
import "../styles/Service2.css";
import "../styles/NoItems.css";
import LoadingScreen2 from "../components/LoadingScreen2";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import 'swiper/css';
import 'swiper/css/pagination';

import TurnLeftOutlinedIcon from '@mui/icons-material/TurnLeftOutlined';

export default function Service2(){
    const { id } = useParams();

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isRegisterAlert, setIsRegisterAlert] = useState(null);
    const [noItems, setNoItems] = useState(false);

    const [prompt, setPrompt] = useState(null);
    const [promptStyle, setPromptStyle] = useState(null);
    const [service, setService] = useState();

    useEffect(() => {
        showServices();
    }, []);

    const showServices = async () => {
        const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("id", id)
        .not('img_url', 'is', null);
        setService(data[0]);
        console.log(data[0]);
        if(data.length > 0){
            setIsLoading(false);
        }
        else{
            setNoItems(true);
            setIsLoading(false);
        }
    };

    const tryCreateCotizacion = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(user){
            const { data, error } = await supabase
            .from('cotizaciones')
            .select('*')
            .match({ account_email: user.email, service_id: id });
            if(data.length > 0){
                setPromptStyle({backgroundColor: '#161825'});
                setPrompt('Ya tienes una cotización pendiente');
                await timeout(2000);
                setPrompt(null);
                return;
            }
            else{
                createCotizacion(user);
            }
        }
        else{
            setIsRegisterAlert(true);
        }
    }

    const createCotizacion = async (user) => {
        const { error } = await supabase
        .from('cotizaciones')
        .insert({ account_email: user.email, service_id: id })
        setPromptStyle({backgroundColor: '#ff7f22'});
        setPrompt('Creando cotizacion');
        if(!error){
            setPromptStyle({backgroundColor: '#77DD77'});
            setPrompt('Exitoso');
            await timeout(2000);
            setPrompt(null);
            navigate('/categories2');
        }
        else{
            console.log(error);
            setPromptStyle({backgroundColor: '#161825'});
            setPrompt('Intenta de nuevo');
            await timeout(2000);
            setPrompt(null);
        }
    }

    function timeout(number) {
        return new Promise( res => setTimeout(res, number) );
    }

    return(
        <>
        {!isLoading ?
        <>
            {!isRegisterAlert ?
                <div className="service_background">
                    <div className="service_container">
                        <div className="service_body">
                            <div className="service_title">{service.name}</div>
                            <Swiper
                                spaceBetween={10}
                                pagination={{
                                dynamicBullets: true,
                                }}
                                modules={[Pagination]}
                                className="service_carousel"
                            >
                                {service.img_url.map((url) => {
                                    return(
                                        <SwiperSlide className="service_carousel_slide"><img className="service_carousel_slide_img" src={url}/></SwiperSlide>
                                    )
                                })}
                            </Swiper>
                            <div className="service_description">{service.description}</div>
                            <Link className="service_button" onClick={tryCreateCotizacion}>Cotizar servicio</Link>
                        </div>
                    </div>
                    {prompt &&
                        <div className="reg_log_prompt" style={promptStyle}>
                            {prompt}
                        </div>}
                </div>
                :
                <div className='no_items_reg_log_background'>
                    <div className='no_items_container'>
                    <div className='no_items_img'>
                        <img src={require('../img/supervision.png')}/>
                    </div>
                    <div className='no_items_spans'>
                        <span className='no_items_span_title'>Inicia sesión o regístrate</span>
                        <span className='no_items_span_text'>Nos encantaría que fueras parte de nuestra familia, puedes registrarte con el botón de abajo ¡es gratis!</span>
                    </div>
                    <div className="no_items_buttons">
                        <Link to={'/login'} className="no_items_button" id="no_items_button_one">
                            Iniciar Sesión
                        </Link>
                        <Link to={'/register'} className="no_items_button" id="no_items_button_two">
                            Registrarse
                        </Link>
                        <Link onClick={(e) => setIsRegisterAlert(false)} className="no_items_button" id="no_items_button_return">
                            Regresar <TurnLeftOutlinedIcon/>
                        </Link>
                    </div>
                </div>
        </div>
            }
        </>
        :
            <LoadingScreen2/>
        }
        </>
    )
}