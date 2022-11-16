import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import '../styles/Header.css';
import HeaderButtonsUser from './subcomponents/HeaderButtonsUser';
import HeaderButtonsNoUser from './subcomponents/HeaderButtonsNoUser';

export default function Header(){

    const [user, setUser] = useState(null);
    var HeaderButtons;

    useEffect(() => {
        getUserMethod();
    });
    
    const getUserMethod = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(user) setUser(user);
    }

    if(user){
        HeaderButtons = <HeaderButtonsNoUser/>;
    }
    else{
        HeaderButtons = <HeaderButtonsUser/>;
    }
    
    return(
        <header>
            <div className='header'>
                <div className='header_top'>
                    <div className='header_top_info'>
                        <div className='header_top_info_row'>
                            <div id='phone'>
                                Cel: 8679999999
                            </div>
                            <div id='social'>
                                Redes sociales
                            </div>
                            <div id='contact'>
                                contacto@gmail.com
                            </div>
                        </div>
                    </div>
                </div>
                <div className='header_bottom'>
                    <div className='header_bottom_row'>
                        <div>
                            <a href='/' id='logo'>DREC</a>
                        </div>
                        <div>
                            {HeaderButtons}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}