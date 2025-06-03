// src/components/Orders/AssignOrdersPage.tsx
import React, { useState, useEffect } from "react";
import {  ChevronLeft, Search, } from "lucide-react";
import Table, { type Column } from "@/components/ui/Table";
import {
  getAllOrders,
  assignOrderToAgent,
} from "@/api/ordersService";
import OrderDetailsModal from "./OrderDetailsModal";
import type { Order } from "@/views/Orders/OrdersPage";

interface AssignOrdersPageProps {
  onCloseAssign: () => void;
}

const AssignOrdersPage: React.FC<AssignOrdersPageProps> = ({
  onCloseAssign,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [detailsModalOrderId, setDetailsModalOrderId] = useState<string | null>(
    null
  );

  useEffect(() => {
    async function fetchUnassigned() {
      setLoading(true);
      const { rows, totalCount } = await getAllOrders({
        page,
        limit: 10,
        onlyNotAssigned: true,
        search: searchTerm || undefined,
      });
      setOrders(rows);
      setTotalCount(totalCount);
      setLoading(false);
    }
    fetchUnassigned();
  }, [page, searchTerm]);

  const columns: Column<Order>[] = [
    {
      header: "Order ID",
      accessor: "orderId",
      width: "w-[8vw]",
      cell: (row) => (
        <div className="relative flex items-center">
          <span>{row.orderId}</span>
        </div>
      ),
    },
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

  return (
    <div className="space-y-6 p-4">
      {/* 1) Header: “Assign Orders” + Close Button */}
      <div className="flex  ">
        <button
          onClick={onCloseAssign}
          className="p-2 hover:bg-surface rounded  font-bold"
        >
          <ChevronLeft size={20} className=" text-primary" />
        </button>
        <h1 className="text-2xl font-semibold text-primary">Assign Orders</h1>
      </div>


      {/* 3) Table of Unassigned Orders */}
      <div className="bg-surface rounded-xl p-4 overflow-visible">
      {/* 2) Search Bar */}
      <div className="flex items-center justify-between space-x-4 mb-4">
        <div className="text-secondary text-lg font-semibold">
          Assign Orders
        </div>
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
        {loading ? (
          <p className="text-primary text-center py-12">Loading…</p>
        ) : orders.length > 0 ? (
          <Table
            columns={columns}
            data={orders}
            className="border-separate relative overflow-visible"
            pagination={{
              currentPage: page,
              totalPages: Math.ceil(totalCount / 10),
              onPageChange: setPage,
            }}
            rowClassName={(row) =>
              !row.agent
                ? "bg-green-50 relative"
                : ""
            }
          />
        ) : (
          <p className="text-center text-muted py-12">
            No Unassigned Orders Found
          </p>
        )}
      </div>

      {/* 4) Order Details Modal (with allowAssign = true) */}
      {detailsModalOrderId && (
        <OrderDetailsModal
          orderId={detailsModalOrderId}
          allowAssign={true}
          onClose={() => {
            setDetailsModalOrderId(null);
            setPage(1);
          }}
          onAssign={async (orderId, agentName) => {
            await assignOrderToAgent(orderId, agentName);
            setDetailsModalOrderId(null);
            setPage(1);
          }}
        />
      )}
    </div>
  );
};

export default AssignOrdersPage;
