import {useEffect} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import TaskForm from '../components/TaskForm';
import UserArea from '../components/UserArea';

function Home(){

    const navigate = useNavigate();

    return(
        <div>
            <br/>
            <UserArea/>
            <br/>
            <TaskForm/>
        </div>
        
    );
}

export default Home;