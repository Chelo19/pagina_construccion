import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/ProfileList.css';
import LoadingScreen from '../components/LoadingScreen';
import { Link } from "react-router-dom";
import LoadingScreen2 from '../components/LoadingScreen2';

export default function ProfileList(){
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    const [searchInput, setSearchInput] = useState('');
    const [profiles, setProfiles] = useState([]);
    const [noItems, setNoItems] = useState(false);

    useEffect(() => {
        getProfiles();
    }, [])

    const getProfiles = async () => {
        const { data, error } = await supabase
        .from('account')
        .select()
        .order('id', { ascending: true })
        console.log(data);
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
                                        <Link to={`/profile/${profile.id}`} className='profile_list_results_item'>
                                            <span>{profile.id}</span>
                                            <span>{profile.name}</span>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            : <LoadingScreen2></LoadingScreen2>
            }
        </>
    );
}