import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LayoutDashboard from "@/assets/sidebar/dashboard_icon.svg";
import Orders from "@/assets/sidebar/order_icon.svg";
import Bookings from "@/assets/sidebar/booking_icon.svg";
import Users from "@/assets/sidebar/users_icon.svg";
import Vendors from "@/assets/sidebar/vendors_icon.svg";
import Delivery_Agent from "@/assets/sidebar/delivery_agent_icon.svg";
import Coupons from "@/assets/sidebar/coupons_icon.svg";

import Promotions from "@/assets/sidebar/promotion_icon.svg";
import Terms from "@/assets/sidebar/T&C_icon.svg";
import About from "@/assets/sidebar/about_us_icon.svg";
import Phone from "@/assets/sidebar/contact_us_icon.svg";

interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "" },
    { icon: Orders, label: "Orders", path: "orders" },
    { icon: Bookings, label: "Bookings", path: "bookings" },
    { icon: Users, label: "Users", path: "users" },
    { icon: Vendors, label: "Vendors", path: "vendors" },
    { icon: Delivery_Agent, label: "Delivery Agents", path: "delivery" },
    { icon: Coupons, label: "Coupons", path: "coupons" },
    { icon: Promotions, label: "Promotions", path: "promotions" },
    { icon: Terms, label: "Terms & Policies", path: "terms" },
    { icon: About, label: "About Us", path: "about" },
    { icon: Phone, label: "Contact Us", path: "contact" },
  ];

  return (
    <aside
      className={`
        flex-shrink-0                  
        sticky top-16 z-20             
        h-[calc(100vh-4rem)]       
        sidebar
        text-white shadow-xl
        transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-0 overflow-hidden" : "w-64"}
      `}
    >
      <nav
        className={`
          h-full flex flex-col py-6
          transition-opacity duration-400
          ${isCollapsed ? "opacity-0" : "opacity-100"}
        `}
      >
        <ul className="flex-1 space-y-1 px-3 overflow-y-hidden">
          {menuItems.map(({ icon: Icon, label, path }) => {
            const fullPath = `/dashboard${path ? `/${path}` : ""}`;
            const isActive = location.pathname === fullPath;

            return (
              <li key={fullPath}>
                <button
                  onClick={() => navigate(fullPath)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-3 rounded-lg
                    transition-all duration-300 relative group
                    ${
                      isActive
                        ? "bg-[#45013059] text-lg text-white font-bold border-b-3 border-[#FFFFFFA8]"
                        : "hover:bg-[#45013059] text-lg text-white font-medium hover:font-bold hover:border-b-3  border-[#FFFFFFA8]"
                    }
                  `}
                >
                  <img
                    src={Icon}
                    alt={label}
                    className={`transition-transform duration-300 ${
                      isActive ? "translate-x-2" : "group-hover:translate-x-2"
                    }`}
                  />
                  {/* <Icon
                    size={20}
                    className={`transition-transform duration-300 ${
                      isActive 
                        ? "translate-x-2" 
                        : "group-hover:translate-x-2"
                    }`}
                  /> */}
                  <span
                    className={` transition-transform duration-300 ${
                      isActive ? "translate-x-2" : "group-hover:translate-x-2"
                    }`}
                  >
                    {label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
