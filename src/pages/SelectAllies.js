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

    const [searchInput, setSearchInput] = useState('');
    const [profiles, setProfiles] = useState([]);
    const [noItems, setNoItems] = useState(false);
    const [checkedValues, setValue] = useState([]);
    
    useEffect(() => {
        getAllyProfiles();
    }, [])

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
        return profile.name.match(searchInput) || profile.id == parseInt(searchInput) || profile.email.match(searchInput)
    });

    const acceptSelection = () => {
        console.log(checkedValues);
    }

    const handleChange = (e) => {
        const {value, checked} = e.target;
        if(checked){
            setValue(pre => [...pre,value]);
        }
        else{
            setValue(pre => {
                return [...pre.filter(skill => skill!==value)]
            })
        }
    }

    return(
        <>
            {!isLoading ? 
                <div className='profile_list_background'>
                    <div className='profile_list_container'>
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
                                            <input type={'checkbox'} value={profile.id} onChange={handleChange}></input>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className='select_allies_selection_container'>
                            <span>Seleccionados:</span>
                            {checkedValues.map((value) => {
                                return(
                                    <div key={value}>
                                        id: {value}
                                    </div>
                                )
                            })}
                        </div>
                        <div className='select_allies_selection_accept' onClick={acceptSelection}>
                            <span>Aceptar seleccion</span>
                        </div>
                    </div>
                </div>
            : <LoadingScreen2></LoadingScreen2>
            }
        </>
    );
}