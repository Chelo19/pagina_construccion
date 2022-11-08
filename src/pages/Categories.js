import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import { useNavigate } from 'react-router-dom';
import '../styles/Categories.css';



export default function Categories(){
    
    const [location, getLocation] = useState(null);
    const [locationId, getLocationId] = useState(null);

    const [catSelection, getCatSelection] = useState(null);

    const [categories, getCategories] = useState(null);
    const [services, getServices] = useState(null);
    
    const [isCategory, getIsCategory] = useState(true);

    useEffect(() => {
        if(location == null) getUserLocation();
        if(locationId == null) getUserLocationId();
        if(isCategory){
            showCategories();
            getServices(null);
        }
        else{
            showServices();
            getCategories(null)
        }
        if(catSelection != null){
            getIsCategory(false);
        }
        console.log(categories);
        console.log(services);
        console.log(catSelection);
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

    const showServices = async () => {
        const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('category_id', catSelection)
        getServices(data)
    }

    return(
        <div className='categories'>
            {categories && (
                <div className='categories_grid'>
                    {categories.map(category => (
                        <div
                        onClick={(e) => getCatSelection(category.id)} 
                        key={category.id} className='categories_grid_item'>
                        ID: {category.id}<br/> 
                        {category.name}</div>
                    ))}
                </div>
            )}
            {services && (
                <div className='categories_grid'>
                    {services.map(service => (
                        <div key={service.id} className='categories_grid_item'>
                        ID: {service.id}<br/> 
                        {service.name}</div>
                    ))}
                </div>
            )}
        </div>
    )
}