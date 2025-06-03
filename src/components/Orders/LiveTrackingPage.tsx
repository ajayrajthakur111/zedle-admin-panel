import React, { useState, useEffect } from "react";
import { Search, X, Map } from "lucide-react";
import Table, { type Column } from "@/components/ui/Table";
import { getAllOrders } from "@/api/ordersService";
import TrackOrderModal from "@/components/Orders/TrackOrderModal";
import Button from "@/components/ui/Button";
import type { Order } from "@/views/Orders/OrdersPage";

export interface LiveGpsTrackingPageProps {
  onCloseGps: () => void;
}

const LiveGpsTrackingPage: React.FC<LiveGpsTrackingPageProps> = ({
  onCloseGps,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [trackModalOrderId, setTrackModalOrderId] = useState<string | null>(
    null
  );

  // ─────────────────────────────────────
  // Fetch only ongoing (live‐GPS) orders whenever page/searchTerm changes
  // ─────────────────────────────────────
  useEffect(() => {
    async function fetchOngoing() {
      setLoading(true);
      const { rows, totalCount } = await getAllOrders({
        page,
        limit: 10,
        onlyNotAssigned: false,
        onlyOngoing: true, // <-- GPS mode
        search: searchTerm || undefined,
      });
      setOrders(rows);
      setTotalCount(totalCount);
      setLoading(false);
    }
    fetchOngoing();
  }, [page, searchTerm]);

  // ─────────────────────────────────────
  // Column definitions (Status + Info + GPS button)
  // ─────────────────────────────────────
  const gpsColumns: Column<Order>[] = [
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
      header: "Order Info",
      width: "w-[8vw]",
      cell: () => (
        <button
          onClick={() => {
            /* Optionally open details, or leave empty if not needed */
          }}
          className="text-primary underline text-sm"
        >
          View Details
        </button>
      ),
      className: "text-center",
    },
    {
      header: "GPS",
      accessor: "gps",
      width: "w-[10vw]",
      cell: (row) => (
        <Button
          variant="successSolidGradient"
          className="text-white"
          onClick={() => setTrackModalOrderId(row.orderId)}
        >
          <span className="pr-1">Track </span>
          <Map className="h-4 w-4" />
        </Button>
      ),
      className: "text-center text-success",
    },
  ];

  return (
    <div className="space-y-6 p-8">
      {/* 1) Title + Close GPS Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-primary">
          Live GPS Tracking
        </h1>
      </div>

      <div className="bg-surface rounded-xl p-6">
        {/* 2) Ongoing Count + Search Bar */}
        <div className="flex items-center justify-between space-x-4 mb-4">
          <div className="text-secondary text-lg font-semibold">
            Ongoing Deliveries:{" "}
            <span className="text-primary font-semibold">{totalCount}</span>
          </div>
          <div className="flex gap-4">
            <div className="flex gap-1 items-center">
              <Button variant="ghost" className="" disabled>
                <span className="">Close GPS</span>
              </Button>
              <X
                onClick={onCloseGps}
                className="w-5 h-5 rounded-full cursor-pointer bg-gray-300 text-white"
              />
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
        </div>

        {/* 3) Table of Ongoing Orders */}
        {loading ? (
          <p className="text-primary text-center py-12">Loading…</p>
        ) : orders.length > 0 ? (
          <Table
            columns={gpsColumns}
            data={orders}
            className="border-separate"
            pagination={{
              currentPage: page,
              totalPages: Math.ceil(totalCount / 10),
              onPageChange: setPage,
            }}
            rowClassName={(row) =>
              row.status === "In Progress" ? "bg-green-50 rounded-lg" : ""
            }
          />
        ) : (
          <p className="text-center text-muted py-12">No Data Found</p>
        )}
      </div>

      {trackModalOrderId && (
        <TrackOrderModal
          orderId={trackModalOrderId}
          onClose={() => setTrackModalOrderId(null)}
        />
      )}
    </div>
  );
};

export default LiveGpsTrackingPage;
