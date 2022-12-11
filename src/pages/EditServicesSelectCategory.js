import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase/client";
import "../styles/Categories.css";
import LoadingScreen from "../components/LoadingScreen";
import { Link } from "react-router-dom";

export default function EditServicesSelectCategory(){
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
            if(data[0].role != 'administrador'){
                window.alert("No tienes los permisos para acceder a este lugar");
                navigate("/");
            }
            if(data[0].role == 'administrador'){
                showCategories();
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
        <div className="background_categories">
            <div className="categories_gallery">
            {!loadingScreen 
                ? categories.map((category) => {
                return(
                    <Link to={`/edit-services/${category.id}`} key={category.id} className='category_item'>
                        <div className="category_img">
                            <img src={category.img_url[0]}/>
                        </div>
                        <div className="category_item_content">
                            <div className="category_item_title">
                            <h1>{category.name}</h1>
                            </div>
                        </div>
                    </Link>
                )})
                : <LoadingScreen/>}
            </div>
        </div>
    )

}