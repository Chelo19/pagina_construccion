import { useContext, useEffect } from "react";
import UserContext from "../context/UserContext";
import {useNavigate} from 'react-router-dom';


export const RequireAuth = () => {
    const navigate = useNavigate();
    const { user } = useUser()

    useEffect(() => {
        if(user == null){
            navigate('/*');
        }
    }, [user, navigate]);
}

export const AuthRedirect = () => {
    const navigate = useNavigate();
    const { user } = useUser()

    useEffect(() => {
        if(user){
            navigate('/');
        }
    }, [user, navigate]);
}

export const useUser = () => {
    const context = useContext(UserContext);

    if(context === undefined){
        throw new Error('useUser must be used within a UserContextProvider');
    }

    return context;
}