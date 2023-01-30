import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate, useParams} from 'react-router-dom';
import '../styles/RequestAlly.css';
import LoadingScreen2 from '../components/LoadingScreen2';
import { Link } from "react-router-dom";

import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { ThemeProvider, createTheme } from '@mui/material/styles';

export default function RequestAlly(){
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    const [isInfo, setIsInfo] = useState(true);

    const [categories, setCategories] = useState(null);
    const [enterpriseName, setEnterpriseName] = useState(null);
    const [rfc, setRfc] = useState(null);

    useEffect(() => {
        getUser();
    }, []);

    const getUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
        .from('account')
        .select()
        .match({ uuid: user.id });
        if(data[0].role == 'cliente'){
            getCategories();
        }
        else{
            window.alert("No puedes solicitar ser aliado");
        }
    }

    const getCategories = async () => {
        const { data, error } = await supabase
        .from('categories')
        .select('*');
        console.log(data);
        setCategories(data);
        setIsLoading(false);
    }

    //

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
      
    function getStyles(name, response, theme) {
    return {
        fontWeight:
        response.indexOf(name) === -1
            ? theme.typography.fontWeightRegular
            : theme.typography.fontWeightMedium,
        };
    }

    const theme = createTheme();
    const [response, setResponse] = useState([]);

    const handleChange = (event) => {
        const {
          target: { value },
        } = event;
        setResponse(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
    };
    
    //

    const [planSelection, setPlanSelection] = useState(null);
    const [anualStyle, setAnualStyle] = useState(null);
    const [monthlyStyle, setMonthlyStyle] = useState(null);

    const changePlanSelection = (selection) => {
        if(selection == 'monthly'){
            setPlanSelection(1);
            setMonthlyStyle({border: '1px solid #ff7f22'});
            setAnualStyle({border: '1px solid rgba(0, 0, 0, 0.2)'});
        }
        if(selection == 'anual'){
            setPlanSelection(2);
            setAnualStyle({border: '1px solid #ff7f22'});
            setMonthlyStyle({border: '1px solid rgba(0, 0, 0, 0.2)'});
        }
    }
    
    const [prompt, setPrompt] = useState(null);
    const [promptStyle, setPromptStyle] = useState(null);

    const sendRequest = async () => {
        console.log(enterpriseName);
        console.log(rfc);
        console.log(response);
        console.log(planSelection);
        if(enterpriseName && rfc && response && planSelection){
            console.log('cumple');
            setPromptStyle({backgroundColor: '#77DD77'});
            setPrompt('Solicitud enviada');
            await timeout(2000);
            setPrompt(null);
        }
        else{
            setPromptStyle({backgroundColor: '#161825'});
            setPrompt('Faltan campos por llenar');
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
                <div className='request_ally_background'>
                    <div className='request_ally_container'>
                        {isInfo ?
                        <>
                            <span id='request_ally_info_title'>¿Qué es un aliado?</span>
                            <div className='request_ally_info'>
                                <p>Un <span className='request_ally_info_orange'>aliado</span> es aquel usuario que realiza servicios en el área de la construcción por medio de una empresa o de forma independiente y desea llegar a clientes de una manera alternativa.</p>
                                <p><span className='request_ally_info_orange'>DREC</span> ofrece beneficios a sus aliados como la captación de clientes y talento en cualquier lugar donde <span className='request_ally_info_orange'>DREC</span> ya está establecido, eventos exlcusivos y la posibilidad de entrar al "programa <span className='request_ally_info_orange'>DREC</span> quality".</p>
                                <p>Los <span className='request_ally_info_orange'>aliados</span> cubren la inversión de una membresía mensual o anual que inicia cuando obtienen su primer servicio con <span className='request_ally_info_orange'>DREC</span>.</p>
                            </div>
                            <a className='request_ally_button' onClick={(e) => setIsInfo(false)}>
                                Quiero ser aliado
                            </a>
                        </>    
                    :
                        <>
                            <span id='request_ally_info_title'>Crear perfil de aliado</span>
                            <div className='request_ally_form'>
                                <TextField className='request_ally_input' label="Nombre de la empresa" variant="outlined" onChange={(e) => setEnterpriseName(e.target.value)} />
                                <TextField className='request_ally_input' label="RFC" variant="outlined" onChange={(e) => setRfc(e.target.value.toUpperCase())} />
                                <FormControl sx={{ m: 1 }} className='request_ally_input'>
                                    <InputLabel>Categorías</InputLabel>
                                    <Select
                                    multiple
                                    color='primary'
                                    value={response}
                                    onChange={handleChange}
                                    input={<OutlinedInput label="Categorías" />}
                                    MenuProps={MenuProps}
                                    >
                                    {categories.map((category) => (
                                        <MenuItem
                                        key={category.id}
                                        value={category.name}
                                        style={getStyles(category, response, theme)}
                                        >
                                        {category.name}
                                        </MenuItem>
                                    ))}
                                    </Select>
                                </FormControl>
                            </div>
                            <span id='request_ally_info_title'>Planes</span>
                            <div className='request_ally_info_request'>
                                <div className='request_ally_info_request_item' onClick={(e) => changePlanSelection('monthly')} style={monthlyStyle}>
                                    <span id='request_ally_info_request_item_title'>Membresía mensual</span>
                                    <span id='request_ally_info_request_item_price'>$499 por mes</span>
                                    <span id='request_ally_info_request_item_text'>Inicia cuando obtienes tu primer servicio con DREC</span>
                                </div>
                                <div className='request_ally_info_request_item' onClick={(e) => changePlanSelection('anual')} style={anualStyle}>
                                    <span id='request_ally_info_request_item_title'>Membresía anual</span>
                                    <span id='request_ally_info_request_item_price'>$399 por mes</span>
                                    <span id='request_ally_info_request_item_text'>Inicia cuando obtienes tu primer servicio con DREC</span>
                                </div>
                            </div>
                            <div className='request_ally_send_button' onClick={sendRequest}>
                                Solicitar
                            </div>
                        </>}
                    </div>
                    {prompt &&
                        <div className="reg_log_prompt" style={promptStyle}>
                            {prompt}
                        </div>}
                </div>
            : <LoadingScreen2></LoadingScreen2>}
        </>
    )
}