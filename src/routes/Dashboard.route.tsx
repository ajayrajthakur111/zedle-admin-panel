import Layout from "@/components/layout/Layout";
import { AboutUsPage } from "@/views/AboutUs/AboutUsPage";
import { BookingsPage } from "@/views/Bookings/BookingsPage";
import { ContactUsPage } from "@/views/ContactUs/ContactUsPage";
import { CouponsPage } from "@/views/Coupons/CouponsPage";
import { DashboardPage } from "@/views/Dashboard/DashboardPage";
import { DeliveryAgentsPage } from "@/views/Delivery/DeliveryAgentsPage";
import { NotFoundPage } from "@/views/NotFoundPage/NotFoundPage";
import { OrdersPage } from "@/views/Orders/OrdersPage";
import { PromotionsPage } from "@/views/Promotions/PromotionsPage";
import ReportsPage from "@/views/Reports/ReportsPage";
import { TermsAndPoliciesPage } from "@/views/TermsAndPolicies/TermsAndPoliciesPage";
import { UsersPage } from "@/views/Users/UsersPage";
import { VendorsPage } from "@/views/Vendors/VendorsPage";
import { Route, Routes } from "react-router-dom";

export const DashboardRoute = () => {
  return (
    <div>
      <Layout>
        <Routes>
          <Route index element={<DashboardPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="vendors" element={<VendorsPage />} />
          <Route path="delivery" element={<DeliveryAgentsPage />} />
          <Route path="coupons" element={<CouponsPage />} />
          <Route path="promotions" element={<PromotionsPage />} />
          <Route path="terms" element={<TermsAndPoliciesPage />} />
          <Route path="about" element={<AboutUsPage />} />
          <Route path="contact" element={<ContactUsPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </div>
  );
};
