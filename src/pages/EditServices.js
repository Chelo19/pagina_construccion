import { useEffect, useState } from 'react';
import {supabase} from '../supabase/client';
import { ChangeEvent } from 'react';
import '../styles/EditServices.css';
import { key } from 'localforage';

export default function EditServices(){

    const[serviceId, setServiceId] = useState(null);
    const[serSelection, setSerSelection] = useState(null);
    const[services, setServices] = useState([]);

    const getServicesData = async () => {
        const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('category_id', 1)
        if(data){
            setServices(data);
            console.log(listServices);
        }
        else{
            console.log(error);
        }
    }

    const listServices = services.map((service) => 
        <li key={service.id}>{service.name}</li>
    )

    useEffect(() => {
    })
    
    const handleUpload = async(e) => {
        let file;

        if(e.target.files){
            file = e.target.files[0];
        }

        const {data, error} = await supabase
        .storage
        .from('categories-img')
        .upload('services/' + serviceId, file);

        if(data){
            console.log(data);
        }
        else if(error){
            console.log(error);
        }
    }

    window.onload = getServicesData();

    return(
        <div className='background_edit_services'>
            <div className='edit_services_container'>
                <input 
                type="number"
                name="serviceId"
                placeholder='serviceId'
                onChange={(e) => setServiceId(e.target.value)}
                /><br/>
                <input 
                type="file"
                accept="image/*"
                onChange={(e) => {
                    handleUpload(e);
                }}
                />
            </div><br/>
            <ul>{listServices}</ul>
        </div>
    )
}