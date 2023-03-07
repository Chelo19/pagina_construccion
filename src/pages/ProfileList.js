import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate, useParams} from 'react-router-dom';
import '../styles/ProfileList.css';
import LoadingScreen from '../components/LoadingScreen';
import { Link } from "react-router-dom";
import LoadingScreen2 from '../components/LoadingScreen2';

import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

export default function ProfileList(){
    const navigate = useNavigate();
    const { type } = useParams();
    const [isLoading, setIsLoading] = useState(true);

    const [searchInput, setSearchInput] = useState('');
    const [allItems, setAllItems] = useState(false);
    const [noItems, setNoItems] = useState(false);
    const [profiles, setProfiles] = useState([]);

    useEffect(() => {
        if(type == 'clientes'){
            getProfiles();
        }
        else if(type == 'aliados'){
            getAllyProfiles();
        }
    }, [])

    const getProfiles = async () => {
        const { data, error } = await supabase
        .from('account')
        .select()
        .order('id', { ascending: true })
        .match({ role: 'cliente' });
        if(data){
            setProfiles(data);
            setIsLoading(false);
        }
        if(data.length == 0){
            setNoItems(true);
        }
    }

    const getAllyProfiles = async () => {
        const { data, error } = await supabase
        .from('account')
        .select()
        .order('id', { ascending: true })
        .match({ role: 'aliado' });
        if(data){
            setProfiles(data);
            setIsLoading(false);
        }
        if(data.length == 0){
            setNoItems(true);
        }
    }

    const profileFiltered = profiles.filter((profile) => {
        return profile.name.toLowerCase().match(searchInput) || profile.id == parseInt(searchInput) || profile.email.match(searchInput)
    });

    console.log(searchInput);
    console.log(allItems);

    return(
        <>
            {!isLoading ? 
                <div className='profile_list_background'>
                    <div className='profile_list_container'>
                        <div className='edit_services_search_box'>
                            <TextField 
                            className='edit_services_search_input'
                            label="Buscar" 
                            variant="outlined"
                            onChange={(e) => setSearchInput(e.target.value.toLowerCase().replace(/([.*+?^=!:$(){}|[\]\/\\])/g, ''))}
                            value={searchInput}/>
                            {!allItems ? 
                                <div className='edit_services_all_items' onClick={(e) => {setAllItems(true); setSearchInput('')}}>
                                    <VisibilityOutlinedIcon color='primary' fontSize='large'/>
                                </div>
                                : 
                                <div className='edit_services_all_items' onClick={(e) => setAllItems(false)}>
                                    <VisibilityOffOutlinedIcon color='primary' fontSize='large'/>
                                </div>
                            }
                        </div>
                        {(searchInput.length > 0 || allItems) ?
                        <>
                            {(!allItems || searchInput.length > 0) &&
                                <div className='edit_services_results'>
                                {profileFiltered.map((profile) => {
                                    return(
                                    <Link to={`/profile/${profile.id}`} className='edit_services_item'>
                                        <span>{profile.id}</span>
                                        <span>{profile.name}</span>
                                    </Link>
                                    )
                                })}
                                </div>
                            }
                            {(allItems && searchInput.length == 0) &&
                            <div className='edit_services_results'>
                                {profiles.map((profile) => {
                                return(
                                    <Link to={`/profile/${profile.id}`} className='edit_services_item'>
                                        <span>{profile.id}</span>
                                        <span>{profile.name}</span>
                                    </Link>
                                )
                                })}
                            </div>
                            }
                        </>
                        : 
                        <div className='no_items_background'>
                            <div className='no_items_container'>
                                <div className='no_items_img'>
                                    <img src={require('../img/search.png')}/>
                                </div>
                                <div className='no_items_spans'>
                                    <span className='no_items_span_title'>¡Vaya, parece que no has buscado ningún perfil aún!</span>
                                    <span className='no_items_span_text'>Si deseas encontrar un perfil, puedes buscarlo en la barra superior con su id, nombre o correo.</span>
                                </div>
                            </div>
                        </div>
                        }
                            {/* <div className='profile_list_search'>
                                <input
                                type="text"
                                placeholder="Buscar por nombre o id"
                                onChange={(e) => setSearchInput(e.target.value.toLowerCase().replace(/([.*+?^=!:$(){}|[\]\/\\])/g, ''))}
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
                                            <Link to={`/profile/${profile.id}`} key={profile.id} className='profile_list_results_item'>
                                                <span>{profile.id}</span>
                                                <span>{profile.name}</span>
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div> */}
                    </div>
                </div>
            : <LoadingScreen2></LoadingScreen2>
            }
        </>
    );
}