import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";
import LoadingScreen from '../components/LoadingScreen';
import { Link } from "react-router-dom";

function Register() {

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [name, setName] = useState(null);
  const [phone, setPhone] = useState(null);
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [location, setLocation] = useState(null);

  const [registerAlert, setRegisterAlert] = useState(null);

  
  const [newLocationId, setNewLocationId] = useState(null);
  const [locationName, setLocationName] = useState(null);
  const [isChangingLocation, setIsChangingLocation] = useState(false);
  const [isAnotherLocation, setIsAnotherLocation] = useState(false);
  const [countries, setCountries] = useState(null);
  const [newCountry, setNewCountry] = useState(null);
  const [states, setStates] = useState(null);
  const [locations, setLocations] = useState(null);
  const [newState, setNewState] = useState(null);
  const [newLocation, setNewLocation] = useState(null);
  const [newLocationAnother, setNewLocationAnother] = useState(null);
  const [renderStates, setRenderStates] = useState(false);
  const [renderInput, setRenderInput] = useState(false);
  const [renderSubmit, setRenderSubmit] = useState(false);
  const [gotLocation, setGotLocation] = useState(false);
  var newLocationIdInsert;
  var locationId = null;
  var newCountryName;
  var newCountryId;
  var newStateId;
  var locationsArray = [];
  var userUuid;

  const [loadingScreen, setLoadingScreen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkIfUser();
    getCountryData();
  }, [loadingScreen]);

  const checkIfUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) navigate("/");
    setLoadingScreen(false);
  };

  

  // const hangleSignUp = async (e) => {
  //   e.preventDefault();
  //   if(email && password && name && phone && locationId){
  //     try {
  //       const { data, error } = await supabase.auth.signUp({email, password});
  //       if (error) throw error;
  
  //       insertDb();
  //     } catch (e) {
  //       window.alert(e.message);
  //     }
  //   }
  //   else{
  //     if(locationId == 0 || locationId == null){
  //       setRegisterAlert("Por favor selecciona una localización válida");
  //       return;
  //     }
  //     setRegisterAlert("Favor de llenar todos los campos");
  //   }
  // };

  const updateLocation = async () => {
    console.log("Log: " + email + password + name + phone + newLocationIdInsert);
    console.log(newLocationIdInsert);
    if(email && password && name && phone && newLocationIdInsert){
      console.log("registrarse");
      const { data, error } = await supabase.auth.signUp({email, password});
      userUuid = data.user.id;
      if(error){
        window.alert("Ha ocurrido un error inesperado");
      }
      if(!error){
        insertAccount();
      }
    }
}

const insertAccount = async () => {
  const { error } = await supabase
  .from('account')
  .insert({ name: name, phone: phone, email: email, location_id: newLocationIdInsert, uuid: userUuid });
  console.log(error);
  if(!error){
    console.log("Registrado exitosamente");
    navigate('/');
  }
  if(error){
    window.alert("Ha ocurrido un error inesperado");
  }
}

const getLocationName = async () => {
    const { data, error } = await supabase
    .from('location')
    .select()
    .eq('id', locationId);
    setLocationName(data[0].name);
}

const getCountryData = async () => {
    let data = require('../assets/country-states-data.json');
    setCountries(data);
}

const getStatesData = async () => {
    let data = require('../assets/country-states-data.json');
    setStates(data[newCountry].states);
}

const getLocationData = async () => {
    if(!gotLocation){
        setGotLocation(true);
        const { data, error } = await supabase
        .from('states')
        .select('id')
        .eq('name', newState);
        if(data.length == 0){
            console.log("nodata");
            setLocations([{name: 'Localización'}, {name: 'Otro'}])
        }
        newStateId = data[0].id;
        getLocations();
    }
}

const getLocations = async () => {
    const { data, error } = await supabase
    .from('location')
    .select()
    .eq('state_id', newStateId);
    locationsArray = data;
    locationsArray.push({name: 'Otro'});
    let newArray = [
        ...locationsArray.slice(0, 0),
        {name: 'Localización'},
        ...locationsArray.slice(0)
    ]
    setLocations(newArray);
    if(data.length == 0){
        console.log("VACIO");
    }
    else{
        console.log("HAY");
    }
}

const changeLocation = async () => {
  checkCountry();
  updateLocation();
}

const checkCountry = async () => {
  newCountryName = countries[newCountry].country_name;
  const { data, error } = await supabase
  .from('countries')
  .select()
  .eq('name', newCountryName);
  if(data.length == 0){
      console.log("No existe pais");
      const { error } = await supabase
      .from('countries')
      .insert({ name: newCountryName });
      console.log(error);
      checkCountry();
  }
  else{
      newCountryId = data[0].id;
      checkState();
  }
}

const checkState = async () => {
    const { data, error } = await supabase
    .from('states')
    .select()
    .eq('name', newState);
    if(data.length == 0){
        console.log("No existe estado");
        const { error } = await supabase
        .from('states')
        .insert({ name: newState, country_id: newCountryId});
        console.log(error);
        checkState();
    }
    else{
        checkLocation();
    }
}

const checkLocation = async () => {
    for(var i = 0 ; i < locations.length ; i++){
        if(isAnotherLocation){
            if(locations[i].name == newLocationAnother){
                console.log("Ya existe uno igual");
                newLocationIdInsert = locations[i].id;
                updateLocation();
                return;
            }
        }
        else{
            if(locations[i].name == newLocation){
                console.log("Ya existe uno igual no anotherloc");
                console.log(locations[i].id);
                newLocationIdInsert = locations[i].id;
                updateLocation();
                return;
            }
        }
    }
    console.log("PASA POR AQUI");
    const { data, error } = await supabase
    .from('states')
    .select('id')
    .eq('name', newState);
    newStateId = data[0].id;
    insertLocation();
    checkNewLocation();
}

const checkNewLocation = async () => {
    const { data, error } = await supabase
    .from('location')
    .select('id')
    .eq('name', newLocationAnother);
    newLocationIdInsert = data[0].id;
    updateLocation();
}

const insertLocation = async () => {
    const { error } = await supabase
    .from('location')
    .insert({ name: newLocationAnother, state_id: newStateId});
}

useEffect(() => {
    if(newCountry){
        getStatesData();
        setRenderStates(true);
    }
    else{
        setRenderStates(false);
    }
    if(newState){
        getLocationData();
        setRenderInput(true);
    }
    else{
        setRenderInput(false);
    }
    if(newLocationAnother){
        setRenderSubmit(true);
    }
    else{
        setRenderSubmit(false);
    }
    if(newLocation){
        if(newLocation == "Localización"){
            setNewLocation(null);
            setIsAnotherLocation(false);
            return;
        }
        if(newLocation == "Otro"){
            setIsAnotherLocation(true);
            return;
        }
        setIsAnotherLocation(false);
        setRenderSubmit(true);
    }
    else{
        setRenderSubmit(false);
    }
})


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
                  <span>País</span>
                  <select onChange={(e) => {setNewCountry(e.target.value); setStates([])}}>
                  {countries.map((country) => {
                      return(
                          <option key={country.country_id} value={country.country_id}>{country.country_name}</option>
                      )
                  })}
                  </select>
              </div>
              {renderStates &&
                  <div className="register_input">
                      <span>Estado</span>
                      <select onChange={(e) => {setNewState(e.target.value); setNewLocation(null); getLocationData(); setLocations([]); 
                          setGotLocation(false)}}>
                      {states.map((state) => {
                          return(
                              <option value={state.state_name}>{state.state_name}</option>
                          )
                      })}
                      </select>
                  </div>
              }
              {renderInput &&
                  <div className="register_input">
                      <span>Localidad</span>
                      <select onChange={(e) => {setNewLocation(e.target.value)}}>
                      {locations.map((location) => {
                          return(
                              <option value={location.name}>{location.name}</option>
                          )
                      })}
                      </select>
                  </div>
              }
              {isAnotherLocation &&
                  <div className="register_input">
                      <span>Otra</span>
                      <input
                      type={'text'}
                      placeholder={"Localización"}
                      onChange={(e) => setNewLocationAnother(e.target.value)}
                      />
                  </div>
              }
              
              {renderSubmit &&
                <div id="register_button">
                  <a id="register_button" onClick={changeLocation}>Registrarse</a>
                </div>
              }
              <div className='register_input'>
                ¿Quieres volver al inicio de sesión?&nbsp;
                <Link to={"/login/"}>Haz click aquí</Link>
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
