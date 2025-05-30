import { Navigate, Route, Routes } from "react-router-dom";
import { PublicRoute } from "./Public.route";
import { DashboardRoute } from "./Dashboard.route";
import getCookie from "@/utils/getCookie";
import LoginPage from "@/views/Auth/Login";

export const IndexRoutes = () => {
  const token = getCookie("token");
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={token ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />{" "}
        <Route path="/auth/*" element={<PublicRoute />} />
        <Route path="/dashboard/*" element={<DashboardRoute />} />
      </Routes>
    </>
  );
};
