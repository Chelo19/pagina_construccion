import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import '../styles/Register.css';


function Register(){

    const navigate = useNavigate();

    useEffect(() => {
        getUserMethod();
    });

    const getUserMethod = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(user) navigate('/');
    }

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [name, setName] = useState(null);
    const [location, setLocation] = useState(null);
    const [user, setUser] = useState(null);

    const hangleSignUp = async (e) => {
        e.preventDefault();
        /*
        const { data, error } = await supabase
        .from('account')
        .select('email')
        .match({email, email})
        if(data[0]){
            console.log("Usuario existente")
            alert("Este usuario ya ha sido registrado")
            return;
        }
        */
        try{
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
              });
            if (error) throw error;
            alert("Check your email");

            const { errorInsert } = await supabase
            .from('account')
            .insert({ email: email, name: name, location: location});
        } catch(e){
            alert(e.message);
        }
    };

    return(
        <div>
            <div className='register_container'>
                <div className='register_container_center'>
                    <div className='register_img_div'>
                        <img id='register_img' src={require('../img/construction_img2.jpg')}/>
                    </div>
                    <div className='register_right'>
                        <div className='register_form'>
                            <h2>Registrarse</h2>
                            <div className='register_input'>
                                <span>Email</span>
                                <input 
                                    type = "email" 
                                    name = "email" 
                                    placeholder = "tuemail@gmail.com"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className='register_input'>
                                <span>Contraseña</span>
                                <input 
                                    type = "password" 
                                    name = "password" 
                                    placeholder = "contraseña"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className='register_input'>
                                <span>Nombre</span>
                                <input 
                                    type = "text" 
                                    name = "name" 
                                    placeholder = "nombre"
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className='register_input'>
                                <span>Localización</span>
                                <select name='location' onChange={(e) => setLocation(e.target.value)}>
                                    <option value={"Monterrey"}>Localización</option>
                                    <option value={"Monterrey"}>Monterrey</option>
                                    <option value={"Sabinas"}>Sabinas</option>
                                    <option value={"Nuevo Laredo"}>Nuevo Laredo</option>
                                </select>
                            </div>
                            <div id='register_button'>
                                <a href='#' onClick={hangleSignUp}>Registrarse</a>
                            </div><br/>
                            <div className='register_input'>
                                ¿Ya tienes una cuenta?&nbsp;
                                <a href='/Login'>Haz click aquí</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>          
        </div>
    );
}

export default Register;