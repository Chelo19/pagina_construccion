import { useEffect, useState } from 'react';
import {supabase} from '../supabase/client';
import LoadingScreen from '../components/LoadingScreen';
import { useNavigate, useParams } from "react-router-dom";
import '../styles/EditServices.css';
import { Link } from 'react-router-dom';

export default function EditCategories(){
    let { id } = useParams();

    const [loadingScreen, setLoadingScreen] = useState(true);
    const [categories, setCategories] = useState();

    const navigate = useNavigate();

    const showCategories = async () => {
        const { data, error } = await supabase
        .from("categories")
        .select("*");
        setCategories(data);
        setLoadingScreen(false);
    };

    useEffect(() => {
        showCategories();
        console.log(categories);
    }, [loadingScreen]);

    return(
    <div className="edit_services_services_background">
        <div className="edit_services_services_gallery">
            {!loadingScreen
              ? categories.map((category) => {
                return (
                    <Link to={`/edit-category/${category.id}`} style={{ color: 'inherit', textDecoration: 'inherit'}} className="edit_services_services_item">
                        <div className="edit_services_services_img">
                            <img src={category.img_url[0]}/>
                        </div>
                        <div className="edit_services_services_item_content">
                            <div className="edit_services_services_title">
                                <h1>{category.name}</h1>
                            </div>
                            <div className="edit_services_services_id">
                                <span>id localización: <b>{category.location_id}</b></span>
                            </div>
                            <div className="edit_services_services_id">
                                <span>id categoría: <b>{category.id}</b></span>
                            </div>
                        </div>
                    </Link>
                  );
                })
                : <LoadingScreen/>}
        </div>
      </div>
    )
}