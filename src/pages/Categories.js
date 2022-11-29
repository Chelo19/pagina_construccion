import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase/client";
import "../styles/Categories.css";
import LoadingScreen from "../components/LoadingScreen";

export default function Categories() {
  let { id } = useParams();
  
  const [loadingScreen, setLoadingScreen] = useState(true);
  const [categories, setCategories] = useState();

  const navigate = useNavigate();

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

  
  return (
    <div className="background_categories">
      <div className="categories_gallery">
      {!loadingScreen 
        ? categories.map((category) => {
          return(
            <a Link to="/services/" className="category_item" key={category.id} onClick={() => navigate(`/services/${category.id}`)}>
              <div className="category_img">
                <img src={category.img_url[0]}/>
              </div>
              <div className="category_item_content">
                <div className="category_item_title">
                  <h1>{category.name}</h1>
                </div>
              </div>

            </a>
          )

        })
      
        : <LoadingScreen/>}
      </div>
    </div>
  );
}
