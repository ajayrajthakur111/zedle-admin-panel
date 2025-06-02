// src/components/Reports/DeliveryPerformanceReport.tsx
import React, { useState, useEffect, useRef } from "react";
import {  Filter } from "lucide-react";
import Table, { type Column } from "@/components/ui/Table";
import {
  fetchDeliveryPerf,
  type DeliveryPerfRow,
} from "@/api/reportsService";

interface DeliveryPerformanceReportProps {
  onBack: () => void;
}

export const DeliveryPerformanceReport: React.FC<
  DeliveryPerformanceReportProps
> = () => {
  const [rows, setRows] = useState<DeliveryPerfRow[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // Dropdown open/closed
  const [filterOpen, setFilterOpen] = useState<boolean>(false);

  // Holds one of the four statuses or empty = no filter
  const [deliveryTimeFilter, setDeliveryTimeFilter] = useState<
    DeliveryPerfRow["deliveryTime"] | ""
  >("");

  // Close dropdown when clicking outside
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        filterOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterOpen]);

  // Fetch data whenever page or deliveryTimeFilter changes
  useEffect(() => {
    setLoading(true);
    fetchDeliveryPerf(page, 5, deliveryTimeFilter).then((data) => {
      setRows(data.rows);
      setTotalPages(data.totalPages);
      setLoading(false);
    });
  }, [page, deliveryTimeFilter]);

  // Column definitions (unchanged)
  const columns: Column<DeliveryPerfRow>[] = [
    { header: "Agent ID", accessor: "agentId", width: "w-[14vw]" },
    { header: "Name", accessor: "name", width: "w-[14vw]" },
    { header: "Mobile Number", accessor: "mobileNumber", width: "w-[14vw]" },
    {
      header: "Delivery Time",
      width: "w-[14vw]",
      cell: (row) => {
        let cls = "text-primary";
        if (row.deliveryTime === "On Time") cls = "text-success";
        else if (row.deliveryTime === "Delayed") cls = "text-amber-500";
        else if (row.deliveryTime === "Highly Delayed") cls = "text-danger";
        else if (row.deliveryTime === "Slightly Late") cls = "text-yellow-600";
        return <span className={cls}>{row.deliveryTime}</span>;
      },
    },
    {
      header: "Ratings (out of 5)",
      width: "w-[14vw]",
      cell: (row) => (
        <span className="flex items-center text-sm">
          {Array.from({ length: row.ratings }).map((_, i) => {
            let colorClass = "text-danger"; // default for 1-2
            if (row.ratings >= 4) colorClass = "text-success"; // for 4-5
            else if (row.ratings === 3) colorClass = "text-warning"; // for 3
            return (
              <div key={i} className={`text-lg ${colorClass}`}>
                ★
              </div>
            );
          })}
        </span>
      ),
    },
    {
      header: "Earnings (In Rs)",
      width: "w-[14vw]",
      cell: (row) => <span>{row.earnings.toLocaleString()},-/</span>,
      className: "text-right",
    },
    {
      header: "Info",
      width: "w-[10vw]",
      cell: () => (
        <a href="#" className="text-primary underline">
          View Details
        </a>
      ),
      className: "text-center",
    },
  ];

  return (
    <div className="space-y-6">
    

      {/* Total Delivery Agents + Filter Icon */}
      <div className="flex items-center space-x-2">
        <span className="text-primary font-medium">
          Total Delivery Agents:{" "}
          <span className="font-semibold">{rows.length}</span>
        </span>

        {/* Dropdown container (relative for absolute positioning) */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setFilterOpen((prev) => !prev)}
            className="p-1 hover:bg-surface rounded"
          >
            <Filter className="h-4 w-4 text-primary " />
          </button>

          {/* Small dropdown menu */}
          {filterOpen && (
            <div className="absolute left-0 mt-1 w-40 bg-white border border-muted rounded shadow-sm z-10 ">
              <button
                onClick={() => {
                  setDeliveryTimeFilter("On Time");
                  setPage(1);
                  setFilterOpen(false);
                }}
                className="w-full px-3 py-1 text-sm text-success hover:bg-surface"
              >
                On Time
              </button>
              <button
                onClick={() => {
                  setDeliveryTimeFilter("Highly Delayed");
                  setPage(1);
                  setFilterOpen(false);
                }}
                className="w-full px-3 py-1 text-sm text-danger hover:bg-surface"
              >
                Highly Delayed
              </button>
              <button
                onClick={() => {
                  setDeliveryTimeFilter("Delayed");
                  setPage(1);
                  setFilterOpen(false);
                }}
                className="w-full px-3 py-1 text-sm text-amber-500 hover:bg-surface"
              >
                Delayed
              </button>
              <button
                onClick={() => {
                  setDeliveryTimeFilter("Slightly Late");
                  setPage(1);
                  setFilterOpen(false);
                }}
                className="w-full px-3 py-1 text-sm text-yellow-600 hover:bg-surface"
              >
                Slightly Late
              </button>
              <button
                onClick={() => {
                  setDeliveryTimeFilter("");
                  setPage(1);
                  setFilterOpen(false);
                }}
                className="w-full px-3 py-1 text-sm text-secondary hover:bg-surface"
              >
                Clear Filter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table / No Data */}
      <div className="bg-surface rounded-xl p-4">
        {loading ? (
          <p className="text-primary text-center py-12">Loading…</p>
        ) : rows.length > 0 ? (
          <Table
            columns={columns}
            data={rows}
            className="border-separate"
            rowClassName={(row) =>
              row.deliveryTime === "Highly Delayed"
                ? "bg-red-100 rounded-lg"
                : ""
            }
            pagination={{
              currentPage: page,
              totalPages,
              onPageChange: setPage,
            }}
          />
        ) : (
          <p className="text-center text-muted py-12">No Data Found</p>
        )}
      </div>
    </div>
  );
};

export default DeliveryPerformanceReport;
