import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase/client";
import "../styles/Categories2.css";
import "../styles/Gallery.css";
import LoadingScreen2 from "../components/LoadingScreen2";
import { Link } from "react-router-dom";

export default function Categories2() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    const [categories, setCategories] = useState();

    useEffect(() => {
        showCategories();
    }, []);

    const showCategories = async () => {
        const { data, error } = await supabase
        .from("categories")
        .select("*")
        .not('img_url', 'is', null);
        setCategories(data);
        console.log(data);
        if(data){
            setIsLoading(false);
        }
    };
  
    return(
        <>
            {!isLoading ?
                <div className="categories_background">
                    <div className="categories_container">
                        <div className="categories_gallery">
                            {categories.map((category) => {
                                return(
                                    <Link to={`/services2/${category.id}`} className="categories_item" key={category.id}>
                                        <div className="categories_item_img" style={{backgroundImage: `url(${category.img_url[0]})`}}>

                                        </div>
                                        <div className="categories_item_content">
                                            {category.name}
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </div>
                :
                <LoadingScreen2/>
            }
        </>
    );
}
