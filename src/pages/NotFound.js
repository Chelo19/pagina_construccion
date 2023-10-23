function NotFound(){
    return(
        <div className='loading_screen'>
            <div className='loading_screen_container'>
                <img src={require('../img/logodrecfullsize.png')}/>
                <span>Página no encontrada</span>
            </div>
        </div>
    )
}

export default NotFound