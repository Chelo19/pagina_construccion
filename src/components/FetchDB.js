import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import '../styles/FetchDB.css';


export default function FetchDB(){

    const [services, setServices] = useState(null); 
    
    useEffect(() => {
        fetchServices();
    });

    const fetchServices = async () => {
        const { data, error } = await supabase
        .from('services')
        .select()
        if(error){
            setServices(null);
        }
        if(data){
            setServices(data);
        }
    };

    return(
        <div className='services_container'>
            {services && (
                <div className='service'>
                    {services.map(service => (
                        <p key={service.id}>id: {service.id} <br/> name: {service.name}</p>
                    ))}
                </div>
            )}
        </div>
    )
}
