import {useState} from 'react';
import {supabase} from '../supabase/client';


function AddToDB(){
    const [service, setName] = useState(''); 
    const [location, setLocation] = useState('');

    const addRow = async (e) => {
        e.preventDefault();

        try{
        const result = await supabase.from("services").insert({
            name: service,
            location: location
        });
        console.log(result);

        } catch(e){
            alert(e.message);
        }
    }

    return(
        <div>

            <form onSubmit={addRow}>
                <br/>
                    Service Register
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

export default AddToDB;