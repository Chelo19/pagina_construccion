import {useEffect} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import TaskForm from '../components/TaskForm';

function Home(){

    const navigate = useNavigate();

    return(
        <div>
            Home 
            <button onClick={() => supabase.auth.signOut()}>
                Logout
            </button>
            <TaskForm/>
        </div>
        
    );
}

export default Home;