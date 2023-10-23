import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";
import '../styles/AuthLogin.css';

export default function AuthLogin(){
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    const navigate = useNavigate();

    const hangleSignIn = async (e) => {
        e.preventDefault();
        try{
            console.log(email + " " + password);
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
              });
            console.log(data);
            if (error) throw error;
            alert("Succesfully logged in");
            document.location.reload();
            navigate('/');
        } catch(e){
            alert(e.message);
        }
    };

    const userSituation = async (e) => {
        const { data: { user } } = await supabase.auth.getUser();
        console.log(user);
    }

    return(
        <div>
            <div className="credentials_box">
                <div className="credentials_box_container">
                    <div className="credentials_box_container_main">
                        <h1>Sign In</h1>
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

                        <button onClick={hangleSignIn}>
                            Sign In
                        </button>

                        <br/><br/>
                        <button onClick={userSituation}>
                            User Situation
                        </button>
                        <br/><br/>
                            Don't have an account?<br/>
                        <a href='/Register'>Click here</a>
                    </div>
                </div>
            </div>
        </div>
    )
}