import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';

function Login(){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await supabase.auth.signInWithOtp({email});
        } catch (error){
            console.error(error);
        }
    };
    
    const loginNoAuth = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase
        .from('account')
        .select('password')
        .match({email});
        console.log(data);
        if(data.length == 0){
            document.getElementById('wrongPassEmail').innerHTML='Wrong Password or Email';
        }
        else{
            if(data[0].password == password){
                navigate('/');
            }
            else{
                document.getElementById('wrongPassEmail').innerHTML='Wrong Password or Email';
            }
        }
    }

    return(
        <div>
            <br/>
            <form onSubmit={handleSubmit}>
                <input 
                    type = "email" 
                    name = "email" 
                    placeholder = "youremail@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button>
                    Send
                </button>
            </form>
            <br/>
            <form onSubmit={loginNoAuth}>
                <input
                    type = "email"
                    name = "email"
                    placeholder = "youremail@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                /><br/>
                <input
                    type = "password"
                    name = "password"
                    placeholder = "password"
                    onChange={(e) => setPassword(e.target.value)}
                /><br/>
                <button>
                    Send
                </button>
                <br/><br/>
                <div id="wrongPassEmail"></div>
            </form>
        </div>
    );
}

export default Login;