import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import UserArea from '../components/UserArea';
import RemoveFromDB from '../components/RemoveFromDB';
import AddToDB from '../components/AddToDB';
import FetchDB from '../components/FetchDB';
import '../styles/Home.css';


export default function Home(){

    useEffect(() => {       
        insertUuid();       
    }, [])                  

    const insertUuid = async () => {

        const { data: { user } } = await supabase.auth.getUser();

        if(user){
            const { data, error } = await supabase
            .from('account')
            .select()
            .eq('email', user.email);
            
            if(data[0].uuid == null){
                console.log("ENTRO");
                const { errorInsert } = await supabase
                .from('account')
                .update({uuid: user.id})
                .eq('email', user.email)
            }
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
                <div className='our_projects_presentation'>
                    <a href='/Login' className='our_projects_presentation_text'>
                        OUR PROJECTS
                    </a>
                </div>
                <div className='our_projects'>
                    <div className='our_projects_container'>
                        <a href='/Login' className='our_projects_container_button'>
                            <div className='our_projects_container_button_top'></div>
                            <div className='our_projects_container_button_bottom'>
                                <div className='our_projects_container_button_bottom_text'>
                                    BUTTON 1
                                </div>
                            </div>
                        </a>
                        <a href='/Login' className='our_projects_container_button'>
                            <div className='our_projects_container_button_top'></div>
                            <div className='our_projects_container_button_bottom'>
                                <div className='our_projects_container_button_bottom_text'>
                                    BUTTON 2
                                </div>
                            </div>
                        </a>
                        <a href='/Login' className='our_projects_container_button'>
                            <div className='our_projects_container_button_top'></div>
                            <div className='our_projects_container_button_bottom'>
                                <div className='our_projects_container_button_bottom_text'>
                                    BUTTON 3
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
                <br/><br/><br/><br/>
                <div className='staff'>
                    <div className='staff_left'>
                        <div className='staff_left_container'>
                            <div className='staff_left_container_text'>
                                Contamos con los mejores socios para la realización de tu servicio
                            </div>
                        </div>
                    </div>
                    <div className='staff_right'>
                        <div className='staff_right_card'>
                            <div className='staff_right_card_top'></div>
                            <div className='staff_right_card_bottom'>
                                <div className='staff_right_card_bottom_content'>
                                        <a className='staff_right_card_bottom_content_name' href='/Login'>Marcelo De León</a>
                                        <div className='staff_right_card_bottom_content_icons'>
                                            <a className='staff_right_card_bottom_content_icons_individual' href='/Login'><img id='logo_fb' src={require('../img/certificate.png')}></img></a>
                                            <a className='staff_right_card_bottom_content_icons_individual' href='/Login'><img id='logo_mail' src={require('../img/certificate.png')}></img></a>
                                            <a className='staff_right_card_bottom_content_icons_individual' href='/Login'><img id='logo_phone' src={require('../img/certificate.png')}></img></a>
                                        </div>
                                    </div>
                                </div>
                        </div>
                        <div className='staff_right_card'>
                            <div className='staff_right_card_top'></div>
                            <div className='staff_right_card_bottom'>
                                <div className='staff_right_card_bottom_content'>
                                        <a className='staff_right_card_bottom_content_name' href='/Login'>Marcelo De León</a>
                                        <div className='staff_right_card_bottom_content_icons'>
                                            <a className='staff_right_card_bottom_content_icons_individual' href='/Login'><img id='logo_fb' src={require('../img/certificate.png')}></img></a>
                                            <a className='staff_right_card_bottom_content_icons_individual' href='/Login'><img id='logo_mail' src={require('../img/certificate.png')}></img></a>
                                            <a className='staff_right_card_bottom_content_icons_individual' href='/Login'><img id='logo_phone' src={require('../img/certificate.png')}></img></a>
                                        </div>
                                    </div>
                                </div>
                        </div>
                        <div className='staff_right_card'>
                            <div className='staff_right_card_top'></div>
                            <div className='staff_right_card_bottom'>
                                <div className='staff_right_card_bottom_content'>
                                    <a className='staff_right_card_bottom_content_name' href='/Login'>Marcelo De León</a>
                                    <div className='staff_right_card_bottom_content_icons'>
                                        <a className='staff_right_card_bottom_content_icons_individual' href='/Login'><img id='logo_fb' src={require('../img/certificate.png')}></img></a>
                                        <a className='staff_right_card_bottom_content_icons_individual' href='/Login'><img id='logo_mail' src={require('../img/certificate.png')}></img></a>
                                        <a className='staff_right_card_bottom_content_icons_individual' href='/Login'><img id='logo_phone' src={require('../img/certificate.png')}></img></a>
                                    </div>
                                </div>
                            </div>
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
