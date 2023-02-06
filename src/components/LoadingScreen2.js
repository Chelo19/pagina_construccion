import '../styles/LoadingScreen2.css';
import GridLoader from "react-spinners/GridLoader";
import SyncLoader from "react-spinners/SyncLoader";
import MoonLoader from "react-spinners/MoonLoader";
import CircleLoader from "react-spinners/CircleLoader";
import ClipLoader from "react-spinners/ClipLoader";
import PuffLoader from "react-spinners/PuffLoader";

export default function LoadingScreen2(){
    return(
        <div className='loading_screen2_background'>
            <div className='loading_screen2_container'>
                <div className='loading_screen2_spinner'>
                    {/* <GridLoader color="#ff7f22"
                        size={50}/> */}
                    {/* <SyncLoader color="#ff7f22"
                    size={40} /> */}
                    {/* <MoonLoader color="#ff7f22"
                    size={120}
                    speedMultiplier={.5}/> */}
                    {/* <CircleLoader color="#ff7f22"
                    size={120}/> */}
                    {/* <ClipLoader color="#ff7f22"
                    size={200}/> */}
                    {/* <span>Cargando...</span> */}
                    <PuffLoader color="#ff7f22"
                    size={240}
                    speedMultiplier={.5}/>
                </div>
            </div>
        </div>
    )
}