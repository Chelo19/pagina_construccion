import '../styles/ClientService.css';

export default function ClientService(){
    return(
        <div className="client_service_background">
            <div className='client_service'>
                <div className='client_service_item'>
                    <div className='client_service_item_title'>
                            <img src={require('../img/serviciocliente.png')} id='client_service_logo'/>
                        <a className='client_service_title'>
                            Servicio al cliente
                        </a>
                    </div>
                    <div className='client_service_item_content'>
                        <div>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus venenatis turpis non quam lacinia, ac scelerisque dui porta. Integer maximus, justo a mollis hendrerit, urna turpis auctor odio, ac molestie metus eros eget nisi. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Fusce at hendrerit libero, a venenatis erat. Orci varius natoque penatibus 
                        </div>
                    </div>
                </div>
                <div className='client_service_item'>
                    <div className='client_service_item_content'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus venenatis turpis non quam lacinia, ac scelerisque dui porta. Integer maximus, justo a mollis hendrerit, urna turpis auctor odio, ac molestie metus eros eget nisi. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Fusce at hendrerit libero, a venenatis erat. Orci varius natoque penatibus
                    </div>
                    <a href='/login' className='client_service_link'>
                        Haz click aquí para contactar a un empleado
                    </a>
                </div>
            </div>
        </div>
    )
}