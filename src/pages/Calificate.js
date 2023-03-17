import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';
import { Link } from "react-router-dom";
import LoadingScreen2 from '../components/LoadingScreen2';

import '../styles/GenericAssets.css';

export default function Calificate(){

    const [isLoading, setIsLoading] = useState(false);

    return(
        <>
        {!isLoading ?
            <div className="generic_background">
                <div className="generic_container">
                    
                </div>
            </div>
        :
        <LoadingScreen2/>
        }
        </>
    )
}