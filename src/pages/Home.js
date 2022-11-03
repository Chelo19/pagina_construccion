import {useEffect} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import UserArea from '../components/UserArea';
import RemoveFromDB from '../components/RemoveFromDB';
import AddToDB from '../components/AddToDB';
import FetchDB from '../components/FetchDB';
import '../styles/Home.css';


function Home(){

    const navigate = useNavigate();
    
    useEffect(() => {
        getUserMethod();
    });

    const getUserMethod = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(!user){
            console.log("No existe sesion, redireccionando");
            navigate('/login');
        } else{
            console.log("Si hay sesion");
        }
    }

    return(
        <body>
            <div>
                <div className='background_img'>
                    DREC CONSTRUCCIONES
                </div>
                <div className='big_buttons'>
                    <div className='big_buttons_container'>
                        <div className='big_buttons_container_buttons'>
                            <img id='construcciones' className='big_buttons_container_buttons_img' src={require('../img/certificate.png')}/>
                            <a href='/Login' className='big_buttons_container_buttons_description'>
                                <div className='big_buttons_container_buttons_description_text'>
                                    CONSTRUCCIONES
                                </div>
                            </a>
                        </div>
                        <div className='big_buttons_container_buttons'>
                            <img id='construcciones' className='big_buttons_container_buttons_img' src={require('../img/certificate.png')}/>
                            <a href='/Login' className='big_buttons_container_buttons_description'>
                                <div className='big_buttons_container_buttons_description_text'>
                                    MATERIALES
                                </div>
                            </a>
                        </div>
                        <div className='big_buttons_container_buttons'>
                            <img id='construcciones' className='big_buttons_container_buttons_img' src={require('../img/certificate.png')}/>
                            <a href='/Login' className='big_buttons_container_buttons_description'>
                                <div className='big_buttons_container_buttons_description_text'>
                                    SERVICIOS
                                </div>
                            </a>
                        </div>
                        <div className='big_buttons_container_buttons'>
                            <img id='construcciones' className='big_buttons_container_buttons_img' src={require('../img/certificate.png')}/>
                            <a href='/Login' className='big_buttons_container_buttons_description'>
                                <div className='big_buttons_container_buttons_description_text'>
                                    NOSOTROS
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <br/>
            <UserArea/>
            <br/>
            <AddToDB/>
            <br/>
            <FetchDB/>
            <br/>
            <RemoveFromDB/>
        </body>
        
    );
}

export default Home;