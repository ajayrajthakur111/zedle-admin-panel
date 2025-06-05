/* eslint-disable react-hooks/exhaustive-deps */
// src/types/order.ts

export type OrderStatus =
  | "Pending"
  | "Accepted"
  | "In Progress"
  | "Completed"
  | "Cancelled";

export type Category = "Food Delivery" | "Grocery Delivery";
export interface deliveryLocation {
address:string;
city:string;
country:string;
state:string;
pincode:number
}

export interface Order {
  orderId: string;
  orderFor: string;             // e.g. “Mexican Burger”, “Fresh Mangos”
  quantity: string;             // e.g. “5 Pc”, “2 Kg”
  orderOn: string;              // ISO date string
  orderedUser: string;          // e.g. “Raghav Taneja”
  vendor: string;               // e.g. “GYX Cafe”
  agent: string | null;         // null = Not Assigned
  status: OrderStatus;
  category: Category;
  ratings: number;
  orderRate: string;
  deliveryLocation: deliveryLocation;
  customerMobile: string;       // e.g. “+91 9989766765”
  unitPrice: number;
  totalPrice: number;
  // …any other fields you might need…
}


import React, { useState, useEffect, useRef } from "react";
import { Filter, Search, X, Brain, MessageSquareDot, Send } from "lucide-react";
import Table, { type Column } from "@/components/ui/Table";
import { getAllOrders } from "@/api/ordersService";
import OrderDetailsModal from "@/components/Orders/OrderDetailsModal";
import AssignOrdersPage from "@/components/Orders/AssignOrdersPage";
import Button from "@/components/ui/Button";
// ───────────────────────────────────────────────────────────────────────
// Import the new LiveGpsTrackingPage component
import LiveGpsTrackingPage from "@/components/Orders/LiveTrackingPage";
import ComplaintsPage from "@/components/Orders/ComplaintsPage";

const CATEGORIES: Category[] = ["Food Delivery", "Grocery Delivery"];

export const OrdersPage: React.FC = () => {
  // ─────────────────────────────────────
  // State
  // ─────────────────────────────────────
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [categoryFilter, setCategoryFilter] = useState<Category | "">("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [liveGpsMode, setLiveGpsMode] = useState(false);
  const [assignMode, setAssignMode] = useState(false);

  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const [issuesMode, setIssuesMode] = useState(false); // ← NEW

  const [detailsModalOrderId, setDetailsModalOrderId] = useState<string | null>(
    null
  );

  // ─────────────────────────────────────
  // Fetch orders when filters/page change (unless in assignMode or GPS mode)
  // ─────────────────────────────────────
  useEffect(() => {
    if (assignMode || liveGpsMode || issuesMode) return;

    async function fetchOrders() {
      setLoading(true);
      const { rows, totalCount } = await getAllOrders({
        page,
        limit: 10,
        category: categoryFilter || undefined,
        search: searchTerm || undefined,
        onlyNotAssigned: false,
        onlyOngoing: false,
      });
      setOrders(rows);
      setTotalCount(totalCount);
      setLoading(false);
    }
    fetchOrders();
  }, [page, categoryFilter, searchTerm, assignMode, liveGpsMode]);

  // ─────────────────────────────────────
  // Close category dropdown if clicked outside
  // ─────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        catDropdownOpen &&
        categoryRef.current &&
        !categoryRef.current.contains(e.target as Node)
      ) {
        setCatDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [catDropdownOpen]);

  // ─────────────────────────────────────
  // Column Definitions for “normal” OrdersPage
  // ─────────────────────────────────────
  const baseColumns: Column<Order>[] = [
    { header: "Order ID", accessor: "orderId", width: "w-[8vw]" },
    { header: "Order For", accessor: "orderFor", width: "w-[12vw]" },
    { header: "Quantity", accessor: "quantity", width: "w-[8vw]" },
    {
      header: "Ordered On",
      accessor: "orderOn",
      width: "w-[10vw]",
      cell: (row) => new Date(row.orderOn).toLocaleDateString("en-GB"),
    },
    { header: "Ordered User", accessor: "orderedUser", width: "w-[12vw]" },
    { header: "Vendor", accessor: "vendor", width: "w-[12vw]" },
    {
      header: "Agent",
      accessor: "agent",
      width: "w-[10vw]",
      cell: (row) => row.agent || "Not Assigned",
    },
    {
      header: "Status",
      accessor: "status",
      width: "w-[8vw]",
      cell: (row) => {
        let color = "text-secondary";
        if (row.status === "Pending") color = "text-amber-500";
        else if (row.status === "In Progress") color = "text-blue-500";
        else if (row.status === "Completed") color = "text-green-600";
        else if (row.status === "Cancelled") color = "text-danger";
        return <span className={color}>{row.status}</span>;
      },
    },
    {
      header: "Category",
      accessor: "category",
      width: "w-[10vw]",
      cell: (row) => <span className="text-primary">{row.category}</span>,
    },
    {
      header: "Order Info",
      width: "w-[8vw]",
      cell: (row) => (
        <button
          onClick={() => setDetailsModalOrderId(row.orderId)}
          className="text-primary underline text-sm"
        >
          View Details
        </button>
      ),
      className: "text-center",
    },
  ];

  // ─────────────────────────────────────
  // 1) If assignMode is active → render AssignOrdersPage
  // ─────────────────────────────────────
  if (assignMode) {
    return (
      <AssignOrdersPage
        onCloseAssign={() => {
          setAssignMode(false);
          setPage(1);
        }}
      />
    );
  }

  // ─────────────────────────────────────
  // 2) If liveGpsMode is active → render LiveGpsTrackingPage
  // ─────────────────────────────────────
  if (liveGpsMode) {
    return <LiveGpsTrackingPage onCloseGps={() => setLiveGpsMode(false)} />;
  }

  // ─────────────────────────────────────
  // 3) Otherwise → render normal OrdersPage UI
  // ─────────────────────────────────────

  if (issuesMode) {
    return <ComplaintsPage onCloseIssues={() => setIssuesMode(false)} />;
  }
  return (
    <div className="space-y-6 p-8">
      {/* 1) Title + Buttons */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-primary">Orders</h1>
        <div className="flex items-center space-x-2">
          {/* Assign Order (clears other filters) */}
          <Button
            variant="primaryHorizontalGradient"
            icon={<Brain />}
            iconPosition="right"
            onClick={() => {
              setAssignMode(true);
              setCategoryFilter("");
              setLiveGpsMode(false);
              setSearchTerm("");
              setPage(1);
            }}
          >
            <span>Assign Order</span>
          </Button>

          {/* Issues Raised (placeholder) */}
          <Button
            variant="primaryHorizontalGradient"
            icon={<MessageSquareDot className="transform scale-x-[-1]" />}
            onClick={() => {
              setIssuesMode(true);
              setCategoryFilter("");
              setLiveGpsMode(false);
              setAssignMode(false);
              setSearchTerm("");
              setPage(1);
            }}
          >
            <span>Issues Raised</span>
          </Button>
        </div>
      </div>

      <div className="bg-surface rounded-xl p-6">
        {/* 2) Filters / Live GPS / Search */}
        <div className="flex items-center justify-between space-x-4 mb-4">
          <div className="flex gap-4">
            {/* Total Orders */}
            <div className="text-secondary text-lg font-semibold">
              Total Orders:{" "}
              <span className="text-primary font-semibold">{totalCount}</span>
            </div>

            {/* Category Filter Icon */}
            <div className="relative" ref={categoryRef}>
              <button
                onClick={() => setCatDropdownOpen((o) => !o)}
                className="p-2 hover:bg-surface rounded"
              >
                <Filter className="h-5 w-5 text-primary" />
              </button>
              {catDropdownOpen && (
                <ul className="absolute top-full mt-1 w-48 bg-white border border-muted rounded-md shadow-lg z-20">
                  {CATEGORIES.map((cat) => (
                    <li
                      key={cat}
                      onClick={() => {
                        setCategoryFilter(cat);
                        setCatDropdownOpen(false);
                        setPage(1);
                      }}
                      className="px-4 py-2 text-sm text-primary hover:bg-surface cursor-pointer"
                    >
                      {cat}
                    </li>
                  ))}
                  <li
                    onClick={() => {
                      setCategoryFilter("");
                      setCatDropdownOpen(false);
                      setPage(1);
                    }}
                    className="px-4 py-2 text-sm text-secondary hover:bg-surface cursor-pointer"
                  >
                    Clear Filter
                  </li>
                </ul>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            {/* Live GPS Toggle */}
            <div className="flex items-center space-x-1">
              <Button
                variant="successSolidGradient"
                iconPosition="right"
                icon={<Send className="h-4 w-4" />}
                onClick={() => {
                  setLiveGpsMode(true);
                  setCategoryFilter("");
                  setSearchTerm("");
                  setPage(1);
                }}
                className="px-4 py-2 text-white rounded-md text-sm"
                disabled={liveGpsMode}
              >
                <div className="flex items-center space-x-1">
                  <span>{liveGpsMode ? "GPS Active" : "Live GPS"}</span>
                </div>
              </Button>
              {liveGpsMode && (
                <button
                  onClick={() => {
                    setLiveGpsMode(false);
                    setPage(1);
                  }}
                  className="p-2 hover:bg-surface rounded"
                >
                  <X className="h-5 w-5 bg-muted rounded-full" />
                </button>
              )}
            </div>

            {/* Search Bar */}
            <div className="flex items-center space-x-1 border border-none rounded-md px-2 py-1 w-64 text-muted bg-white">
              <Search className="h-4 w-4 " />
              <input
                type="text"
                placeholder="Search Order by ID"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="flex-grow text-sm text-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 3) Main Table */}
        {loading ? (
          <p className="text-primary text-center py-12">Loading…</p>
        ) : orders.length > 0 ? (
          <Table
            columns={baseColumns}
            data={orders}
            className="border-separate"
            pagination={{
              currentPage: page,
              totalPages: Math.ceil(totalCount / 10),
              onPageChange: setPage,
            }}
            rowClassName={(row) =>
              row.status === "In Progress" ? "bg-[#FFCCCC42] rounded-lg" : ""
            }
          />
        ) : (
          <p className="text-center text-muted py-12">No Data Found</p>
        )}
      </div>

      {/* 4) Order Details Modal */}
      {detailsModalOrderId && (
        <OrderDetailsModal
          orderId={detailsModalOrderId}
          allowAssign={false}
          onClose={() => {
            setDetailsModalOrderId(null);
            setPage(1);
          }}
          onAssign={async () => {}}
        />
      )}
    </div>
  );
};

export default OrdersPage;
