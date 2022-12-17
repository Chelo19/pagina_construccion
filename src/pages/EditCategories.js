import { useEffect, useState } from 'react';
import {supabase} from '../supabase/client';
import LoadingScreen from '../components/LoadingScreen';
import { useNavigate, useParams } from "react-router-dom";
import '../styles/EditCategories.css';
import { Link } from 'react-router-dom';

export default function EditCategories(){
    let { id } = useParams();
    const navigate = useNavigate();

    const [loadingScreen, setLoadingScreen] = useState(true);
    const [categories, setCategories] = useState();
    const [noItems, setNoItems] = useState(false);
    var locationId;

    const checkIfAdmin = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(user){
          const { data, error } = await supabase
          .from('account')
          .select()
          .eq('uuid', user.id);
          locationId = data[0].location_id;
          if(data[0].role == 'administrador' || data[0].role == 'gerente'){
            showCategories();
          }
          else{
            window.alert("No tienes los permisos para acceder a este lugar");
            navigate("/");
          }
        }
        else{
          window.alert("Inicia sesión como administrador para acceder");
          navigate("/login");
        }
    }

    const showCategories = async () => {
        const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("location_id", locationId);
        setCategories(data);
        setLoadingScreen(false);
    };

    useEffect(() => {
        checkIfAdmin();
        console.log(categories);
    }, [loadingScreen]);

    return(
        <div className="edit_categories_background">
        {!loadingScreen ? 
          <div className="edit_categories_gallery">
              <div className="edit_categories_container">
                {noItems ?
                  <div className="edit_categories_no_items_alert">No se encontraron resultados</div>
                : <>
                  <div className="edit_categories_item_names">
                      <span>Id</span>
                      <span>Creado el</span>
                      <span>Nombre</span>
                  </div>
                  {categories.map((category) => {
                    return (
                        <Link to={`/edit-category/${category.id}`} key={category.id} className='edit_categories_item'>
                          <div className='edit_categories_item_container'>
                            <span>{category.id}</span>
                            <span>{category.created_at}</span>
                            <span>{category.name}</span>
                          </div>
                        </Link>
                      );
                  })}
                </>
                }
              </div>
          </div>
          : <LoadingScreen/>}
        </div>
    )
}