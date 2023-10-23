import '../styles/LoadingScreen.css';

export default function LoadingScreen(){
    return(
        <div className='loading_screen'>
            <div className='loading_screen_container'>
                <img src={require('../img/logodrecfullsize.png')}/>
                <span>Cargando...</span>
            </div>
        </div>
    )
}