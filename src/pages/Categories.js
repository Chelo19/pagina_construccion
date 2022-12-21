import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase/client";
import "../styles/Categories.css";
import LoadingScreen from "../components/LoadingScreen";
import { Link } from "react-router-dom";

export default function Categories() {
  let { id } = useParams();
  
  const [loadingScreen, setLoadingScreen] = useState(true);
  const [categories, setCategories] = useState();
  const [noCategories, setNoCategories] = useState(false);

  const navigate = useNavigate();

  const showCategories = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("location_id", id)
      .not('img_url', 'is', null);
    if(data.length == 0){
      setNoCategories(true); 
      window.alert("Aún no tenemos servicios en tu área. ¡Estamos trabajando para llegar hasta ti!");
      navigate('/');
    }
    setCategories(data);
    console.log(data);
    setLoadingScreen(false);
  };

  useEffect(() => {
    showCategories();
  }, [loadingScreen]);

  
  return (
    <div className="background_categories">
      {!loadingScreen ?
      <div className="categories_container">
        <span className="categories_title">Las categorías de nuestros servicios</span>
        <div className="categories_cards_container">
          {!noCategories ?
            <>
              {categories.map((category) => {
                return(
                  <Link to={`/services/${category.id}`} className="categories_card" key={category.id}>
                    <img src={category.img_url[0]}/>
                    <div className="categories_card__head">
                      <span>{category.name}</span>
                    </div>
                  </Link>
                )
              })}
            </>
          : <div className='categories_no_items_alert'>
              <span>Aún no tenemos servicios en tu área.</span>
              <span>¡Estamos trabajando para llegar hasta ti!</span>
            </div>}
        </div>
      </div>
      : <LoadingScreen/>}
    </div>
  );
}
