import { createContext } from "react";

export const ServiceContext = createContext();

export const ServiceContextProvider = ({children}) => {
    return <ServiceContextProvider value={{name: "Hola"}}>
        {children}
    </ServiceContextProvider>
}