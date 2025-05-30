import LoginPage from "@/views/Auth/Login";
import RegisterPage from "@/views/Auth/Register";
import { Route, Routes } from "react-router-dom";

export const PublicRoute = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
};
