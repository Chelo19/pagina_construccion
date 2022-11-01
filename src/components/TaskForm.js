import {useState} from 'react';
import {supabase} from '../supabase/client';


function TaskForm(){
    const [service, setName] = useState(''); 
    const [location, setLocation] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = supabase.auth.getSession();        // para saber si hay sesion
        console.log(user);

        const result = await supabase.from("services").insert({
            name: service,
            location: location
        });
        console.log(result);
    }

    return(
        <div>

            <form onSubmit={handleSubmit}>
                <br/>
                Registro de servicio
                <br/>
                <input type="text" name="service" placeholder="Write a name"
                    onChange={(e) => setName(e.target.value)}
                /><br/>
                <input type="text" name="location" placeholder="Write a location"
                    onChange={(e) => setLocation(e.target.value)}
                /><br/>

                <button>
                    Save
                </button>
            </form>

        </div>
    );
}

export default TaskForm;