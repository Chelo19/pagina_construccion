import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';

function Login(){

    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const [password, setPassword] = useState("");       // aprovechar y hacerlo mejor con password

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            await supabase.auth.signInWithOtp({email});
        } catch (error){
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