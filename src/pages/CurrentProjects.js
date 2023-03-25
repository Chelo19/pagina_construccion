import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/Projects.css';
import { Link } from "react-router-dom";
import LoadingScreen2 from '../components/LoadingScreen2';
import GoBackButton from '../components/GenericAssets';

import TurnLeftOutlinedIcon from '@mui/icons-material/TurnLeftOutlined';
import NavigateBeforeOutlinedIcon from '@mui/icons-material/NavigateBeforeOutlined';

import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';

export default function CurrentProjects(){
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [noItems, setNoItems] = useState(false);

    const [projects, setProjects] = useState(null);
    const [doneProjects, setDoneProjects] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);

    const [prompt, setPrompt] = useState(null);
    const [promptSeverity, setPromptSeverity] = useState('success');

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        getProjects();
    }, []);

    const getProjects = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
        .from('cotizaciones')
        .select('*, account_email(*), service_id(*, category_id(*)), selected_ally_email(*)')
        .order('id', { ascending: false })
        .match({ is_project: true});
        if(data.length > 0){
            console.log(data);
            setProjects(data.filter(project => {
                return project.is_done == false;
            }))
            setDoneProjects(data.filter(project => {
                return project.is_done == true;
            }))
        }
        else{
            setNoItems(true);
        }
        setIsLoading(false);
    }

    const doneProject = async () => {
        const { error } = await supabase
        .from('cotizaciones')
        .update({ is_done: true })
        .eq('id', selectedProject.id);
        if(!error){
            setPrompt('Cotización finalizada correctamente')
            setPromptSeverity('success');
            await timeout(2000);
            navigate(-1);
        }
        else{
            console.log(error);
            setPrompt(error.message);
            setPromptSeverity('error');
        }
        console.log(error);
    }

    function timeout(number) {
        return new Promise( res => setTimeout(res, number) );
    }

    return(
        <>
            {!isLoading ?
            <div className='generic_background'>
                <div className='generic_container'>
                    {!noItems ?
                        <>
                            <div className='generic_item_container'>
                                {!selectedProject ?
                                    <>
                                        <GoBackButton/>
                                        <div className='generic_form gap20'>
                                            <span className='generic_title font30 posL' style={{margin: "10px 0px"}}>Proyectos actuales</span>
                                            {projects.map((project) => {
                                                return(
                                                    <div className='project_item project_item_current' onClick={(e) => setSelectedProject(project)} key={project.id}>
                                                        <div className='project_item_content'>
                                                            <span>Identificador del proyecto: {project.id}</span>
                                                            <span>Servicio: {project.service_id.name}</span>
                                                            <span>Categoría: {project.service_id.category_id.name}</span>
                                                        </div>
                                                        <div className='project_item_img'>
                                                            <img src={`${project.service_id.img_url[0]}`}/>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                            <span className='generic_title font30 posL' style={{margin: "10px 0px"}}>Proyectos terminados</span>
                                            {doneProjects.map((project) => {
                                                return(
                                                    <div className='project_item project_item_done' onClick={(e) => setSelectedProject(project)} key={project.id}>
                                                        <div className='project_item_content'>
                                                            <span>Identificador del proyecto: {project.id}</span>
                                                            <span>Servicio: {project.service_id.name}</span>
                                                            <span>Categoría: {project.service_id.category_id.name}</span>
                                                        </div>
                                                        <div className='project_item_img'>
                                                            <img src={`${project.service_id.img_url[0]}`}/>
                                                        </div>
                                                    </div>
                                                    
                                                )
                                            })}
                                        </div>
                                    </>
                                    :
                                    <>
                                        <Link onClick={(e) => setSelectedProject(null)} className="generic_back_button">
                                            <NavigateBeforeOutlinedIcon/> Regresar
                                        </Link>
                                        <span className='generic_title font30 posL'>Identificador del proyecto: {selectedProject.id}</span>
                                        <div className='profile_content generic_description font20 posL gap20'>
                                            <span>Servicio: {selectedProject.service_id.name}</span>
                                            <span>Categoría: {selectedProject.service_id.category_id.name}</span>
                                            <span className='generic_title font30 posL'>Cliente: </span>
                                            <span>Nombre: {selectedProject.account_email.name}</span>
                                            <span>Nombre: {selectedProject.account_email.email}</span>
                                            <span>Nombre: {selectedProject.account_email.phone}</span>
                                            <span className='generic_title font30 posL'>Encargado: </span>
                                            <span>Nombre: {selectedProject.selected_ally_email.name}</span>
                                            <span>Nombre: {selectedProject.selected_ally_email.email}</span>
                                            <span>Nombre: {selectedProject.selected_ally_email.phone}</span>
                                        </div>
                                        <div className='generic_button font20' style={{backgroundColor: '#ff5252'}} onClick={handleClickOpen}>Finalizar cotizacion</div>
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
                                                ¿Estás seguro de que deseas finalizar la cotización?
                                            </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                            <Button onClick={handleClose}>Regresar</Button>
                                            <Button onClick={() => {doneProject(); handleClose()}} autoFocus>
                                                Finalizar
                                            </Button>
                                            </DialogActions>
                                        </Dialog>
                                    </>
                                }
                            </div>
                        </>
                        :
                        <div className='no_items_background'>
                            <div className='no_items_container'>
                                <div className='no_items_img'>
                                    <img src={require('../img/financiamiento.png')}/>
                                </div>
                                <div className='no_items_spans'>
                                    <span className='no_items_span_title'>Aún no hay proyectos</span>
                                </div>
                                <div className="no_items_buttons">
                                    <Link onClick={(e) => navigate(-1)} className="no_items_button" id="no_items_button_return">
                                        Regresar <TurnLeftOutlinedIcon/>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    }
                </div>
                {prompt &&
                    <>
                        <Alert className='generic_alert' severity={`${promptSeverity}`} onClose={(e) => setPrompt(null)}>{prompt}</Alert>
                    </>}
                </div>
            :
            <LoadingScreen2/>
            }
        </>
    )
}