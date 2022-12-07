import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import "../styles/Service.css";
import {useNavigate} from 'react-router-dom';
import { useParams } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import emailjs from 'emailjs-com';

export default function Service(props) {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loadingScreen, setLoadingScreen] = useState(true);
  const [email, setEmail] = useState(null);
  const [serviceId, setServiceId] = useState(null);
  const [serviceName, setServiceName] = useState(null);
  var locationId;
  const [listaAdministradores, setListaAdministradores] = useState(null);
  var administradores = [];
  const [correoEnviado, setCorreoEnviado] = useState(null);
  const navigate = useNavigate();

  const sendEmail = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    console.log(user);
    if(user){
      console.log("User email: " + email);
      emailjs.send("service_rqa3brt","template_91a0omn",{
      email: email,
      serviceName: serviceName,
      serviceId: serviceId,
      administradores: listaAdministradores}, 
      'a9hJXSTK7xAdC26he');
      setCorreoEnviado(`Gracias por tu interés en: ${serviceName}, un asociado se pondrá en contacto contigo en breve.`);
    }
    else{
      alert("Por favor inicia sesión o crea una cuenta");
      navigate("/login/");
    }
  }

  const showService = async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("id", id);
    setService(data[0]);
    setServiceId(data[0].id);
    setServiceName(data[0].name);
    locationId = data[0].location_id;
  };

  const getUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if(user){
      setEmail(user.email);
    }
    const { data, error } = await supabase
    .from('account')
    .select()
    .match({ role: "administrador", location_id: locationId });
    if(administradores.length >= data.length){
      console.log("administradores lleno");
      setListaAdministradores(administradores);
      setLoadingScreen(false);
    }
    else{
      for(var i = 0 ; i < data.length ; i++){
        administradores.push(data[i].email);
      }
      getUserData();
    }
  }

  useEffect(() => {
    showService();
    getUserData();
  }, [loadingScreen]);

  const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );

  return (
    <>
      {!loadingScreen ? (
        <div className="service_background">
          <div className="service_display">
            <div className="service_display_left">
              <div className="service_gallery">
                <div id="main_service_img" className="service_img">
                  <img src={service.img_url[0]} />
                </div>
                <div id="first_service_img" className="service_img">
                  <img src={service.img_url[1]} />
                </div>
                <div id="second_service_img" className="service_img">
                  <img src={service.img_url[2]} />
                </div>
                <div id="third_service_img" className="service_img">
                  <img src={service.img_url[3]} />
                </div>
                <div id="fourth_service_img" className="service_img">
                  <img src={service.img_url[4]} />
                </div>
              </div>
            </div>
            <div className="service_display_right">
              <div className="service_info">
                <h2>{service.name}</h2>
                <br />
                <span>{service.description}</span>
                <br />
                <div className="service_info_cotizar">
                  <form onSubmit={sendEmail}>
                    <input
                      type={'submit'}
                      value={'Cotizar servicio con un socio'}
                    />
                  </form>
                    <span id="email_sent">{correoEnviado}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : <LoadingScreen/>}
    </>
  );
}
