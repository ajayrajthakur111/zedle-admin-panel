import { Route, Routes } from "react-router-dom";
import { PublicRoute } from "./Public.route";
import { DashboardRoute } from "./Dashboard.route";

export const IndexRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/auth/*" element={<PublicRoute />} />

        <Route path="/dashboard/*" element={<DashboardRoute />} />

      </Routes>
    </>
  );
};
