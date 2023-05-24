import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase/client";
import "../styles/AddService2.css";
import LoadingScreen2 from "../components/LoadingScreen2";
import { Link } from "react-router-dom";

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


export default function AddService2(){
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    
    const [prompt, setPrompt] = useState(null);
    const [promptStyle, setPromptStyle] = useState(null);
    const [categories, setCategories] = useState(null);

    const [name, setName] = useState(null);
    const [description, setDescription] = useState(null);
    const [categoryId, setCategoryId] = useState(null);
    const [imgs, setImgs] = useState(null);
    const [imgsUrl, setImgsUrl] = useState(null);

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
        }
    }

    const getCategories = async () => {
        const { data, error } = await supabase
        .from('categories')
        .select('*');
        setCategories(data);
        setIsLoading(false);
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

    const createService = async () => {
        if(name && description && categoryId && imgs){
            const { data, error } = await supabase
            .from('services')
            .insert({ name: name, description: description, category_id: categoryId })
            .select();
            if(!error){
                updateBucket(data[0]);
                setPromptStyle({backgroundColor: '#ff7f22'});
                setPrompt('Creando servicio...');
            }
            else{
                console.log(error);
                setPromptStyle({backgroundColor: '#161825'});
                setPrompt('Intenta de nuevo');
                await timeout(2000);
                setPrompt(null);
            }
        }
        else{
            setPromptStyle({backgroundColor: '#161825'});
            setPrompt('Faltan campos por llenar');
            await timeout(2000);
            setPrompt(null);
        }
    }

    const updateBucket = async (service) => {
        let haveError = false;
        let urlsArray = [];
        for(let i = 0 ; i < imgs.length ; i++){
            const { data, error } = await supabase
            .storage
            .from('services-img')
            .upload('/' + `${service.category_id}` + '/' + `${service.id}` + '-' + i, imgs[i]);
            urlsArray.push(`https://xadwiefldpzbsdciapia.supabase.co/storage/v1/object/public/services-img/${data.path}`);
            console.log(data);
            if(error) haveError = true;
        }
        if(!haveError){
            updateUrl(urlsArray, service);
        }
        else{
            setPromptStyle({backgroundColor: '#161825'});
            setPrompt('Ocurrió un error al subir img');
            await timeout(2000);
            setPrompt(null);
        }
    }

    const updateUrl = async (urlsArray, service) => {
        const { error } = await supabase
        .from('services')
        .update({ img_url: urlsArray })
        .eq('id', service.id);
        if(!error){
            setPromptStyle({backgroundColor: '#77DD77'});
            setPrompt('Servicio creado');
            await timeout(2000);
            setPrompt(null);
            navigate('/webpage-services')
        }
        else{
            setPromptStyle({backgroundColor: '#161825'});
            setPrompt('Error al actualizar la DB');
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
            <div className="add_service2_background">
                <div className="add_service2_container">
                    <div className="add_service2_form">
                        <span id="add_service2_form_title" className="add_service2_form_span">Agregar un servicio</span>
                        <TextField className='add_service2_form_item' label="Nombre" variant="outlined" onChange={(e) => setName(e.target.value)}/>
                        <TextField className='add_service2_form_item' label="Descripción" multiline rows={4} onChange={(e) => setDescription(e.target.value)}/>
                        <FormControl className='add_service2_form_item'>
                                    <InputLabel>Categoría</InputLabel>
                                    <Select
                                    color='primary'
                                    value={categoryId}
                                    onChange={handleChange}
                                    input={<OutlinedInput label="Categorías"/>}
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
                        <span className="add_service2_form_span">Agregar Imágenes</span>
                        <Button
                        // className="add_service2_form_item"
                        // id="add_service2_form_input"
                        className="generic_button font20"
                        variant="contained"
                        component="label"
                        >
                            Agregar &nbsp;<AddAPhotoOutlinedIcon/>
                            <input
                                className="font20"
                                type="file"
                                accept="png, jpg, jpeg"
                                multiple="multiple"
                                hidden
                                onChange={(e) => setImgs(e.target.files)}
                            />
                        </Button>
                        {/* <Button
                        className="add_service2_form_item"
                        variant="contained"
                        component="label"
                        endIcon={<SendIcon />}
                        onClick={createService}
                        >Enviar</Button> */}
                        <Link className="generic_button font20" style={{backgroundColor:'#ff7f22'}} onClick={(e) => createService()}>Crear servicio</Link>

                    </div>
                </div>
                {prompt &&
                    <div className="reg_log_prompt" style={promptStyle}>
                        {prompt}
                    </div>
                }
            </div>
            :
            <LoadingScreen2/>
        }
        </>
    )
}