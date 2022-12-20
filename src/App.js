import "../src/styles/App.css";
import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { createBrowserHistory } from "history";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Account from "./pages/Account";
import Categories from "./pages/Categories";
import Services from "./pages/Services";
import Service from "./pages/Service";
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

import { supabase } from "./supabase/client";


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
    <div className="App">
      <Header />
      <br/>
      <Routes>
        <Route path="/:reload" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/#menu_div" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/account" element={<Account />} />
        <Route path="/categories/:id" element={<Categories />} />
        <Route path="/services/:id" element={<Services />} />
        <Route path="/service/:id" element={<Service />} />
        <Route path="/my-services" element={<MyServices />} />
        <Route path="/client-service/:reload" element={<ClientService />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/recover-password" element={<RecoverPassword />} />
        <Route path="/admin-hub/:reload" element={<AdminHub />} />
        <Route path="/edit-services-select-category/:id" element={<EditServicesSelectCategory />} />
        <Route path="/edit-services/:id" element={<EditServices />} />
        <Route path="/edit-service/:id" element={<EditService />} />
        <Route path="/edit-categories/:id" element={<EditCategories/>} />
        <Route path="/edit-category/:id" element={<EditCategory/>} />
        <Route path="/edit-enterprises/:id" element={<EditEnterprises/>} />
        <Route path="/add-category/:id" element={<AddCategory/>}/>
        <Route path="/add-service-select-category/:id" element={<AddServiceSelectCategory/>}/>
        <Route path="/add-service/:id" element={<AddService/>}/>
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
        <Route path="/edit-users/:id" element={<EditUsers/>}/>
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
