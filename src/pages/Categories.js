import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import { useNavigate } from 'react-router-dom';
import '../styles/Categories.css';



export default function Categories(){
    
    const [location, getLocation] = useState('Monterrey');
    const [locationId, getLocationId] = useState(null);

    const [catSelection, getCatSelection] = useState(null);
    const [serSelection, getSerSelection] = useState(null);

    const [categories, getCategories] = useState(null);
    const [services, getServices] = useState(null);
    const [currentService, getCurrentService] = useState(null);
    
    const [isCategory, getIsCategory] = useState(true);

    useEffect(() => {
        getUserLocation();
        getUserLocationId();
        showDisplay();
    }, [])
    

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

    const showDisplay = async () => {
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
        console.log(serSelection);
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
        <div className='background_categories'>
            <div className='categories_gallery'>
                <a href='/service' className='category_item'>
                    <div className='category_item_img'>
                        <img src={require('../img/services/service_4.jpg')}/>
                    </div>
                    <div className='category_item_content'>
                        <div className='category_item_title'>
                            <span>Servicio de construccion</span>
                        </div>
                        <div className='category_item_description'>
                            <span>Lorem ipsum dolor sit amet. Ea magnligendi id magni odit? Sed animi error insentium sequi sed delectus explicabo et ipsa quae in sunt incidunt.</span>
                        </div>
                    </div>
                </a>
                <a href='/service' className='category_item'>
                    <div className='category_item_img'>
                        <img src={require('../img/services/service_1.jpg')}/>
                    </div>
                    <div className='category_item_content'>
                        <div className='category_item_title'>
                            <span>Servicio de construccion</span>
                        </div>
                        <div className='category_item_description'>
                            <span>Lorem ipsum dolor sit amet. Ea magnligendi id magni odit? Sed animi error insentium sequi sed delectus explicabo et ipsa quae in sunt incidunt.</span>
                        </div>
                    </div>
                </a>
                <a href='/service' className='category_item'>
                    <div className='category_item_img'>
                        <img src={require('../img/services/service_2.jpg')}/>
                    </div>
                    <div className='category_item_content'>
                        <div className='category_item_title'>
                            <span>Servicio de construccion</span>
                        </div>
                        <div className='category_item_description'>
                            <span>Lorem ipsum dolor sit amet. Ea magnligendi id magni odit? Sed animi error insentium sequi sed delectus explicabo et ipsa quae in sunt incidunt.</span>
                        </div>
                    </div>
                </a>
                <a href='/service' className='category_item'>
                    <div className='category_item_img'>
                        <img src={require('../img/services/service_3.jpg')}/>
                    </div>
                    <div className='category_item_content'>
                        <div className='category_item_title'>
                            <span>Servicio de construccion</span>
                        </div>
                        <div className='category_item_description'>
                            <span>Lorem ipsum dolor sit amet. Ea magnligendi id magni odit? Sed animi error insentium sequi sed delectus explicabo et ipsa quae in sunt incidunt.</span>
                        </div>
                    </div>
                </a>
                <a href='/service' className='category_item'>
                    <div className='category_item_img'>
                        <img src={require('../img/services/service_3.jpg')}/>
                    </div>
                    <div className='category_item_content'>
                        <div className='category_item_title'>
                            <span>Servicio de construccion</span>
                        </div>
                        <div className='category_item_description'>
                            <span>Lorem ipsum dolor sit amet. Ea magnligendi id magni odit? Sed animi error insentium sequi sed delectus explicabo et ipsa quae in sunt incidunt.</span>
                        </div>
                    </div>
                </a>
                <a href='/service' className='category_item'>
                    <div className='category_item_img'>
                        <img src={require('../img/services/service_2.jpg')}/>
                    </div>
                    <div className='category_item_content'>
                        <div className='category_item_title'>
                            <span>Servicio de construccion</span>
                        </div>
                        <div className='category_item_description'>
                            <span>Lorem ipsum dolor sit amet. Ea magnligendi id magni odit? Sed animi error insentium sequi sed delectus explicabo et ipsa quae in sunt incidunt.</span>
                        </div>
                    </div>
                </a>
                <a href='/service' className='category_item'>
                    <div className='category_item_img'>
                        <img src={require('../img/services/service_1.jpg')}/>
                    </div>
                    <div className='category_item_content'>
                        <div className='category_item_title'>
                            <span>Servicio de construccion</span>
                        </div>
                        <div className='category_item_description'>
                            <span>Lorem ipsum dolor sit amet. Ea magnligendi id magni odit? Sed animi error insentium sequi sed delectus explicabo et ipsa quae in sunt incidunt.</span>
                        </div>
                    </div>
                </a>
                <a href='/service' className='category_item'>
                    <div className='category_item_img'>
                        <img src={require('../img/services/service_4.jpg')}/>
                    </div>
                    <div className='category_item_content'>
                        <div className='category_item_title'>
                            <span>Servicio de construccion</span>
                        </div>
                        <div className='category_item_description'>
                            <span>Lorem ipsum dolor sit amet. Ea magnligendi id magni odit? Sed animi error insentium sequi sed delectus explicabo et ipsa quae in sunt incidunt.</span>
                        </div>
                    </div>
                </a>
                <a href='/service' className='category_item'>
                    <div className='category_item_img'>
                        <img src={require('../img/services/service_4.jpg')}/>
                    </div>
                    <div className='category_item_content'>
                        <div className='category_item_title'>
                            <span>Servicio de construccion</span>
                        </div>
                        <div className='category_item_description'>
                            <span>Lorem ipsum dolor sit amet. Ea magnligendi id magni odit? Sed animi error insentium sequi sed delectus explicabo et ipsa quae in sunt incidunt.</span>
                        </div>
                    </div>
                </a>
                <a href='/service' className='category_item'>
                    <div className='category_item_img'>
                        <img src={require('../img/services/service_1.jpg')}/>
                    </div>
                    <div className='category_item_content'>
                        <div className='category_item_title'>
                            <span>Servicio de construccion</span>
                        </div>
                        <div className='category_item_description'>
                            <span>Lorem ipsum dolor sit amet. Ea magnligendi id magni odit? Sed animi error insentium sequi sed delectus explicabo et ipsa quae in sunt incidunt.</span>
                        </div>
                    </div>
                </a>
                <a href='/service' className='category_item'>
                    <div className='category_item_img'>
                        <img src={require('../img/services/service_2.jpg')}/>
                    </div>
                    <div className='category_item_content'>
                        <div className='category_item_title'>
                            <span>Servicio de construccion</span>
                        </div>
                        <div className='category_item_description'>
                            <span>Lorem ipsum dolor sit amet. Ea magnligendi id magni odit? Sed animi error insentium sequi sed delectus explicabo et ipsa quae in sunt incidunt.</span>
                        </div>
                    </div>
                </a>
                <a href='/service' className='category_item'>
                    <div className='category_item_img'>
                        <img src={require('../img/services/service_3.jpg')}/>
                    </div>
                    <div className='category_item_content'>
                        <div className='category_item_title'>
                            <span>Servicio de construccion</span>
                        </div>
                        <div className='category_item_description'>
                            <span>Lorem ipsum dolor sit amet. Ea magnligendi id magni odit? Sed animi error insentium sequi sed delectus explicabo et ipsa quae in sunt incidunt.</span>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    )
}