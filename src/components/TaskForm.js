import {useState} from 'react';
import {supabase} from '../supabase/client';


function TaskForm(){
    const [service, setName] = useState(''); 
    const [location, setLocation] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();
        const result = await supabase.from("services").insert({
            name: service,
            location: location
        });
        console.log(result);
    }

    return(
        <div>

            <form onSubmit={handleSubmit}>

                <input type="text" name="service" placeholder="Write a name"
                    onChange={(e) => setName(e.target.value)}
                />
                <input type="text" name="location" placeholder="Write a location"
                    onChange={(e) => setLocation(e.target.value)}
                />

                <button>
                    Guardar
                </button>
            </form>

        </div>
    );
}

export default TaskForm;