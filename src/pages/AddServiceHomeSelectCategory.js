import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase/client";
import "../styles/AddServiceHomeSelectCategory.css";
import LoadingScreen from "../components/LoadingScreen";
import { Link } from "react-router-dom";

export default function AddServiceHomeSelectCategory(){
    let { id } = useParams();
    const navigate = useNavigate();
    
    const [loadingScreen, setLoadingScreen] = useState(true);
    const [categories, setCategories] = useState();

    const checkIfAdmin = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(user){
            const { data, error } = await supabase
            .from('account')
            .select()
            .eq('uuid', user.id);
            if(data[0].role == 'administrador' || data[0].role == 'gerente'){
                showCategories();
            }
            else{
                window.alert("No tienes los permisos para acceder a este lugar");
                navigate("/");
            }
        }
        else{
            window.alert("Inicia sesión como administrador para acceder");
            navigate("/login");
        }
    }


    const showCategories = async () => {
        const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("location_id", id);
        setCategories(data);
        setLoadingScreen(false);
    };


    useEffect(() => {
    checkIfAdmin();
    console.log(categories)
    }, [loadingScreen]);

    return(
        <div className="add_service_home_categories_background">
            {!loadingScreen ?
            <div className="add_service_home_categories_gallery">
                <div className="add_service_home_categories_container">
                    <div className="add_service_home_category_item_names">
                        <span>Id</span>
                        <span>Creado el</span>
                        <span>Nombre</span>
                    </div>
                    {categories.map((category) => {
                    return(
                        <Link to={`/add-service-home/${category.id}`} key={category.id} className='add_service_home_category_item'>
                            <span>{category.id}</span>
                            <span>{category.created_at}</span>
                            <span>{category.name}</span>
                        </Link>);
                    })}
                </div>
            </div>
            : <LoadingScreen/>}
        </div>
    )

}