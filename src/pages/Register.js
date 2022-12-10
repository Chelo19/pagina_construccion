import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";
import LoadingScreen from '../components/LoadingScreen';

function Register() {

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [name, setName] = useState(null);
  const [phone, setPhone] = useState(null);
  const [locationId, setLocationId] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingScreen, setLoadingScreen] = useState(true);
  const [registerAlert, setRegisterAlert] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getUserMethod();
  }, [loadingScreen]);

  const getUserMethod = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) navigate("/");
    setLoadingScreen(false);
  };

  const hangleSignUp = async (e) => {
    e.preventDefault();
    if(email && password && name && phone && locationId){
      try {
        const { data, error } = await supabase.auth.signUp({email, password});
        if (error) throw error;
  
        insertDb();
      } catch (e) {
        window.alert(e.message);
      }
    }
    else{
      setRegisterAlert("Favor de llenar todos los campos");
    }
  };

  const insertDb = async () => {
    console.log("Entra a insertDB");
    console.log(email);
    console.log(name);
    console.log(locationId);
    console.log(phone);
    const { error } = await supabase
    .from("account")
    .insert({ email: email, name: name, location_id: locationId, phone: phone });
    setRegisterAlert("Te has registrado exitosamente");
    console.log(error);
    navigate('/');
  }

  return (
    <div className="register_background">
      {!loadingScreen ? 
      <div className="register_container">
        <div className="register_container_center">
          <div className="register_img_div">
            <img
              id="register_img"
              src={require("../img/construction_img2.jpg")}
            />
          </div>
          <div className="register_right">
            <div className="register_form">
              <h2>Registrarse</h2>
              <div className="register_input">
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  placeholder="tuemail@gmail.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="register_input">
                <span>Contraseña</span>
                <input
                  type="password"
                  name="password"
                  placeholder="contraseña"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="register_input">
                <span>Nombre</span>
                <input
                  type="text"
                  name="name"
                  placeholder="nombre"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="register_input">
                <span>Teléfono</span>
                <input
                  type="tel"
                  name="phone"
                  placeholder="999-999-999"
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="register_input">
                <span>Localización</span>
                <select
                  name="location"
                  onChange={(e) => setLocationId(e.target.value)}
                >
                  <option value={"1"}>Localización</option>
                  <option value={"1"}>Monterrey</option>
                  <option value={"2"}>Sabinas</option>
                  <option value={"3"}>Nuevo Laredo</option>
                </select>
              </div>
              <div id="register_button">
                <a href="#" onClick={hangleSignUp}>
                  Registrarse
                </a>
              </div>
              <br />
              <div className="register_input">
                ¿Ya tienes una cuenta?&nbsp;
                <a Link to="/login/" onClick={() => navigate(`/login`)}>Haz click aquí</a>
              </div>
              <div className="register_alert">
                <span>{registerAlert}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      : <LoadingScreen/>}
    </div>
  );
}

export default Register;
