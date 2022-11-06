import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import '../styles/AuthRegister.css';

export default function AuthRegister(){
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [name, setName] = useState(null);
    const [location, setLocation] = useState(null);
    const [user, setUser] = useState(null);

    const hangleSignUp = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase
        .from('account')
        .select('email')
        .match({email, email})
        if(data[0]){
            console.log("Usuario existente")
            alert("Este usuario ya ha sido registrado")
            return;
        }
        try{
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
              });
            if (error) throw error;
            alert("Check your email");

            const { errorInsert } = await supabase
            .from('account')
            .insert({ email: email, name: name, location: location})
            userSituation();
        } catch(e){
            alert(e.message);
        }
        
    };

    const userSituation = async (e) => {
        const { data: { user } } = await supabase.auth.getUser();
        console.log(user);
        setUser(user);
    }

    return(
        <div> 
            <div className="credentials_box">
                <div className="credentials_box_container">
                    <div className="credentials_box_container_main">
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
                        <input 
                            type = "text" 
                            name = "name" 
                            placeholder = "Name"
                            onChange={(e) => setName(e.target.value)}
                        /><br/>
                        <input 
                            type = "text" 
                            name = "location" 
                            placeholder = "Location"
                            onChange={(e) => setLocation(e.target.value)}
                        /><br/>

                        <button onClick={hangleSignUp}>
                            Sign Up
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