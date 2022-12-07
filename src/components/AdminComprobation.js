import {useEffect, useState} from 'react';
import {supabase} from '../supabase/client';
import {useNavigate} from 'react-router-dom';


export default function AdminComprobation(){
    const navigate = useNavigate();

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
        }
        else{
            window.alert("Inicia sesión como administrador para acceder");
            navigate("/login");
        }
    }
}