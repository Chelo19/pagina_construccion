import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { useNavigate } from "react-router-dom";
import "../styles/Categories.css";
import Service from "./Service";

export default function Categories() {
  const [locationName, setLocationName] = useState(null);
  const [locationId, setLocationId] = useState(null);
  
  const [loadingScreen, setLoadingScreen] = useState(true);
  const [categories, setCategories] = useState(null);

  const navigate = useNavigate();

  const getUserData = async () => {
    try{
      const {
        data: { user },
      } = await supabase.auth.getUser();
  
      const { data, error } = await supabase
        .from("account")
        .select()
        .eq("uuid", user.id);
        
      setLocationName(data[0].location);
      console.log(locationName);        //log
    }
    catch{

    }
  };
  
  const getLocationId = async () => {
    try{
      const { data, error} = await supabase
      .from("location")
      .select()
      .eq("name", locationName);
      setLocationId(data[0].id);    
      console.log(locationId);        //log
    } catch{

    }
  }

  const getCategories = async () => {
    const { data, error } = await supabase
    .from("categories")
    .select()
    .eq("location_id", locationId);
    setCategories(data);
    console.log(categories);    //log
    if(data){
      setLoadingScreen(false);
    }
  }

  const showCategories = async () => {
    
    getUserData();
    getLocationId();
    getCategories();
    
  }
  

  useEffect(() => {
    showCategories();
  }, [loadingScreen]);

  
  return (
    <div className="background_categories">
      <div className="categories_gallery">
      {!loadingScreen 
        ? categories.map((category) => {
          return(
            <div className="category_item" key={category.id} onClick={() => navigate(`/services/${category.id}`)}>
              <div className="category_img">

              </div>
              <div className="category_item_content">
                <div className="category_item_title">
                  <h1>{category.name}</h1>
                </div>
              </div>

            </div>
          )

        })
      
        : (
          <div>Cargando contenido...</div>
        )}
      </div>
    </div>
  );
}
