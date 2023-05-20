import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { useNavigate, useParams } from "react-router-dom";
import LoadingScreen2 from "../components/LoadingScreen2";
import "../styles/EditService.css";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import 'swiper/css';
import 'swiper/css/pagination';
import TurnLeftOutlinedIcon from '@mui/icons-material/TurnLeftOutlined';
import TextField from '@mui/material/TextField';

import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import { ThemeProvider, createTheme } from '@mui/material/styles';

export default function EditService(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [noItems, setNoItems] = useState(false);

  const [isRegisterAlert, setIsRegisterAlert] = useState(null);
  const [prompt, setPrompt] = useState(null);
  const [promptStyle, setPromptStyle] = useState(null);
  const [service, setService] = useState();

  const [newName, setNewName] = useState(null);
  const [newDescription, setNewDescription] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
    .from('account')
    .select()
    .match({ uuid: user.id });
    if(data[0].role == 'administrador' || data[0].role == 'gerente'){
      getCategories();
    }
    else{
        window.alert("No puedes acceder a este lugar");
        console.log(user);
    }
}

const getCategories = async () => {
  const { data, error } = await supabase
  .from('categories')
  .select('*');
  setCategories(data);
  console.log(data);
  getProject();
}

  const getProject = async () => {
    const { data, error } = await supabase
    .from("services")
    .select("*, category_id(*)")
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
  }

  const updateService = async () => {
    if(newName){
      const { error } = await supabase
      .from('services')
      .update({ name: newName })
      .eq('id', id);
      if(validError(error) == true) return;
    }
    if(newDescription){
      const { error } = await supabase
      .from('services')
      .update({ description: newDescription })
      .eq('id', id);
      if(validError(error) == true) return;
    }
    if(categoryId){
      const { error } = await supabase
      .from('services')
      .update({ category_id: categoryId })
      .eq('id', id);
      if(validError(error) == true) return;
    }
    setPromptStyle({backgroundColor: '#77DD77'});
    setPrompt('Actualizado correctamente');
    await timeout(2000);
    setPrompt(null);
    navigate(-1);
  }

  const validError = async (error) => {
    console.log('entra');
    console.log(error);
    if(error){
      setPromptStyle({backgroundColor: '#161825'});
      setPrompt('Error al actualizar');
      await timeout(2000);
      setPrompt(null);
      return true;
    }
    else{
      return false;
    }
  }

  function timeout(number) {
    return new Promise( res => setTimeout(res, number) );
  }

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setCategoryId(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
  PaperProps: {
          style: {
          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
          width: 250,
          },
      },
  };

  return(
    <>
    {!isLoading ?
    <>
      {!isRegisterAlert ?
        <div className="service_background">
            <div className="service_container">
              <div className="service_body">
                  <div className="service_title">{service.name}</div>
                  <TextField className='request_ally_input' label="Nuevo Nombre" variant="outlined" onChange={(e) => setNewName(e.target.value)} />
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
                  <TextField className='request_ally_input' label="Nueva Descripción" variant="outlined" onChange={(e) => setNewDescription(e.target.value)} />
                  <div className="service_description">{service.category_id.name}</div>
                  <FormControl className='add_service2_form_item'>
                    <InputLabel>Nueva Categoría</InputLabel>
                    <Select
                    color='primary'
                    value={categoryId}
                    onChange={handleChange}
                    input={<OutlinedInput label="Nueva Categoría"/>}
                    MenuProps={MenuProps}
                    >
                    {categories.map((category) => (
                        <MenuItem
                        key={category.id}
                        value={category.id}
                        >
                        {category.name}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                  <Link className="service_button" onClick={(e) => updateService()}>Actualizar servicio</Link>
                  <Link className="service_button" style={{backgroundColor:'#161825'}} onClick={(e) => document.location.reload()}>Limpiar seleccion</Link>
              </div>
            </div>
            {prompt &&
            <div className="reg_log_prompt" style={promptStyle}>
                {prompt}
            </div>}
        </div>
        :
        <>
          Hubo un problema
        </>
      }
    </>
    :
      <LoadingScreen2/>
    }
    </>
  )
}
