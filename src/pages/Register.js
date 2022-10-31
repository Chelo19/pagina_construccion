import {useState} from 'react';
import {supabase} from '../supabase/client';


function RegisterUser(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [service, setName] = useState(''); 
    const [location, setLocation] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await supabase.from("account").insert({
            email: email,
            password: password,
            name: service,
            location: location
        });
        console.log(result);
    }

    return(
        <div>

            <form onSubmit={handleSubmit}>
                <br/>
                Registro de usuario
                <br/>
                <input type="email" name="email" placeholder="youremail@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                /><br/>
                <input type="password" name="password" placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                /><br/>
                <input type="text" name="service" placeholder="Write a name"
                    onChange={(e) => setName(e.target.value)}
                /><br/>
                <input type="text" name="location" placeholder="Write a location"
                    onChange={(e) => setLocation(e.target.value)}
                /><br/>

                <button>
                    Guardar
                </button>
            </form>

        </div>
    );
}

export default RegisterUser;