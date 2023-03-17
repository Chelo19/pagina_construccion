import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate, useParams} from 'react-router-dom';
import '../styles/ProfileList.css';
import '../styles/SelectAllies.css';
import LoadingScreen from '../components/LoadingScreen';
import { Link } from "react-router-dom";
import LoadingScreen2 from '../components/LoadingScreen2';

import Person2 from '@mui/icons-material/Person2';
import TextField from '@mui/material/TextField';

export default function SelectAllies(){
    const navigate = useNavigate();
    const { cotid } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [isCotizacion, setIsCotizacion] = useState(false);

    const [searchInput, setSearchInput] = useState('');
    const [profiles, setProfiles] = useState([]);
    const [noItems, setNoItems] = useState(false);
    const [selections, setSelections] = useState([]);
    const [drive, setDrive] = useState(null);

    const [prompt, setPrompt] = useState(null);
    const [promptStyle, setPromptStyle] = useState(null);

    useEffect(() => {
        getAllyProfiles();
    }, [isLoading])

    const getAllyProfiles = async () => {
        if(profiles.length < 1){
            const { data, error } = await supabase
            .from('account')
            .select()
            .order('id', { ascending: true })
            .match({ role: 'aliado' });
            if(data.length == selections.length + profiles.length){
                return;
            }
            if(data){
                setProfiles(data);
                setIsLoading(false);
            }
            if(data.length == 0){
                setNoItems(true);
            }
        }
    }

    const profileFiltered = profiles.filter((profile) => {
        return profile.name.toLowerCase().match(searchInput) || profile.id == parseInt(searchInput) || profile.email.match(searchInput)
    });

    const handleChange = async (e) => {
        if(selections.length == 4){
            setPromptStyle({backgroundColor: '#161825'});
            setPrompt('Solo puedes seleccionar 4 aliados');
            await timeout(2000);
            setPrompt(null);
            return;
        }
        let temp = selections;
        temp.push(e);
        setSelections(temp);
        var index = profiles.indexOf(e);
        profiles.splice(index, 1);
    }

    const deselectSelection = (e) => {
        let temp = profiles;
        temp.push(e);
        setProfiles(temp);
        var index = selections.indexOf(e);
        selections.splice(index, 1);
    }

    const sendCotizacion = async () => {
        var errorCount = 0;
        if(drive && selections.length > 0){
            for(var i = 0 ; i < selections.length ; i++){
                const { error } = await supabase
                .from('cotizaciones_allies')
                .insert({ ally_email: selections[i].email, link_drive: drive, cotizacion_id: cotid });
                if(error){
                    console.log(error);
                    errorCount++;
                }
            }
            if(errorCount > 0){
                if(errorCount == selections.length){
                    setPromptStyle({backgroundColor: '#161825'});
                    setPrompt('Intenta de nuevo');
                    await timeout(2000);
                    setPrompt(null);
                    return;
                }
                if(errorCount < selections.length){
                    setPromptStyle({backgroundColor: '#161825'});
                    setPrompt('No se finalizó la carga');
                    await timeout(2000);
                    setPrompt(null);
                    return;
                }
            }
            else{
                const { error } = await supabase
                .from('cotizaciones')
                .update({ is_sent_to_allies: true })
                .eq('id', cotid);
                if(!error){
                    setPromptStyle({backgroundColor: '#77DD77'});
                    setPrompt('Cotizaciones enviadas');
                    await timeout(2000);
                    setPrompt(null);
                    navigate('/cotizaciones-pendientes-usuario');
                    return;
                }
                else{
                    console.log(error);
                    setPromptStyle({backgroundColor: '#161825'});
                    setPrompt('No se finalizó la respuesta');
                    await timeout(2000);
                    setPrompt(null);
                    return;
                }
            }
        }
        else{
            if(!drive && selections.length < 1){
                setPromptStyle({backgroundColor: '#161825'});
                setPrompt('Ingresa un link y selecciona aliados');
                await timeout(2000);
                setPrompt(null);
                return;
            }
            else if(!drive){
                setPromptStyle({backgroundColor: '#161825'});
                setPrompt('Ingresa un link de drive');
                await timeout(2000);
                setPrompt(null);
                return;
            }
            else if(selections.length < 1){
                setPromptStyle({backgroundColor: '#161825'});
                setPrompt('Selecciona aliados');
                await timeout(2000);
                setPrompt(null);
                return;
            }
        }
    }

    function timeout(number) {
        return new Promise( res => setTimeout(res, number) );
    }

    return(
        <>
            {!isLoading ? 
                <div className='profile_list_background'>
                    <div className='profile_list_container'>
                        {!isCotizacion ? 
                        <>
                            <div className='profile_list_search'>
                                <input
                                type="text"
                                placeholder="Buscar por nombre o id"
                                onChange={(e) => setSearchInput(e.target.value.toLowerCase())}
                                value={searchInput} />
                            </div>
                            <div className='profile_list_results'>
                                <div className='profile_list_results_container'>
                                    <div className='profile_list_results_item_static'>
                                        <span>id</span>
                                        <span>Nombre</span>
                                    </div>
                                    {profileFiltered.map((profile) => {
                                        return(
                                            <div key={profile.id} className='select_allies_results_item'>
                                                <span>{profile.id}</span>
                                                <span>{profile.name}</span>
                                                <input type={'radio'} value={profile.id} onChange={(e) => handleChange(profile)}></input>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className='select_allies_selection_container'>
                                <div className='profile_list_results_container'>
                                    <span>Seleccionados:</span>
                                    <div className='profile_list_results_item_static'>
                                        <span>id</span>
                                        <span>Nombre</span>
                                    </div>
                                {selections.map((selection) => {
                                    return(
                                        <div key={selection.id} className='select_allies_results_item'>
                                            <span>{selection.id}</span>
                                            <span>{selection.name}</span>
                                            <input type={'radio'} value={selection.id} onChange={(e) => deselectSelection(selection)}></input>
                                        </div>
                                    )
                                })}
                                </div>
                            </div>
                            <div className='select_allies_send_button' onClick={(e) => setIsCotizacion(true)}>
                                Aceptar selección
                            </div>
                        </>
                    : 
                    <>
                    <span className='select_allies_title'>Aliados Seleccionados</span>
                    <div className='select_allies_profiles_container'>
                        {selections.map((selection) => {
                            return(
                            <div className='select_allies_item' key={selection.id}>
                                <Link to={`/profile/${selection.id}`} className='select_allies_icon_box'>
                                    <Person2 color='secondary' fontSize='large'/>
                                </Link>
                                <div className='select_allies_ally_info'>
                                    <span>{selection.name}</span>
                                    <span>id: {selection.id}</span>
                                    <span>{selection.email}</span>
                                </div>
                            </div>);
                        })}
                        <TextField className='select_allies_input' label="Link Drive" variant="outlined" onChange={(e) => setDrive(e.target.value)}/>
                        <div className='select_allies_send_button' onClick={sendCotizacion}>
                            Enviar
                        </div>
                        <div className='select_allies_back_button' onClick={(e) => {setIsCotizacion(false); setDrive(null)}}>
                            Regresar
                        </div>
                    </div>
                    </>
                        }
                        {prompt &&
                        <div className="reg_log_prompt" style={promptStyle}>
                        {prompt}
                        </div>}
                    </div>
                </div>
            : <LoadingScreen2></LoadingScreen2>
            }
        </>
    );
}