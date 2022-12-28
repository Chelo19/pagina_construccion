import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/EditUsers.css";
import LoadingScreen from "../components/LoadingScreen";
import { Link } from "react-router-dom";


export default function EditUsers(){
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [loadingScreen, setLoadingScreen] = useState(true);
    const [deleteUser, setDeleteUser] = useState(false);
    const [noItems, setNoItems] = useState(false);
    const [localUsers, setLocalUsers] = useState(null);
    const [isEditUserPopUp, setIsEditUserPopUp] = useState(false);
    const [localUserSelection, setLocalUserSelection] = useState(null);
    const [newName, setNewName] = useState(null);
    const [newPhone, setNewPhone] = useState(null);
    const [newRole, setNewRole] = useState(null);
    const [newLocationId, setNewLocationId] = useState(null);
    const [availableLocations, setAvailableLocations] = useState(null);

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
                getStateId(data[0].admin_location_id);
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
        .not('role', 'in', '(gerente)')
        .match({ location_id: id });
        if(data.length == 0){
            setNoItems(true);
        }
        else{
            setLocalUsers(data);
        }
        setLoadingScreen(false);
    }

    const localUserSelectionMethod = (selection) => {
        setIsEditUserPopUp(true)
        for(var i = 0 ; i < localUsers.length ; i++){
            if(localUsers[i].id == selection){
                setLocalUserSelection(localUsers[i]);
            }
        }
    }

    const updateUser = async () => {
        let canInsertNewLocationId = false;
        if(newLocationId){
            const { data, error } = await supabase
            .from('location')
            .select()
            .eq("id", newLocationId);
            if(data.length > 0){
                canInsertNewLocationId = true;
            }
            else{
                window.alert("No existe esa localización");
                return;
            }
        }
        if(newName != ''){
            const { error } = await supabase
            .from('account')
            .update({ name: newName })
            .eq('uuid', localUserSelection.uuid);
            console.log(error);
            document.location.reload();
        }
        if(newPhone != ''){
            const { error } = await supabase
            .from('account')
            .update({ phone: newPhone })
            .eq('uuid', localUserSelection.uuid);
            document.location.reload();
        }
        if(newRole != ''){
            if(newRole == "gerente" || newRole == "Gerente"){
                window.alert("No puedes otorgar privilegios de gerente");
                return;
            }
            else{
                const { error } = await supabase
                .from('account')
                .update({ role: newRole })
                .eq('uuid', localUserSelection.uuid);
                document.location.reload();
            }
        }
        if(newLocationId != ''){
            const { error } = await supabase
            .from('account')
            .update({ location_id: newLocationId })
            .eq('uuid', localUserSelection.uuid);
            document.location.reload();
        }
    }

    const deleteCurrentUser = async () => {
        const { error } = await supabase
        .from('account')
        .delete()
        .eq('uuid', localUserSelection.uuid);
        document.location.reload();
    }

    const getStateId = async (adminLocation) => {
        const { data, error } = await supabase
        .from('location')
        .select(`state_id`)
        .eq('id', adminLocation);
        getLocations(data[0].state_id);
    }

    const getLocations = async (adminState) => {
        const { data, error } = await supabase
        .from('location')
        .select()
        .match({ state_id: adminState });
        setAvailableLocations(data);
        console.log(data);
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
                  {localUsers.map((localUser) => {
                    return(
                        <Link onClick={(e) => localUserSelectionMethod(localUser.id)} key={localUser.id} className='edit_users_select_category_item'>
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
          {isEditUserPopUp &&
              <div className="edit_users_popup_background">
                <div className="edit_users_popup_container">
                    <div className="edit_users_popup_container_data">
                        <div className="edit_users_popup_item">
                            <span className="edit_users_popup_titles">Datos actuales</span>
                            <div className="edit_users_popup_data_display">
                                <div className="edit_users_popup_data_not_data">
                                    <span>Id:</span>
                                    <span>Email:</span>
                                    <span>Teléfono:</span>
                                    <span>Nombre:</span>
                                    <span>Rol:</span>
                                    <span>Localización:</span>
                                </div>
                                <div className="edit_users_popup_data_actual_data">
                                    <span>{localUserSelection.id}</span>
                                    <span>{localUserSelection.email}</span>
                                    <span>{localUserSelection.phone}</span>
                                    <span>{localUserSelection.name}</span>
                                    <span>{localUserSelection.role}</span>
                                    <span>{localUserSelection.location_id}</span>
                                </div>
                            </div>
                        </div>
                        <div className="edit_users_popup_item">
                            <span className="edit_users_popup_titles">Actualizar datos</span>
                            <div className="edit_users_popup_data_display">
                                <div className="edit_users_popup_data_not_data">
                                    <span>Nombre:</span>
                                    <span>Teléfono:</span>
                                    <span>Rol:</span>
                                    <span>Localización:</span>
                                </div>
                                <div className="edit_users_popup_data_actual_data">
                                    <input
                                    type={'text'}
                                    onChange={(e) => {setNewName(e.target.value); setNewPhone(''); setNewRole(''); setNewLocationId('')}}
                                    value={newName}
                                    />
                                    <input
                                    type={'text'}
                                    onChange={(e) => {setNewPhone(e.target.value); setNewName(''); setNewRole(''); setNewLocationId('')}}
                                    value={newPhone}
                                    />
                                    <input
                                    type={'text'}
                                    onChange={(e) => {setNewRole(e.target.value); setNewName(''); setNewPhone(''); setNewLocationId('')}}
                                    value={newRole}
                                    />
                                    <select onChange={(e) => {setNewLocationId(e.target.value); setNewName(''); setNewPhone(''); setNewRole('')}}>
                                    {availableLocations.map((location) => {
                                        return(
                                            <option key={location.id} value={location.id}>{location.name}</option>
                                        )
                                    })}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="edit_users_popup_container_change_data">
                        <div className="edit_users_popup_change_data_buttons">
                            <Link id="edit_users_update_button" onClick={(e) => updateUser()}>Actualizar datos</Link>
                            <Link id="edit_users_cancel_button" onClick={(e) => setIsEditUserPopUp(false)}>Cancelar</Link>
                            <span>---- Zona de peligro ----</span>
                            <Link id="edit_users_delete_button" onClick={(e) => setDeleteUser(true)}>Eliminar Usuario</Link>
                            {deleteUser &&
                                <div className="edit_users_delete_user_background">
                                    <div className="edit_users_delete_user_container">
                                        <span>¿Estás seguro de que deseas eliminar este perfil?</span>
                                        <div className="edit_users_delete_user_buttons_container">
                                            <Link id="edit_users_delete_button_delete" onClick={deleteCurrentUser}>Eliminar</Link>
                                            <Link id="edit_users_delete_button_return" onClick={(e) => setDeleteUser(false)}>Regresar</Link>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
              </div>
          }
        </div>
    )
}