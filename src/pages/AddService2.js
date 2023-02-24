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


    console.log(name);
    console.log(description);
    console.log(imgs);
    console.log(categoryId);

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
                                    input={<OutlinedInput label="Categorías" />}
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
                        className="add_service2_form_item"
                        id="add_service2_form_input"
                        variant="contained"
                        component="label"
                        >
                            Agregar &nbsp;<AddAPhotoOutlinedIcon/>
                            <input
                                type="file"
                                accept="png, jpg, jpeg"
                                multiple="multiple"
                                hidden
                                onChange={(e) => setImgs(e.target.files)}
                            />
                        </Button>
                        <Button
                        className="add_service2_form_item"
                        variant="contained"
                        component="label"
                        endIcon={<SendIcon />}
                        >Enviar</Button>
                    </div>
                </div>
            </div>
            :
            <LoadingScreen2/>
        }
        </>
    )
}