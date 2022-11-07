import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import { useNavigate } from 'react-router-dom';
import '../styles/Categories.css';



export default function Categories(){
    
    const [location, getLocation] = useState(null);
    const [locationId, getLocationId] = useState(null);

    const [categories, getCategories] = useState(null);

    useEffect(() => {
        if(location == null) getUserLocation();
        if(locationId == null) getUserLocationId();
        showCategories();
        console.log(categories);
    })

    const getUserLocation = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        const { data, error } = await supabase
        .from('account')
        .select()
        .eq('uuid', user.id);

        getLocation(data[0].location);
    };

    const getUserLocationId = async () => {
        const { data, error } = await supabase
        .from('location')
        .select()
        .eq('name', location);
        getLocationId(data[0].id);
    }

    const showCategories = async () => {
        const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('location_id', locationId)
        getCategories(data);
    }

    return(
        <div className='container'>
            {categories && (
                <div className='container_center'>
                    {categories.map(category => (
                        <p key={category.id}>
                        id: {category.id}<br/> 
                        name: {category.name}</p>
                    ))}
                </div>
            )}
        </div>
    )
}