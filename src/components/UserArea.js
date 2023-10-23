import {supabase} from '../supabase/client';


export default function UserArea(){

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

    const userSituation = async (e) => {
        const { data: { user } } = await supabase.auth.getUser();
        console.log(user);
    }

    return(
        <div>
            <button onClick={signOut}>
                    Logout
            </button>
            <button onClick={userSituation}>
                    userSituation
            </button>
        </div>
    )
}