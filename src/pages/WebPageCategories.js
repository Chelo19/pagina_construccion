import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/Profiles.css';
import LoadingScreen from '../components/LoadingScreen';
import { Link } from "react-router-dom";

export default function WebPageCategories(){
    const navigate = useNavigate();

    return(
        <div className='profiles_background'>
            <div className='profiles_container'>
                <div className='profiles_gallery'>
                    <Link to={'/edit-categories'} className='profiles_item'>
                        <div className='profiles_item_container'>
                            <div className='profiles_item_img'>
                                <img src={require('../img/categorias.png')}/>
                            </div>
                            <span className='profiles_item_title'>
                                Editar Categorias
                            </span>
                        </div>
                    </Link>
                    <Link to={'/add-category'} className='profiles_item'>
                        <div className='profiles_item_container'>
                            <div className='profiles_item_img'>
                                <img src={require('../img/categorias.png')}/>
                            </div>
                            <span className='profiles_item_title'>
                                Agregar Categorias
                            </span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}