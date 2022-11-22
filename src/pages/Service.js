import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import '../styles/Service.css';

export default function Service(){
    return(
        <div className='service_background'>
            <div className='service_display'>
                <div className='service_display_left'>
                    <div className='service_gallery'>
                        <div id='main_service_img' className='service_img'>
                            <img src={require('../img/services/service_1.jpg')}/>
                        </div>
                        <div id='first_service_img' className='service_img'>
                            <img src={require('../img/services/service_1.jpg')}/>
                        </div>
                        <div id='second_service_img' className='service_img'>
                            <img src={require('../img/services/service_2.jpg')}/>
                        </div>
                        <div id='third_service_img' className='service_img'>
                            <img src={require('../img/services/service_3.jpg')}/>
                        </div>
                        <div id='fourth_service_img' className='service_img'>
                            <img src={require('../img/services/service_4.jpg')}/>
                        </div>
                    </div>
                </div>
                <div className='service_display_right'>
                    <div className='service_info'>
                        <h2>Construccion de apartamentos</h2>
                        <br/>
                        <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam pharetra diam felis, non scelerisque nulla posuere eu. Morbi rhoncus magna ac mi scelerisque, et congue massa tristique. In quis sodales erat. Vivamus commodo neque eu lacus congue condimentum. Pellentesque egestas ut lorem vel eleifend. In hendrerit aliquet ligula quis egestas. Maecenas nec nisl ac massa ultricies consequat. Nam finibus nulla orci, quis aliquam ligula facilisis quis.</span>
                        <br/>
                        <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam pharetra diam felis, non scelerisque nulla posuere eu. Morbi rhoncus magna ac mi scelerisque, et congue massa tristique. In quis sodales erat. Vivamus commodo neque eu lacus congue condimentum. Pellentesque egestas ut lorem vel eleifend. In hendrerit aliquet ligula quis egestas. Maecenas nec nisl ac massa ultricies consequat. Nam finibus nulla orci, quis aliquam ligula facilisis quis.</span>
                        <br/>
                        <div className='service_info_cotizar'>
                            <a href='/service'>Cotizar servicio con un socio</a>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}