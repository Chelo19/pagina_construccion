import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/AcceptedCotizaciones.css';
import { Link } from "react-router-dom";
import LoadingScreen2 from '../components/LoadingScreen2';
import GoBackButton from '../components/GenericAssets';

import TurnLeftOutlinedIcon from '@mui/icons-material/TurnLeftOutlined';
import NavigateBeforeOutlinedIcon from '@mui/icons-material/NavigateBeforeOutlined';

export default function AcceptedProjectsAlly(){
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [noItems, setNoItems] = useState(false);

    const [projects, setProjects] = useState(null);
    const [doneProjects, setDoneProjects] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        getProjects();
    }, []);

    const getProjects = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
        .from('cotizaciones')
        .select('*, account_email(*), service_id(*, category_id(*))')
        .order('id', { ascending: false })
        .match({ selected_ally_email: user.email, is_project: true});
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
                                            {projects.length > 0 &&
                                                <>
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
                                                </>
                                            }
                                            {doneProjects.length > 0 &&
                                                <>
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
                                                </>
                                            }
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
                                        </div>
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
                                    <span className='no_items_span_title'>Aún no tienes proyectos</span>
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
            </div>
            :
            <LoadingScreen2/>
            }
        </>
    )
}