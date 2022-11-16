import {supabase} from '../../supabase/client';
import '../../styles/Header.css';

export default function HeaderButtonsNoUser(){

    const signOut = async (e) => {
        e.preventDefault();
        try{
            const { error } = await supabase.auth.signOut()
            console.log("SignOut");
            document.location.reload();
            if(error) throw error;
        } catch(e){
            alert(e.message);
        }
    }

    return(
        <div>
            <ul className='horizontal_menu_header'>
                <li><a href='/'>Home</a></li>
                <li>
                    <a href='/account'>Cuenta</a>
                    <ul className='vertical_menu_header'>
                        <li><a href='/my-services'>Mis Servicios</a></li>
                        <li><a href='/client-service'>Servicio al Cliente</a></li>
                        <li><a href='/' onClick={signOut}>Cerrar sesion</a></li>
                    </ul>
                </li>
            </ul>
        </div>
    )
}