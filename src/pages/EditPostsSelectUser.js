import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/EditPostsSelectUser.css";
import LoadingScreen from "../components/LoadingScreen";
import { Link } from "react-router-dom";

export default function EditPostsSelectUser(){
    const { id } = useParams();
    const navigate = useNavigate();
    const [loadingScreen, setLoadingScreen] = useState(true);

    const [noItems, setNoItems] = useState(false);
    const [localUsers, setLocalUsers] = useState(null);

    const checkIfAdmin = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(user){
            const { data, error } = await supabase
            .from('account')
            .select()
            .eq('uuid', user.id);
            if(data[0].role == 'gerente'){
                getUsers();
            }
            else{
                window.alert("No tienes los permisos para acceder a este lugar");
                navigate("/");
            }
        }
        else{
            window.alert("Inicia sesión como gerente para acceder");
            navigate("/login");
        }
    }
    
    useEffect(() => {
        checkIfAdmin();
    }, [loadingScreen]);

    const getUsers = async () => {
        const { data, error } = await supabase
        .from('account')
        .select()
        .order('id', { ascending: true })
        .match({ location_id: id });
        if(data.length == 0){
            setNoItems(true);
        }
        else{
            setLocalUsers(data);
        }
        setLoadingScreen(false);
    }


    return(
        <div className="edit_users_select_category_background">
        {!loadingScreen ? 
          <div className="edit_users_select_category_gallery">
              <div className="edit_users_select_category_container">
                {noItems ?
                  <div className="edit_users_select_category_no_items_alert">No se encontraron resultados</div>
                : 
                <>
                  <div className="edit_users_select_category_item_names">
                      <span>Id</span>
                      <span>Email</span>
                      <span>Nombre</span>
                      <span>Rol</span>
                      <span>Loc</span>
                  </div>
                  {localUsers.map((localUser) => {
                    return(
                        <Link to={`/edit-posts/${localUser.uuid}`} key={localUser.id} className='edit_users_select_category_item'>
                          <div className='edit_users_select_category_item_container'>
                            <span>{localUser.id}</span>
                            <span>{localUser.email}</span>
                            <span>{localUser.name}</span>
                            <span>{localUser.role}</span>
                            <span>{localUser.location_id}</span>
                          </div>
                        </Link>
                    )
                  })}
                </>
                }
              </div>
          </div>
          : <LoadingScreen/>}
        </div>
    )

}