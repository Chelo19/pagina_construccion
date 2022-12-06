import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase/client";
import "../styles/Categories.css";
import LoadingScreen from "../components/LoadingScreen";
import { Link } from "react-router-dom";

export default function AddServiceHomeSelectCategory(){
    let { id } = useParams();
    
    const [loadingScreen, setLoadingScreen] = useState(true);
    const [categories, setCategories] = useState();

    const showCategories = async () => {
    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("location_id", id);
    setCategories(data);
    console.log(data);
    setLoadingScreen(false);
    };

    useEffect(() => {
    showCategories();
    console.log(categories)
    }, [loadingScreen]);

    return(
        <div className="background_categories">
            <div className="categories_gallery">
            {!loadingScreen 
                ? categories.map((category) => {
                return(
                    <Link to={`/add-service-home/${category.id}`} key={category.id} className='category_item'>
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