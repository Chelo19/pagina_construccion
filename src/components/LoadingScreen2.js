import '../styles/LoadingScreen2.css';
import GridLoader from "react-spinners/GridLoader";
import SyncLoader from "react-spinners/SyncLoader";

export default function LoadingScreen2(){
    return(
        <div className='loading_screen2_background'>
            <div className='loading_screen2_container'>
                <div className='loading_screen2_spinner'>
                    {/* <GridLoader color="#ff7f22"
                        size={50}/> */}
                    <SyncLoader color="#ff7f22"
                    size={40} />
                    {/* <span>Cargando...</span> */}
                </div>
            </div>
        </div>
    )
}