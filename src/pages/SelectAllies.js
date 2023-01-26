import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate, useParams} from 'react-router-dom';
import '../styles/ProfileList.css';
import LoadingScreen from '../components/LoadingScreen';
import { Link } from "react-router-dom";
import LoadingScreen2 from '../components/LoadingScreen2';

export default function SelectAllies(){
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isCotizacion, setIsCotizacion] = useState(false);

    const [searchInput, setSearchInput] = useState('');
    const [profiles, setProfiles] = useState([]);
    const [noItems, setNoItems] = useState(false);
    const [selections, setSelections] = useState([]);

    const [prompt, setPrompt] = useState(null);
    const [promptStyle, setPromptStyle] = useState(null);

    const [files, setFiles] = useState(null);
    
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
        return profile.name.match(searchInput) || profile.id == parseInt(searchInput) || profile.email.match(searchInput)
    });

    const acceptSelection = () => {
        setIsCotizacion(true);
    }

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

    const sendCotizacion = async () => {
        console.log(files);
        setPromptStyle({backgroundColor: '#77DD77'});
        setPrompt('Cotizacion enviada');
        await timeout(2000);
        setPrompt(null);
    }

    const deselectSelection = (e) => {
        let temp = profiles;
        temp.push(e);
        setProfiles(temp);
        var index = selections.indexOf(e);
        selections.splice(index, 1);
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
                                onChange={(e) => setSearchInput(e.target.value)}
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
                            <div className='select_allies_selection_accept' onClick={acceptSelection}>
                                <span>Aceptar seleccion</span>
                            </div>
                        </>
                    : 
                    <>
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
                                    </div>
                                )
                            })}
                            </div>
                        </div>
                        <div className='select_allies_cotizacion'>
                            <div className='select_allies_cotizacion_container'>
                                <span>Titulo</span>
                                <input type={'text'} placeholder={"Link de drive"}/>
                                <input id='fileUpload' type='file' multiple
                                    accept='pdf, png'
                                    onChange={(e) => setFiles(e.target.files)}
                                />
                                <div className='select_allies_buttons'>
                                    <a id='select_allies_send' onClick={sendCotizacion}>
                                        <span>Enviar cotizacion</span>
                                    </a>
                                    <a id='select_allies_cancel' onClick={() => setIsCotizacion(false)}>
                                        <span>Cancelar</span>
                                    </a>
                                </div>
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