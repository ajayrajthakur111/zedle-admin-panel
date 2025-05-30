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

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "" },
    { icon: ShoppingCart, label: "Orders", path: "orders" },
    { icon: Calendar, label: "Bookings", path: "bookings" },
    { icon: Users, label: "Users", path: "users" },
    { icon: Store, label: "Vendors", path: "vendors" },
    { icon: Truck, label: "Delivery Agents", path: "delivery" },
    { icon: Ticket, label: "Coupons", path: "coupons" },
    { icon: Megaphone, label: "Promotions", path: "promotions" },
    { icon: FileText, label: "Terms & Policies", path: "terms" },
    { icon: Info, label: "About Us", path: "about" },
    { icon: Phone, label: "Contact Us", path: "contact" },
  ];

  const handleClick = (path: string) => {
    const fullPath = `/dashboard${path ? `/${path}` : ""}`;
    navigate(fullPath);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 z-50 lg:hidden
          h-[calc(100vh-4rem)] w-64
          bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-secondary)] text-white
          shadow-xl transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-1 px-3">
            {menuItems.map(({ icon: Icon, label, path }) => {
              const fullPath = `/dashboard${path ? `/${path}` : ""}`;
              const isActive = location.pathname === fullPath;

              return (
                <li key={path}>
                  <button
                    onClick={() => handleClick(path)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-3 rounded-lg
                      transition-all duration-200 relative
                      ${
                        isActive
                          ? "bg-[var(--zedle-brand-purple-dark)] text-white font-medium translate-x-2 border-b-2 border-white"
                          : "hover:bg-white/10 text-purple-100 hover:text-white"
                      }
                    `}
                  >
                    <Icon
                      size={20}
                      className={`transition-transform duration-200 ${
                        !isActive ? "hover:translate-x-1" : ""
                      }`}
                    />
                    <span
                      className={`font-medium transition-transform duration-200 ${
                        !isActive ? "hover:translate-x-1" : ""
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
    </>
  );
};

export default MobileSidebar;
