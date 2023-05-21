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
    const [pendingUserRateProjects, setPendingUserRateProjects] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [userRating, setUserRating] = useState(null);

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
            // console.log(data);
            setProjects(data.filter(project => {
                return project.is_done == false;
            }))
            setPendingUserRateProjects(data.filter(project => {
                return project.is_done == true && project.user_rating == null;
            }))
            setDoneProjects(data.filter(project => {
                return project.is_done == true && project.user_rating != null;
            }))
        }
        else{
            setNoItems(true);
        }
        setIsLoading(false);
    }

    const selectUserRating = async () => {
        const { error } = await supabase
        .from('cotizaciones')
        .update({ user_rating: userRating })
        .eq('id', selectedProject.id);
        if(!error){
            console.log("Hecho");
        }
        else{
            console.log(error);
        }
    }

    ////////

    const getUserRating = async () => { // asi se saca el rating
        let sum = 0;
        const { data, error } = await supabase
        .from('cotizaciones')
        .select('user_rating')
        .not('user_rating', 'is', null)
        .eq('account_email', selectedProject.account_email.email);
        if(!error){
            data.map((project) => {
                return(
                    <>{sum += project.user_rating}</>
                )
            })
            return (sum / data.length);
        }
        else{
            console.log(error);
        }
    }

    ////////

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
                                            {pendingUserRateProjects.length > 0 &&
                                                <>
                                                    <span className='generic_title font30 posL' style={{margin: "10px 0px"}}>Pendiente de calificar</span>
                                                    {pendingUserRateProjects.map((project) => {
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
                                            <span>Email: {selectedProject.account_email.email}</span>
                                            <span>Teléfono: {selectedProject.account_email.phone}</span>
                                        </div>
                                        {(selectedProject.is_done == true && selectedProject.user_rating == null) &&
                                            <>
                                                <select onChange={(e) => setUserRating(e.target.value)}>
                                                    <option>1</option>
                                                    <option>2</option>
                                                    <option>3</option>
                                                    <option>4</option>
                                                    <option>5</option>
                                                </select>
                                                <a className='generic_button font20' style={{backgroundColor: '#ff7f22'}} onClick={selectUserRating}>Enviar</a>
                                            </>
                                        }
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