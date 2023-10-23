import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase/client";
import "../styles/Categories.css";
import LoadingScreen from "../components/LoadingScreen";
import { Link } from "react-router-dom";

export default function Categories() {
  let { id } = useParams();
  let { reload } = useParams();
  
  const [loadingScreen, setLoadingScreen] = useState(true);
  const [categories, setCategories] = useState();
  const [noCategories, setNoCategories] = useState(false);
  var tempCatArray = [];
  var comprobation = false;

  const navigate = useNavigate();

  useEffect(() => {
    if(reload == "0"){
        navigate(`/categories/1/${id}`);
        window.location.reload();
    }
  },[]);

  const showCategories = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("location_id", id)
      .not('img_url', 'is', null);
    if(data.length == 0){
      setNoCategories(true); 
      showStateCategories();
    }
    else{
      console.log(data);
      setCategories(data);
      setLoadingScreen(false);
    }
  };

  const showStateCategories = async () => {
    getLocationState();
  }

  const getLocationState = async () => {
    const { data, error } = await supabase
    .from('location')
    .select(`states(id)`)
    .eq("id", id);
    if(data){
      getLocationsInState(data[0].states.id);
    }
    else{
      window.alert("Aún no tenemos servicios en tu área. ¡Estamos trabajando para llegar hasta ti!");
      navigate('/');
      setLoadingScreen(false);
    }
  };

  const getLocationsInState = async (stateId) => {
    const { data, error } = await supabase
    .from('location')
    .select('id')
    .match({ state_id: stateId });
    if(data){
      if(!comprobation){
        comprobation = true;
        getStateCategories(data);
      }
    }
    else{
      window.alert("Aún no tenemos servicios en tu área. ¡Estamos trabajando para llegar hasta ti!");
      navigate('/');
      setLoadingScreen(false);
    }
  };

  const getStateCategories = async (stateLocations) => {
    for(var i = 0 ; i < stateLocations.length ; i++){
      const { data, error } = await supabase
      .from('categories')
      .select()
      .eq( "location_id", stateLocations[i].id );
      if(data.length > 0){
        for(var j = 0 ; j < data.length ; j++){
          tempCatArray.push(data[j]);
        }
      }
    }
    setCategories(tempCatArray);
    setLoadingScreen(false);
  };

  useEffect(() => {
    showCategories();
  }, [loadingScreen]);


  useEffect(() => {
    console.log(categories);
  })
  
  return (
    <div className="background_categories">
      {!loadingScreen ?
      <div className="categories_container">
        <span className="categories_title">Las categorías de nuestros servicios</span>
        <div className="categories_cards_container">
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
        </div>
      </div>
      : <LoadingScreen/>}
    </div>
  );
}
