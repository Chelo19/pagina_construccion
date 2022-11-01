import {useEffect} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import UserArea from '../components/UserArea';
import RemoveFromDB from '../components/RemoveFromDB';
import AddToDB from '../components/AddToDB';

function Home(){

    const navigate = useNavigate();
    
    useEffect(() => {
        getUserMethod();
    });

    const getUserMethod = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(!user){
            console.log("No existe sesion, redireccionando");
            navigate('/login');
        } else{
            console.log("Si hay sesion");
        }
    }

    return(
        <div>
            <br/>
            <UserArea/>
            <br/>
            <AddToDB/>
            <br/>
            <RemoveFromDB/>
        </div>
        
    );
}

export default Home;