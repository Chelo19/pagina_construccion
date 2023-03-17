import "../src/styles/App.css";
import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { createBrowserHistory } from "history";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './index.css'

import Header2 from "./components/Header2";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Account from "./pages/Account";
import Categories from "./pages/Categories";
import Categories2 from "./pages/Categories2";
import Services from "./pages/Services";
import Services2 from "./pages/Services2";
import Service from "./pages/Service";
import Service2 from "./pages/Service2";
import MyServices from "./pages/MyServices";
import ClientService from "./pages/ClientService";
import UpdatePassword from "./pages/UpdatePassword";
import RecoverPassword from "./pages/RecoverPassword";
import AdminHub from "./pages/AdminHub";
import EditServicesSelectCategory from "./pages/EditServicesSelectCategory";
import EditServices from "./pages/EditServices";
import EditService from "./pages/EditService";
import Footer from "./components/Footer";
import EditCategories from "./pages/EditCategories";
import EditCategory from "./pages/EditCategory";
import EditEnterprises from "./pages/EditEnterprises";
import AddCategory from "./pages/AddCategory";
import AddServiceSelectCategory from "./pages/AddServiceSelectCategory";
import AddService from "./pages/AddService";
import AddService2 from "./pages/AddService2";
import AddServiceHomeSelectCategory from "./pages/AddServiceHomeSelectCategory";
import AddServiceHome from "./pages/AddServiceHome";
import RemoveServiceHome from "./pages/RemoveServiceHome";
import ConfirmedEmail from "./pages/ConfirmedEmail";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import ManagerHub from "./pages/ManagerHub";
import EditUsers from "./pages/EditUsers";
import CreatePosts from "./pages/CreatePosts";
import EditPostsSelectUser from "./pages/EditPostsSelectUser";
import EditPosts from "./pages/EditPosts";
import EditContactUsers from "./pages/EditContactUsers";
import AddContactUsers from "./pages/AddContactUsers";
import Profiles from "./pages/Profiles";
import UserProfile from "./pages/UserProfile";
import AllyProfile from "./pages/AllyProfile";
import Cotizaciones from "./pages/Cotizaciones";
import UserCotizaciones from "./pages/UserCotizaciones";
import Profile from "./pages/Profile";
import PendingCotizaciones from "./pages/PendingCotizaciones";
import Requests from "./pages/Requests";
import WebPage from "./pages/WebPage";
import ProfileList from "./pages/ProfileList";
import SelectAllies from "./pages/SelectAllies";
import RequestAlly from "./pages/RequestAlly";
import Admin from "./pages/Admin";
import AcceptedCotizaciones from "./pages/AcceptedCotizaciones";
import MyCotizaciones from "./pages/MyCotizaciones";
import WebPageServices from "./pages/WebPageServices";
import WebPageCategories from "./pages/WebPageCategories";
import AllyHub from "./pages/AllyHub";
import MyProfile from "./pages/MyProfile";
import PendingCotizacionesMore from "./pages/PendingCotizacionesMore";
import Calificate from "./pages/Calificate";
import CotizacionesPendientesAliado from "./pages/CotizacionesPendientesAliado";
import CotizacionesContestadasPorAliados from "./pages/CotizacionesContestadasPorAliados";

import { supabase } from "./supabase/client";

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff7f22',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#FFFFFF',
      contrastText: '#FFFFFF'
    }
  }
});

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/login");
      }
    });
  });

  const navRegister = (e) => {
    navigate("/register");
  };

  const navLogin = (e) => {
    navigate("/login");
  };

  const navHome = (e) => {
    navigate("/");
  };

  const refreshPage  = () => {
    navigate(0);
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        {/* <Header /> */}
        <Header2/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:reload" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/home/:reload" element={<Home />} />
          <Route path="/#menu_div" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/account" element={<Account />} />
          <Route path="/categories/:id" element={<Categories />} />
          <Route path="/categories2" element={<Categories2 />} />
          <Route path="/categories/:reload/:id" element={<Categories />} />
          <Route path="/services/:id" element={<Services />} />
          <Route path="/services2/:id" element={<Services2 />} />
          <Route path="/service/:id" element={<Service />} />
          <Route path="/service2/:id" element={<Service2 />} />
          <Route path="/my-services" element={<MyServices />} />
          <Route path="/client-service/:reload" element={<ClientService />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/recover-password" element={<RecoverPassword />} />
          <Route path="/admin-hub/:reload" element={<AdminHub />} />
          <Route path="/edit-services-select-category/:id" element={<EditServicesSelectCategory />} />
          <Route path="/edit-services" element={<EditServices />} />
          <Route path="/edit-service/:id" element={<EditService />} />
          <Route path="/edit-categories" element={<EditCategories/>} />
          <Route path="/edit-category/:id" element={<EditCategory/>} />
          <Route path="/edit-enterprises/:id" element={<EditEnterprises/>} />
          <Route path="/add-category/:id" element={<AddCategory/>}/>
          <Route path="/add-service-select-category/:id" element={<AddServiceSelectCategory/>}/>
          <Route path="/add-service/:id" element={<AddService/>}/>
          <Route path="/add-service2" element={<AddService2/>}/>
          <Route path="/add-service-home-select-category/:id" element={<AddServiceHomeSelectCategory/>}/>
          <Route path="/add-service-home/:id" element={<AddServiceHome/>}/>
          <Route path="/remove-service-home/:id" element={<RemoveServiceHome/>}/>
          <Route path="/create-posts/:id" element={<CreatePosts/>}/>
          <Route path="/edit-posts-select-user/:id" element={<EditPostsSelectUser/>}/>
          <Route path="/edit-posts/:id" element={<EditPosts/>}/>
          <Route path="/confirmed-email" element={<ConfirmedEmail/>}/>
          <Route path="/about-us" element={<AboutUs/>}/>
          <Route path="/contact/:reload" element={<Contact/>}/>
          <Route path="/manager-hub" element={<ManagerHub/>}/>
          <Route path="/manager-hub/:reload" element={<ManagerHub/>}/>
          <Route path="/edit-users/:id" element={<EditUsers/>}/>
          <Route path="/edit-contact-users/:id" element={<EditContactUsers/>}/>
          <Route path="/add-contact-users/:id" element={<AddContactUsers/>}/>
          <Route path="/profiles" element={<Profiles/>}/>
          <Route path="/user-profile" element={<UserProfile/>}/>
          <Route path="/ally-profile" element={<AllyProfile/>}/>
          <Route path="/cotizaciones-pendientes-usuario" element={<Cotizaciones/>}/>
          <Route path="/user-cotizaciones" element={<UserCotizaciones/>}/>
          <Route path="/profile/:id" element={<Profile/>}/>
          <Route path="/cotizaciones-pendientes" element={<PendingCotizaciones/>}/>
          <Route path="/cotizaciones-pendientes-mas/:cotid" element={<PendingCotizacionesMore/>}/>
          <Route path="/requests" element={<Requests/>}/>
          <Route path="/webpage" element={<WebPage/>}/>
          <Route path="/profile-list/:type" element={<ProfileList/>}/>
          <Route path="/select-allies/:cotid" element={<SelectAllies/>}/>
          <Route path="/request-ally" element={<RequestAlly/>}/>
          <Route path="/admin" element={<Admin/>}/>
          <Route path="/accepted-cotizaciones" element={<AcceptedCotizaciones/>}/>
          <Route path="/mis-cotizaciones" element={<MyCotizaciones/>}/>
          <Route path="/webpage-services" element={<WebPageServices/>}/>
          <Route path="/webpage-categories" element={<WebPageCategories/>}/>
          <Route path="/ally-hub" element={<AllyHub/>}/>
          <Route path="/my-profile" element={<MyProfile/>}/>
          <Route path="/calificate" element={<Calificate/>}/>
          <Route path="/cotizaciones-pendientes-aliado" element={<CotizacionesPendientesAliado/>}/>
          <Route path="/cotizaciones-contestadas-por-aliados" element={<CotizacionesContestadasPorAliados/>}/>
        </Routes>
        <Footer/>
      </div>
     </ThemeProvider>
  );
}

export default App;
