import React from "react";
import { Button } from "./components/ui/button";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import MainLayout from "./components/MainLayout";
import HomePage from "./pages/HomePage";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";

function App() {

  return (
    <>
    <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/account/edit" element={<EditProfile />} />
          </Route>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
