import { Children, createContext, useEffect, useState } from "react";
import { supabase } from "../supabase/client";

const UserContext = createContext(0)

const UserProvider = ({children}) => {
    const [session, setSession] = useState(false);
    const [user, setUser] = useState(false);
    
    useEffect(() => {
        const { data, error } = supabase.auth.getSession()
        setSession(data);
        setUser(session.user ?? null);

        const { data:authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
            setUser(session?.user ?? null)
        });

        return () => {
            authListener.unsubscribe();
        };
    }, []);

    const value = {
        session,
        user
    }

    return <UserContext.Provider value={value}>
        {children}
    </UserContext.Provider>
}

export default UserContext;