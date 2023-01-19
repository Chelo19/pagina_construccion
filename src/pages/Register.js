import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";
import LoadingScreen from '../components/LoadingScreen';
import { Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confPassword, setConfPassword] = useState(null);
  const [name, setName] = useState(null);
  const [phone, setPhone] = useState(null);

  const [prompt, setPrompt] = useState(null);
  const [proptStyle, setPropmtStyle] = useState(null);
  
  const register = async () => {
    if(email && name && password && confPassword && phone){
      if(password == confPassword){
        setPropmtStyle({backgroundColor: '#fa996c'});
        setPrompt('Creando perfil...');
        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password,
        })
        if(error){
          setPropmtStyle({backgroundColor: '#fa996c'});
          setPrompt('Ocurrió un error al crear tu perfil');
          await timeout(2000);
          setPrompt(null)
        }
        else addToDb(data.user.id);
      }
      else{
        setPropmtStyle({backgroundColor: '#fa996c'});
        setPrompt('Las contraseñas no coinciden');
        await timeout(2000);
        setPrompt(null)
      }
    }
    else{
      setPropmtStyle({backgroundColor: '#fa996c'});
      setPrompt('Faltan campos por llenar');
      await timeout(2000);
      setPrompt(null)
    }
  }

  const addToDb = async (uuid) => {
    const { error } = await supabase
    .from('account')
    .insert({ email: email, name: name, phone: phone, role: 'cliente', uuid: uuid, location_id: 1});
    if(!error){
      setPropmtStyle({backgroundColor: '#77DD77'});
      setPrompt('Perfil creado con éxito');
      await timeout(2000);
      setPrompt(null)
      navigate('/')
    }
  }

  function timeout(number) {
    return new Promise( res => setTimeout(res, number) );
  }

  return (
    <div className="register_background">
      <div className="register_background_container">
        <div className="register_container">
          <div className="register_logo">
            <img src={require('../img/logodrecfullsize.png')}/>
          </div>
          <div className="register_title">
            <span>
              Crear perfil
            </span>
          </div>
          <div className="register_form">
            <div className="register_input">
              <span>
                Correo
              </span>
              <input
                type={'email'}
                placeholder={'tuemail@gmail.com'}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="register_input">
              <span>
                Nombre
              </span>
              <input
                type={'text'}
                placeholder={'Nombre'}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="register_input">
              <span>
                Contraseña
              </span>
              <input
                type={'password'}
                placeholder={'Contraseña'}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="register_input">
              <span>
                Confirmar Contraseña
              </span>
              <input
                type={'password'}
                placeholder={'Confirmar contraseña'}
                onChange={(e) => setConfPassword(e.target.value)}
                />
            </div>
            <div className="register_input">
              <span>
                Telefono
              </span>
              <input type="tel"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                required
                placeholder={'1234567890'}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
          <Link id="register_submit" onClick={register}>
            Crear Perfil
          </Link>
          <div className='register_options'>
            ¿Ya tienes un perfil?&nbsp;
            <Link to={"/login/"}>Haz click aquí</Link>
          </div>
        </div>
        {prompt &&
        <div className="register_prompt" style={proptStyle}>
          {prompt}
        </div>}
      </div>  
    </div>
  );
}

export default Register;
