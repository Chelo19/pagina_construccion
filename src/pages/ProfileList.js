import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/ProfileList.css';
import LoadingScreen from '../components/LoadingScreen';
import { Link } from "react-router-dom";

export default function ProfileList(){
    const navigate = useNavigate();

    const [searchInput, setSearchInput] = useState('');

    const profiles = [

        { name: "Marcelo De Leon", id: 55 },
        { name: "Julian Alvarez", id: 44 },
        { name: "Leandro Paredes", id: 87 },
        { name: "Emiliano Martinez", id: 245 },
        { name: "Gerardo Garza", id: 546 },
    
    ];

    return(
        <div className='profile_list_background'>
            <div className='profile_list_container'>
                <div className='profile_list_search'>
                    <input
                    type="text"
                    placeholder="Search here"
                    onChange={(e) => setSearchInput(e.target.value)}
                    value={searchInput} />
                </div>
                <div className='profile_list_results'>
                    <div className='profile_list_results_container'>
                        <div className='profile_list_results_item'>
                                    <span>id</span>
                                    <span>Nombre</span>
                                </div>
                        {profiles.filter((profile) => {return profile.name.match(searchInput)}).map((profile) => {
                            return(
                                <div className='profile_list_results_item'>
                                    <span>{profile.id}</span>
                                    <span>{profile.name}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}