import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/EditContactUsers.css";
import LoadingScreen from "../components/LoadingScreen";
import { Link } from "react-router-dom";

export default function EditContactUsers(){
    const { id } = useParams();
    const navigate = useNavigate();

    const [loadingScreen, setLoadingScreen] = useState(true);
    const [noItems, setNoItems] = useState(false);
    const [contactUsers, setContactUsers] = useState(null);
    const [contactUsersDisplay, setContactUsersDisplay] = useState(null);
    const [stateName, setStateName] = useState(null);
    const [contactSelection, setContactSelection] = useState(null);
    const [removeContactAlert, setRemoveContactAlert] = useState(false);

    useEffect(() => {
        getUserData();
    }, [loadingScreen])

    const getUserData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(user){
            const { data, error } = await supabase
            .from('account')
            .select()
            .eq('uuid', user.id);
            if(data[0].role == 'gerente'){
                getUserStateId(data[0].admin_location_id);
            }
            else{
                window.alert("No tienes los permisos para acceder a este lugar");
                navigate("/");
            }
        }
    }

    const getUserStateId = async (adminLocation) => {
        const { data, error } = await supabase
        .from('location')
        .select('state_id')
        .eq('id', adminLocation);
        getContactUser(data[0].state_id);
    }

    const getContactUser = async (adminStateId) => {
        const { data, error } = await supabase
        .from('account')
        .select()
        .order('id', { ascending: true })
        .not('contact_state_id', 'is', null);
        // .match({contact_state_id: adminStateId});        por si quiero escalarlo más
        if(data.length == 0){
            setNoItems(true);
            setLoadingScreen(false);
        }
        else{
            setContactUsers(data);
            getStateName(data);
        }
        if(!data){
            setNoItems(true);
            setLoadingScreen(false);
        }
    }

    const getStateName = async (contactUsers) => {
        let x = [];
        for(var i = 0 ; i < contactUsers.length ; i++){
            const { data, error } = await supabase
            .from('states')
            .select()
            .eq('id', contactUsers[i].contact_state_id);
            contactUsers[i].state_name = data[0].name;
            x.push(contactUsers[i]);
        }
        console.log(x);
        setContactUsersDisplay(x);
        setLoadingScreen(false);
    }

    const removeContact = async () => {
        const { error } = await supabase
        .from('account')
        .update({ contact_state_id: null })
        .eq('uuid', contactSelection.uuid);
        document.location.reload();
    }


    return(
        <div className="edit_contact_users_select_category_background">
        {!loadingScreen ? 
          <div className="edit_contact_users_select_category_gallery">
              <div className="edit_contact_users_select_category_container">
                {noItems ?
                  <div className="edit_contact_users_no_items_alert">No se encontraron resultados</div>
                : 
                <>
                  <div className="edit_contact_users_select_category_item_names">
                      <span>Id</span>
                      <span>Email</span>
                      <span>Nombre</span>
                      <span>Teléfono</span>
                      <span>Estado</span>
                  </div>
                  {contactUsersDisplay.map((user) => {
                    return(
                        <Link key={user.id} onClick={(e) => {setContactSelection(user); setRemoveContactAlert(true)}} className='edit_contact_users_select_category_item'>
                          <div className='edit_contact_users_select_category_item_container'>
                            <span>{user.id}</span>
                            <span>{user.email}</span>
                            <span>{user.name}</span>
                            <span>{user.phone}</span>
                            <span>{user.state_name}</span>
                          </div>
                        </Link>
                    )
                  })}
                </>
                }
              </div>
          </div>
          : <LoadingScreen/>}
          {removeContactAlert &&
          <div className="edit_contact_users_alert_background">
            <div className="edit_contact_users_alert_container">
              <span className="edit_contact_users_alert_text">
                  ¿Estás seguro que deseas quitar al contacto <span>{contactSelection.email}</span>?
              </span>
              <div className="edit_contact_users_alert_submits">
                  <input
                      id="edit_contact_users_alert_accept"
                      type={'submit'}
                      value={"Aceptar"}
                      onClick={removeContact}
                  />
                  <input
                      id="edit_contact_users_alert_return"
                      type={'submit'}
                      value={"Regresar"}
                      onClick={(e) => setRemoveContactAlert(false)}
                  />
              </div>
              <span id="edit_contact_users_alert_confirmation_alert"></span>
            </div>
          </div>
          }
        </div>
    )
}