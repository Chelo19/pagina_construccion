import '../styles/ClientService.css';

export default function ClientService(){
    return(
        <div className="client_service_background">
            <div className='client_service'>
                <div className='client_service_item' id='left_client_service'>
                    <div className='client_service_item_title'>
                        <img src={require('../img/serviciocliente.png')} id='client_service_logo'/>
                        <a className='client_service_title'>
                            Servicio al cliente
                        </a>
                    </div>
                    <div className='client_service_item_content'>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam pharetra diam felis, non scelerisque nulla posuere eu. Morbi rhoncus magna ac mi scelerisque, et congue massa tristique. In quis sodales erat. Vivamus commodo neque eu lacus congue condimentum. Pellentesque egestas ut lorem vel eleifend. In hendrerit aliquet ligula quis egestas. Maecenas nec nisl ac massa ultricies consequat. Nam finibus nulla orci, quis aliquam ligula facilisis quis.
                    </div>
                </div>
                <div className='client_service_item' id='right_client_service'>
                    <div className='client_service_item_title'>
                        <img src={require('../img/serviciocliente.png')} id='client_service_logo'/>
                        <a className='client_service_title'>
                            Contactar a un socio
                        </a>
                    </div>
                    <div className='client_service_item_content'>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In quis sodales erat. Vivamus commodo neque eu lacus congue condimentum. Pellentesque egestas ut lorem vel eleifend. In hendrerit aliquet ligula quis egestas. Maecenas nec nisl ac massa ultricies consequat. Nam finibus nulla orci, quis aliquam ligula facilisis quis.
                    </div>
                    <a href='/login' className='client_service_link'>
                        Haz click aquí para contactar a un socio
                    </a>
                </div>
            </div>
        </div>
    )
}