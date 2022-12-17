import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase/client";
import "../styles/EditServicesSelectCategory.css";
import LoadingScreen from "../components/LoadingScreen";
import { Link } from "react-router-dom";

export default function EditServicesSelectCategory(){
    let { id } = useParams();
    const navigate = useNavigate();
    
    const [loadingScreen, setLoadingScreen] = useState(true);
    const [categories, setCategories] = useState();
    const [noItems, setNoItems] = useState(false);


    const checkIfAdmin = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(user){
            const { data, error } = await supabase
            .from('account')
            .select()
            .eq('uuid', user.id);
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
        .eq("location_id", id);
        if(data.length == 0){
            setNoItems(true);
        }
        setCategories(data);
        setLoadingScreen(false);
    };


    useEffect(() => {
    checkIfAdmin();
    console.log(categories)
    }, [loadingScreen]);

    return(
        <div className="edit_service_select_category_background">
        {!loadingScreen ? 
          <div className="edit_service_select_category_gallery">
              <div className="edit_service_select_category_container">
                {noItems ?
                  <div className="edit_service_select_category_no_items_alert">No se encontraron resultados</div>
                : <>
                  <div className="edit_service_select_category_item_names">
                      <span>Id</span>
                      <span>Creado el</span>
                      <span>Nombre</span>
                  </div>
                  {categories.map((category) => {
                    return (
                        <Link to={`/edit-services/${category.id}`} key={category.id} className='edit_service_select_category_item'>
                          <div className='edit_service_select_category_item_container'>
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