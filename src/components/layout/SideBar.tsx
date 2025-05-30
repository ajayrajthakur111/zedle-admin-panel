import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Calendar,
  Users,
  Store,
  Truck,
  Ticket,
  Megaphone,
  FileText,
  Info,
  Phone,
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "" },
    { icon: ShoppingCart,    label: "Orders",    path: "orders" },
    { icon: Calendar,        label: "Bookings",  path: "bookings" },
    { icon: Users,           label: "Users",     path: "users" },
    { icon: Store,           label: "Vendors",   path: "vendors" },
    { icon: Truck,           label: "Delivery Agents", path: "delivery" },
    { icon: Ticket,          label: "Coupons",   path: "coupons" },
    { icon: Megaphone,       label: "Promotions",path: "promotions" },
    { icon: FileText,        label: "Terms & Policies", path: "terms" },
    { icon: Info,            label: "About Us",  path: "about" },
    { icon: Phone,           label: "Contact Us",path: "contact" },
  ];

  return (
    <aside
      className={`
        flex-shrink-0                  
        sticky top-16 z-20             
        h-[calc(100vh-4rem)]         
        bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-secondary)] from-80% to-100%
        text-white shadow-xl
        transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-0 overflow-hidden" : "w-64"}
      `}
    >
      <nav
        className={`
          h-full flex flex-col py-6
          transition-opacity duration-200
          ${isCollapsed ? "opacity-0" : "opacity-100"}
        `}
      >
        <ul className="flex-1 space-y-1 px-3 overflow-y-auto">
          {menuItems.map(({ icon: Icon, label, path }) => {
            const fullPath = `/dashboard${path ? `/${path}` : ""}`;
            const isActive = location.pathname === fullPath;

            return (
              <li key={fullPath}>
                <button
                  onClick={() => navigate(fullPath)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-3 rounded-lg
                    transition-all duration-200 relative
                    ${
                      isActive
                        ? "bg-[var(--zedle-brand-purple-dark)] text-white font-medium translate-x-2 border-b-2 border-white"
                        : "hover:bg-[var(--zedle-brand-purple-dark)] text-purple-100 hover:text-white"
                    }
                  `}
                >
                  <Icon
                    size={20}
                    className={`transition-transform duration-200 ${
                      !isActive ? "group-hover:translate-x-1" : ""
                    }`}
                  />
                  <span
                    className={`font-medium transition-transform duration-200 ${
                      !isActive ? "group-hover:translate-x-1" : ""
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
