import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";
import LoadingScreen from '../components/LoadingScreen';

function Register() {

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [name, setName] = useState(null);
  const [location, setLocation] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingScreen, setLoadingScreen] = useState(true);
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

    try {
      const { data, error } = await supabase.auth.signUp({email, password}, {emailRedirectTo: 'http://grupodrec.com/#/confirmed-email'});
      if (error) throw error;
      alert("¡Revisa tu email para confirmar tu cuenta!");

      const { errorInsert } = await supabase
        .from("account")
        .insert({ email: email, name: name, location: location });
    } catch (e) {
      alert(e.message);
    }
  };

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
                <span>Localización</span>
                <select
                  name="location"
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value={"Monterrey"}>Localización</option>
                  <option value={"Monterrey"}>Monterrey</option>
                  <option value={"Sabinas"}>Sabinas</option>
                  <option value={"Nuevo Laredo"}>Nuevo Laredo</option>
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
            </div>
          </div>
        </div>
      </div>
      : <LoadingScreen/>}
    </div>
  );
}

export default Register;
