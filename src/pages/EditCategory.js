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

export default function EditCategory(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [noItems, setNoItems] = useState(false);

  const [isRegisterAlert, setIsRegisterAlert] = useState(null);
  const [prompt, setPrompt] = useState(null);
  const [promptStyle, setPromptStyle] = useState(null);
  const [category, setCategory] = useState();

  const [newName, setNewName] = useState(null);

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
  }

  const validError = async (error) => {
    if(error){
      setPromptStyle({backgroundColor: '#161825'});
      setPrompt('Error al actualizar');
      await timeout(2000);
      setPrompt(null);
      return;
    }
    else{
      setPromptStyle({backgroundColor: '#77DD77'});
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
                  <Link className="service_button" onClick={(e) => updateCategory()}>Actualizar servicio</Link>
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
