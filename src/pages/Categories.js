import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import { useNavigate } from 'react-router-dom';



export default function Categories(){
    
    const [location, getLocation] = useState(null);
    const navigate = useNavigate();

    
}