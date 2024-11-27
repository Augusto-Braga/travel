import React from "react";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import HomePage from "./pages/home";
import RidesPage from "./pages/rides/rides";

const RoutesConfig = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/rides" element={<RidesPage />} />
    </Routes>
  );
};

export default RoutesConfig;
