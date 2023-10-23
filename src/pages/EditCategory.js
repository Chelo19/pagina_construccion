import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { useNavigate, useParams } from "react-router-dom";
import LoadingScreen2 from "../components/LoadingScreen2";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import 'swiper/css';
import 'swiper/css/pagination';
import TurnLeftOutlinedIcon from '@mui/icons-material/TurnLeftOutlined';
import TextField from '@mui/material/TextField';

import Button from '@mui/material/Button';
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';

export default function EditCategory(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [noItems, setNoItems] = useState(false);

  const [isRegisterAlert, setIsRegisterAlert] = useState(null);
  const [prompt, setPrompt] = useState(null);
  const [promptSeverity, setPromptSeverity] = useState('success');
  // const [promptStyle, setPromptStyle] = useState(null);
  const [category, setCategory] = useState();

  const [newName, setNewName] = useState(null);
  const [img, setImg] = useState(null);

  const [open, setOpen] = React.useState(false);
  
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
      getProject();
    }
    else{
        window.alert("No puedes acceder a este lugar");
        console.log(user);
    }
}

  const getProject = async () => {
    const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .not('img_url', 'is', null);
    setCategory(data[0]);
    console.log(data[0]);
    if(data.length > 0){
      setIsLoading(false);
    }
    else{
      setNoItems(true);
      setIsLoading(false);
    }
  }

  const updateCategory = async () => {
    if(newName){
      const { error } = await supabase
      .from('categories')
      .update({ name: newName })
      .eq('id', id);
      validError(error);
    }
    if(img){
      const { data, error } = await supabase
      .storage
      .from('categories-img')
      .update(id, img[0], {
        cacheControl: '3600',
        upsert: true
      })
      console.log(data);
      validError(error);
    }
    if(!newName && !img){
      setPromptSeverity('error');
      setPrompt('Ingresa datos para actualizar');
      await timeout(2000);
      setPrompt(null);
    }
  }

  const validError = async (error) => {
    if(error){
      // setPromptStyle({backgroundColor: '#161825'});
      setPromptSeverity('error');
      setPrompt('Error al actualizar');
      await timeout(2000);
      setPrompt(null);
      return;
    }
    else{
      // setPromptStyle({backgroundColor: '#77DD77'});
      setPromptSeverity('success');
      setPrompt('Actualizado correctamente');
      await timeout(2000);
      setPrompt(null);
      navigate(-1);
      return;
    }
  }

  function timeout(number) {
    return new Promise( res => setTimeout(res, number) );
  }

  const deleteCategory = async () => {
    const { error } = await supabase
    .from('categories')
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
      setPrompt('Categoría eliminada correctamente');
      await timeout(2000);
      setPrompt(null);
      navigate(-1);
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
                  <div className="service_title">{category.name}</div>
                  <TextField className='request_ally_input' label="Nuevo Nombre" variant="outlined" onChange={(e) => setNewName(e.target.value)} />
                  <Swiper
                      spaceBetween={10}
                      pagination={{
                      dynamicBullets: true,
                      }}
                      modules={[Pagination]}
                      className="service_carousel"
                  >
                      {category.img_url.map((url) => {
                          return(
                              <SwiperSlide className="service_carousel_slide"><img className="service_carousel_slide_img" src={url}/></SwiperSlide>
                          )
                      })}
                  </Swiper>
                  <Button className="generic_button font20"
                    variant="contained"
                    component="label" style={{backgroundColor:'#ff7f22'}}>
                    Actualizar imagen 
                    <input
                      className="font20"
                      type="file"
                      accept="png, jpg, jpeg"
                      hidden
                      onChange={(e) => setImg(e.target.files)}
                    />
                  </Button>
                  {img && <span className="service_description">Nombre de la imagen: {img[0].name}</span>}
                  <Link className="generic_button font20" style={{backgroundColor:'#ff7f22'}} onClick={(e) => updateCategory()}>Actualizar categoría</Link>
                  <Link className='generic_button font20' style={{backgroundColor: '#ff5252'}} onClick={handleClickOpen}>
                    Eliminar categoría
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
                          ¿Estás seguro de que deseas eliminar la categoría?
                      </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                      <Button onClick={handleClose}>Regresar</Button>
                      <Button onClick={() => {deleteCategory(); handleClose()}} autoFocus>
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
