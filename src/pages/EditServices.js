import { useEffect, useState } from 'react';
import {supabase} from '../supabase/client';
import { ChangeEvent } from 'react';
import '../styles/EditServices.css';
import { key } from 'localforage';

export default function EditServices(){

    const[serSelection, setSerSelection] = useState(null);

    const[serviceId, setServiceId] = useState(null);
    const[services, setServices] = useState([]);

    const[imgUrl, setImgUrl] = useState(null);

    const getServicesData = async () => {
        getBucketData();
        const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('category_id', 1)
        if(data){
            setServices(data);  
        }
        else{
            console.log(error);
        }
    }

    const listServices = services.map((service) => 
    <div className='category_item' onClick={(e) => setServiceId(service.id)} key={service.id}>
        <div className='category_item_img'>
            <img src={service.img_url}/>
            {service.img_url}
        </div>
        <div className='category_item_content'>
            <div className='category_item_title'>
                <span>{service.name}</span>
            </div>
            <div className='category_item_description'>
                <span>{service.description}</span>
            </div>
        </div>
    </div>
    )

    const getBucketData = async(e) => {
        const { data, error } = await supabase
        .storage
        .from('services-img')
        .list('public', {
            limit: 100,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' },
        })
    }

    useEffect(() => {
    })
    
    const handleUpload = async(e) => {
        let file;

        if(e.target.files){
            file = e.target.files[0];
        }

        const {data, error} = await supabase
        .storage
        .from('services-img')
        .upload('public/service' + serviceId + ".png", file);

        if(data){
            console.log(data);
            getImgUrl();
        }
        else if(error){
            console.log(error);
        }
    }

    const getImgUrl = async(e) => {
        const { data } = supabase
        .storage
        .from('services-img')
        .getPublicUrl("public/service" + serviceId + ".png")
        if(data.publicUrl != null){
            console.log("entra");
            const { error } = await supabase
            .from('services')
            .update({ img_url: data.publicUrl })
            .eq('id', serviceId)
            if(error){
                console.log(error);
            }
        }
        else{
            console.log("else");
            getImgUrl();
        }
    }

    window.onload = getServicesData();

    return(
        <div className='background_edit_services'>
            <div className='edit_services_container'>
                <input 
                type="text"
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
            <div className='categories_gallery'>
                {listServices}
            </div>
            <div>
                {serviceId}
            </div>
            <div>
                <input onClick={getImgUrl} type='button' value={"CLICK"}>
                </input>
            </div>
        </div>
    )
}