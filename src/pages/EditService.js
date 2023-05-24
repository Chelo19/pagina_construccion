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

import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

export default function EditService(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [noItems, setNoItems] = useState(false);

  const [isRegisterAlert, setIsRegisterAlert] = useState(null);
  const [prompt, setPrompt] = useState(null);
  const [promptSeverity, setPromptSeverity] = useState('success');
  // const [promptStyle, setPromptStyle] = useState(null);
  const [service, setService] = useState();

  const [newName, setNewName] = useState(null);
  const [newDescription, setNewDescription] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [categories, setCategories] = useState(null);

  const [img, setImg] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);

  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);

  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
    if(!newName && !newDescription && !categoryId && !img){
      setPromptSeverity('error');
      setPrompt('Establece un valor para actualizar');
      await timeout(2000);
      setPrompt(null);
      return;
    }
    let existingErrors = 0;
    if(newName){
      const { error } = await supabase
      .from('services')
      .update({ name: newName })
      .eq('id', id);
      if(error) existingErrors++;
      if(validError(error) == true) return;
    }
    if(newDescription){
      const { error } = await supabase
      .from('services')
      .update({ description: newDescription })
      .eq('id', id);
      if(error) existingErrors++;
      if(validError(error) == true) return;
    }
    if(categoryId){
      const { error } = await supabase
      .from('services')
      .update({ category_id: categoryId })
      .eq('id', id);
      if(error) existingErrors++;
      if(validError(error) == true) return;
    }
    if(img){
      existingErrors += updateBucket();
    }
    if(existingErrors > 0){
      setPromptSeverity('erorr');
      setPrompt('Hubo un error al actualizar');
      await timeout(2000);
      setPrompt(null);
    }
    else{
      setPromptSeverity('success');
      setPrompt('Actualizado correctamente');
      await timeout(2000);
      setPrompt(null);
      // navigate(-1);
    }
  }

  const validError = async (error) => {
    console.log('entra');
    console.log(error);
    if(error){
      setPromptSeverity('error');
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

  const deleteService = async () => {
    const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);
    if(error){
      setPromptSeverity('error');
      setPrompt(error.message);
      await timeout(2000);
      setPrompt(null);
    }
    else{
      setPromptSeverity('success');
      setPrompt('Servicio eliminado correctamente');
      await timeout(2000);
      setPrompt(null);
      navigate(-1);
    }
  }

  const updateBucket = async () => {
    let urlArray = service.img_url;
    let nums = [];
    for(let i = 0 ; i < urlArray.length ; i++){
      nums.push(parseInt(urlArray[i].split("-").reverse()[0]));
    }
    let maxNum = Math.max(...nums);
    maxNum++;
    console.log('/' + `${service.category_id.id}` + '/' + `${service.id}` + '-' + `${maxNum}`);
    const { data, error } = await supabase
    .storage
    .from('services-img')
    .upload('/' + `${service.category_id.id}` + '/' + `${service.id}` + '-' + `${maxNum}`, img[0]);
    if(!error){
      console.log(data);
      urlArray.push(`https://xadwiefldpzbsdciapia.supabase.co/storage/v1/object/public/services-img/${data.path}`);
      console.log(urlArray);
      const { error } = await supabase
      .from('services')
      .update({ img_url: urlArray })
      .eq('id', id);
      if(!error){
        setPromptSeverity('success');
        setPrompt('Imagen subida correctamente');
        await timeout(2000);
        setPrompt(null);
        document.location.reload();
      }
      else{
        setPromptSeverity('error');
        setPrompt('Error al subir a db');
        await timeout(2000);
        setPrompt(null);
        return 1;
      }
    }
    else{
      setPromptSeverity('error');
      setPrompt('Error al subir imagen');
      await timeout(2000);
      setPrompt(null);
      return 1;
    }
  }

  const deleteImg = async () => {
    let urlArray = service.img_url;
    let index = urlArray.indexOf(selectedImg);
    if (index !== -1) {
      urlArray.splice(index, 1);
    }
    const { error } = await supabase
    .from('services')
    .update({ img_url: urlArray })
    .eq('id', service.id);
    if(!error){
      setPromptSeverity('success');
      setPrompt('Imagen eliminada correctamente');
      await timeout(2000);
      setPrompt(null);
      document.location.reload();
    }
    else{
      setPromptSeverity('error');
      setPrompt('Error al eliminar imagen');
      await timeout(2000);
      setPrompt(null);
    }
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
                              <SwiperSlide className="service_carousel_slide_delete"><span><HighlightOffIcon onClick={(e) => {handleClickOpen2(); setSelectedImg(url)}}/></span><img className="service_carousel_slide_img_delete" src={url}/></SwiperSlide>
                          )
                      })}
                  </Swiper>
                  <Button className="generic_button font20"
                    variant="contained"
                    component="label" style={{backgroundColor:'#ff7f22'}}>
                    Agregar imagen 
                    <input
                      className="font20"
                      type="file"
                      accept="png, jpg, jpeg"
                      hidden
                      onChange={(e) => setImg(e.target.files)}
                    />
                  </Button>
                  {img && <span className="service_description">Nombre de la imagen: {img[0].name}</span>}
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
                  <Link className="generic_button font20" style={{backgroundColor:'#161825'}} onClick={(e) => document.location.reload()}>Limpiar seleccion</Link>
                  <Link className="generic_button font20" style={{backgroundColor:'#ff7f22'}} onClick={(e) => updateService()}>Actualizar servicio</Link>
                  <Link className='generic_button font20' style={{backgroundColor: '#ff5252'}} onClick={handleClickOpen}>
                    Eliminar servicio
                  </Link>
                  <Dialog
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                  >
                      <DialogTitle id="alert-dialog-title">
                      {"¿Quieres finalizar la cotización?"}
                      </DialogTitle>
                      <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                          ¿Estás seguro de que deseas eliminar el servicio?
                      </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                      <Button onClick={handleClose}>Regresar</Button>
                      <Button onClick={() => {deleteService(); handleClose()}} autoFocus>
                          Eliminar
                      </Button>
                      </DialogActions>
                    </Dialog>
                    <Dialog
                      open={open2}
                      onClose={handleClose2}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle id="alert-dialog-title">
                      {"¿Quieres finalizar la cotización?"}
                      </DialogTitle>
                      <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                          ¿Estás seguro de que deseas eliminar esta imagen?
                      </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                      <Button onClick={handleClose2}>Regresar</Button>
                      <Button onClick={() => {deleteImg(); handleClose2()}} autoFocus>
                          Eliminar
                      </Button>
                      </DialogActions>
                    </Dialog>
              </div>
            </div>
            {prompt &&
              <>
                  <Alert className='generic_alert' severity={`${promptSeverity}`} onClose={(e) => setPrompt(null)}>{prompt}</Alert>
              </>}
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
