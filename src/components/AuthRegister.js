import { useState } from "react";
import { supabase } from "../supabase/client";

export default function AuthRegister(){
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    const hangleSignUp = async (e) => {
        e.preventDefault();
        try{
            console.log(email + " " + password);
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
              });
            console.log(data);
            if (error) throw error;
            alert("Check your email");
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
            <br/>
            <div>
                <h1>Sign Up</h1>
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
            
                <button onClick={hangleSignUp}>
                    Sign Up
                </button>
                
                <br/><br/>
                <button onClick={userSituation}>
                    User Situation
                </button>

            </div>
        </div>
    )
}