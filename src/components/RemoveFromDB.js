import {useState} from 'react';
import {supabase} from '../supabase/client';


function RemoveFromDB(){
    const [id, setId] = useState(''); 

    const deleteRow = async (e) => {
        e.preventDefault();
        try{
            const { error } = await supabase
            .from('services')
            .delete()
            .eq('id', id);
            } catch(e){
                alert(e.message);
            }
        
    }

    return(
        <div>

            <form onSubmit={deleteRow}>
                <br/>
                    Delete Row
                <br/>
                <input type="number" name="id" placeholder="Write an existing id to delete"
                    onChange={(e) => setId(e.target.value)}
                /><br/>

                <button>
                    Save
                </button>
            </form>

        </div>
    );
}

export default RemoveFromDB;