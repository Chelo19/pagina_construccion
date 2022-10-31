import {useEffect} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import TaskForm from '../components/TaskForm';

function Home(){

    const navigate = useNavigate();

    const signOut = (e) => {
        e.preventDefault();
        supabase.auth.signOut();
        console.log("SignOut");
    }

    return(
        <div>
            <br/>
            <button onClick={signOut}>
                Logout
            </button>
            <TaskForm/>
        </div>
        
    );
}

export default Home;