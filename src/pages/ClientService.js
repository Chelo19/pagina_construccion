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
                        <div>
                        
                        </div>
                    </div>
                </div>
                <div className='client_service_item' id='right_client_service'>
                    <div className='client_service_item_content'>
                    </div>
                    <a href='/login' className='client_service_link'>
                        Haz click aquí para contactar a un empleado
                    </a>
                </div>
            </div>
        </div>
    )
}