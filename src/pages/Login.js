import {useState} from 'react';
import {supabase} from '../supabase/client';

function Login(){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
        const result = await supabase.auth.signInWithOtp({
            email,
        });
        } catch (error) {
            console.error(error);
        }
        
    };


    return(
        <div>
            <form onSubmit={handleSubmit}>
            <input 
                type = "email" 
                name = "email" 
                placeholder = "youremail@site.com"
                onChange={(e) => setEmail(e.target.value)}
            />
                <button>
                    Send
                </button>
            </form>
        </div>
    );
}

export default Login