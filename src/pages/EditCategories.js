import { useEffect, useState } from 'react';
import {supabase} from '../supabase/client';
import { useNavigate, useParams } from "react-router-dom";
import '../styles/EditServices.css';
import '../styles/NoItems.css';
import { Link } from 'react-router-dom';
import LoadingScreen2 from '../components/LoadingScreen2';

import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

export default function EditCategories(){
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const [noItems, setNoItems] = useState(false);
  const [allItems, setAllItems] = useState(false);
  const [prompt, setPrompt] = useState(null);

  const [searchInput, setSearchInput] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getServices();
  }, []);

  const getServices = async () => {
    const { data, error } = await supabase
    .from('categories')
    .select(`*`)
    .order('id', { ascending: true });
    console.log(data);
    if(data){
      setCategories(data);
      setIsLoading(false);
    }
    if(data.length == 0){
      setNoItems(true);
    }
  }

  const categoryFiltered = categories.filter((category) => {
    if(searchInput.length == 0) return;
    return category.name.toLowerCase().match(searchInput) || category.id == parseInt(searchInput)
  });

  return(
    <>
      {!isLoading ?
      <div className='edit_services_background'>
        <div className='edit_services_container'>
          <div className='edit_services_search_box'>
            <TextField 
            className='edit_services_search_input'
            label="Buscar" 
            variant="outlined"
            onChange={(e) => {setSearchInput(e.target.value.toLowerCase().replace(/([.*+?^=!:$(){}|[\]\/\\])/g, '')); setAllItems(false)}}
            value={searchInput}/>
            {!allItems ? 
            <div className='edit_services_all_items' onClick={(e) => {setAllItems(true); setSearchInput('')}}>
              <VisibilityOutlinedIcon color='primary' fontSize='large'/>
            </div>
            : 
            <div className='edit_services_all_items' onClick={(e) => setAllItems(false)}>
              <VisibilityOffOutlinedIcon color='primary' fontSize='large'/>
            </div>}
          </div>
          {(categoryFiltered.length > 0 || allItems) ?
          <>
            <div className='edit_services_results'>
              {categoryFiltered.map((category) => {
                return(
                  <Link to={`/edit-category/${category.id}`} className='edit_services_item'>
                    <span>{category.id}</span>
                    <span>{category.name}</span>
                  </Link>
                )
              })}
            </div>
            {(allItems && searchInput.length == 0) &&
              <div className='edit_services_results'>
                {categories.map((category) => {
                  return(
                    <Link to={`/edit-category/${category.id}`} className='edit_services_item'>
                      <span>{category.id}</span>
                      <span>{category.name}</span>
                    </Link>
                  )
                })}
              </div>
            }
          </>
          : 
          <div className='no_items_background'>
            <div className='no_items_container'>
              <div className='no_items_img'>
                <img src={require('../img/search.png')}/>
              </div>
              <div className='no_items_spans'>
                <span className='no_items_span_title'>¡Vaya, parece que no has buscado ninguna categoría aún!</span>
                <span className='no_items_span_text'>Si deseas encontrar una categoría, puedes buscarla en la barra superior con su id o su nombre.</span>
              </div>
            </div>
          </div>
          }
        </div>
      </div>
      : <LoadingScreen2/>}
    </>
  )
}