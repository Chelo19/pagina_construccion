import NavigateBeforeOutlinedIcon from '@mui/icons-material/NavigateBeforeOutlined';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function GoBackButton(){
    let navigate = useNavigate();
    return(
        <Link onClick={() => navigate(-1)} className="generic_back_button">
            <NavigateBeforeOutlinedIcon/> Regresar
        </Link>
    );
}