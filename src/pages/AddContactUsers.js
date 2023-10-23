import LoadingScreen from "../components/LoadingScreen";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/AddContactUsers.css";
import { Link } from "react-router-dom";
import { supabase } from "../supabase/client";



export default function AddContactUsers(){
    const { id } = useParams();
    const navigate = useNavigate();

    const [loadingScreen, setLoadingScreen] = useState(true);
    const [users, setUsers] = useState(null);
    const [noItems, setNoItems] = useState(false);
    const [isEditUserPopUp, setIsEditUserPopUp] = useState(false);
    const [localUserSelection, setLocalUserSelection] = useState(null);
    const [availableStates, setAvailableStates] = useState(null);
    const [newState, setNewState] = useState(null);

    useEffect(() => {
        checkIfAdmin();
    }, [loadingScreen])

    const checkIfAdmin = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(user){
            const { data, error } = await supabase
            .from('account')
            .select()
            .eq('uuid', user.id);
            if(data[0].role == 'gerente'){
                getUsers();
                getUserCountry();
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

    const getUsers = async () => {
        const { data, error } = await supabase
        .from('account')
        .select()
        .order('id', { ascending: true })
        .or("contact_state_id.is.null");
        console.log(data);
        if(data.length == 0){
            setNoItems(true);
        }
        else{
            setUsers(data);
        }
    }

    const localUserSelectionMethod = (selection) => {
        setIsEditUserPopUp(true)
        for(var i = 0 ; i < users.length ; i++){
            if(users[i].id == selection){
                setLocalUserSelection(users[i]);
            }
        }
    }

    const getUserCountry = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
        .from('account')
        .select(`admin_location_id (state_id (country_id (id)))`)
        .eq('uuid', user.id);
        getAvailableStates(data[0].admin_location_id.state_id.country_id.id);
    }

    const getAvailableStates = async (countryId) => {
        const { data, error } = await supabase
        .from('states')
        .select();
        // .match({ country_id: countryId}); en caso de querer hacerlo preciso
        setAvailableStates(data);
        setLoadingScreen(false);
    }

    const setContactState = async () => {
        const { error } = await supabase
        .from('account')
        .update({ contact_state_id: newState })
        .eq('id', localUserSelection.id);
        if(!error){
            document.location.reload();
        }
        else{
            window.alert(error.message);
        }
    }

    return(
        <div className="edit_users_select_category_background">
        {!loadingScreen ? 
          <div className="edit_users_select_category_gallery">
              <div className="edit_users_select_category_container">
                {noItems ?
                  <div className="edit_users_no_items_alert">No se encontraron resultados</div>
                : 
                <>
                  <div className="edit_users_select_category_item_names">
                      <span>Id</span>
                      <span>Email</span>
                      <span>Nombre</span>
                      <span>Rol</span>
                      <span>Loc</span>
                  </div>
                  {users.map((user) => {
                    return(
                        <Link onClick={(e) => localUserSelectionMethod(user.id)} key={user.id} className='edit_users_select_category_item'>
                          <div className='edit_users_select_category_item_container'>
                            <span>{user.id}</span>
                            <span>{user.email}</span>
                            <span>{user.name}</span>
                            <span>{user.role}</span>
                            <span>{user.location_id}</span>
                          </div>
                        </Link>
                    )
                  })}
                </>
                }
              </div>
          </div>
          : <LoadingScreen/>}
          {isEditUserPopUp &&
              <div className="edit_users_popup_background">
                <div className="edit_users_popup_container">
                    <div className="edit_users_popup_container_data">
                        <div className="edit_users_popup_item">
                            <span className="edit_users_popup_titles">Selecciona el estado del que será contacto</span>
                            <div className="edit_users_popup_data_display">
                                {newState}
                                <select onChange={(e) => {setNewState(e.target.value)}}>
                                    {availableStates.map((location) => {
                                        return(
                                            <option key={location.id} value={location.id}>{location.name}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="edit_users_popup_container_change_data">
                        <div className="edit_users_popup_change_data_buttons">
                            <Link id="edit_users_update_button" onClick={(e) => setContactState()}>Actualizar datos</Link>
                            <Link id="edit_users_cancel_button" onClick={(e) => setIsEditUserPopUp(false)}>Cancelar</Link>
                        </div>
                    </div>
                </div>
              </div>
          }
        </div>
    )
}