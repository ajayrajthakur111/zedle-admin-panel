// src/components/Reports/SalesReport.tsx
import React, { useState, useEffect } from "react";
import { CalendarDays, X } from "lucide-react";
import Button from "@/components/ui/Button";
import Table, { type Column } from "@/components/ui/Table";
import { fetchSalesReport, type SalesRow } from "@/api/reportsService";

interface SalesReportProps {
  onBack: () => void;
}

type Granularity = "daily" | "weekly" | "monthly";

// Helpers to get “YYYY-MM-DD” strings
const todayISO = (): string => {
  const t = new Date();
  return t.toISOString().slice(0, 10);
};
const dateOffsetISO = (offset: { days?: number; months?: number }): string => {
  const now = new Date();
  if (offset.days) {
    now.setDate(now.getDate() + offset.days);
  }
  if (offset.months) {
    now.setMonth(now.getMonth() + offset.months);
  }
  return now.toISOString().slice(0, 10);
};

export const SalesReport: React.FC<SalesReportProps> = () => {
  const [granularity, setGranularity] = useState<Granularity>("daily");
  const [range, setRange] = useState<{ start: string; end: string }>({
    start: todayISO(),
    end: todayISO(),
  });

  // Tracks whether we have fetched data
  const [isFetched, setIsFetched] = useState(false);
  // Holds the fetched rows
  const [rows, setRows] = useState<SalesRow[]>([]);
  // Loading flag for the actual fetch
  const [loading, setLoading] = useState(false);

  // Whenever granularity changes, recalc the dates
  useEffect(() => {
    const end = todayISO();
    let start: string;
    switch (granularity) {
      case "weekly":
        start = dateOffsetISO({ days: -7 });
        break;
      case "monthly":
        start = dateOffsetISO({ months: -1 });
        break;
      default:
        start = todayISO();
    }
    setRange({ start, end });
  }, [granularity]);

  // Handle Fetch Data: call API, store rows, show table
  const handleFetch = async () => {
    setLoading(true);
    try {
      const res = await fetchSalesReport(range.start, range.end, granularity);
      setRows(res.rows);
      setIsFetched(true);
    } catch (err) {
      console.error("Error fetching sales data:", err);
      setRows([]);
      setIsFetched(true);
    } finally {
      setLoading(false);
    }
  };

  // Clear back to initial state
  const handleClear = () => {
    setIsFetched(false);
    setRows([]);
  };

  // Compute totals for footer
  const totalUnits = rows.reduce((sum, r) => sum + r.unitsSold, 0);
  const totalAmount = rows.reduce((sum, r) => sum + r.totalPrice, 0);

  // Define columns for the Table
  const columns: Column<SalesRow>[] = [
    { header: "Product Name", accessor: "productName", width: "w-[14vw]" },
    { header: "Units Sold", accessor: "unitsSold", width: "w-[14vw]" },
    { header: "Unit Price", accessor: "unitPrice", width: "w-[14vw]" },
    { header: "Total Price", accessor: "totalPrice", width: "w-[14vw]" },
    {
      header: "Delivered Location",
      accessor: "deliveredLocation",
      width: "w-[14vw]",
    },
    { header: "Delivered on", accessor: "deliveredOn", width: "w-[14vw]" },
    {
      header: "Status",
      cell: (row) => (
        <span
          className={
            row.status === "Delivered" ? "text-success" : "text-danger"
          }
        >
          {row.status}
        </span>
      ),
      className: "text-center",
      width: "w-[14vw]",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Instruction text */}
      <p className="text-muted text-sm font-medium ml-6">
        Please select anyone to generate report
      </p>

      {/* Granularity selectors */}
      <div className="flex items-center space-x-4 ml-6">
        {(["daily", "weekly", "monthly"] as Granularity[]).map((g) => (
          <Button
            key={g}
            variant={
              granularity === g ? "primaryHorizontalGradient" : "ghost"
            }
            onClick={() => setGranularity(g)}
            className={`px-4 py-1 rounded font-medium ${
              granularity === g
                ? " text-white"
                : " "
            }`}
          >
            {g.charAt(0).toUpperCase() + g.slice(1)}
          </Button>
        ))}
      </div>

      {/* Date Range & Fetch */}
      <div className="bg-surface rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="text-black font-semibold">
              Selected Date Range
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {/* Start Date */}
            <div className="relative">
              <CalendarDays className="absolute left-3 top-2 h-5 w-5 text-muted" />
              <input
                type="date"
                className="pl-10 pr-3 py-1 border-b border-muted bg-transparent text-primary focus:outline-none focus:border-primary"
                value={range.start}
                onChange={(e) =>
                  setRange((prev) => ({ ...prev, start: e.target.value }))
                }
              />
            </div>

            <span className="text-primary font-medium">to</span>

            {/* End Date */}
            <div className="relative">
              <CalendarDays className="absolute left-3 top-2 h-5 w-5 text-muted" />
              <input
                type="date"
                className="pl-10 pr-3 py-1 border-b border-muted bg-transparent text-primary focus:outline-none focus:border-primary"
                value={range.end}
                onChange={(e) =>
                  setRange((prev) => ({ ...prev, end: e.target.value }))
                }
              />
            </div>

            {/* Fetch / Clear Buttons */}
            {!isFetched ? (
              <Button
                variant="primaryHorizontalGradient"
                className="text-white focus:outline-none focus:ring-0"
                onClick={handleFetch}
                disabled={loading}
              >
                {loading ? "Fetching…" : "Fetch Data"}
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                {/* Once fetched, the Fetch Data button becomes “ghost” */}
                <Button
                  variant="ghost"
                  className="focus:outline-none focus:ring-0 text-white"
                  disabled
                >
                  Fetch Data
                </Button>
                {/* X (clear) button */}
                <button
                  onClick={handleClear}
                  className="p-2 rounded-full hover:bg-surface focus:outline-none focus:ring-0"
                >
                  <X size={20} className="text-muted" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* If not fetched yet, show “no data” graphic. Otherwise, show the table */}
        {!isFetched ? (
          <div className="flex items-center justify-center h-60">
            <img
              src="/images/no-data-illustration.png"
              alt="No Data"
              className="max-h-full"
            />
          </div>
        ) : (
          <div className="mt-6">
            <Table
              columns={columns}
              data={rows}
              footer={
                <div className="flex justify-end space-x-2 gap-6 pt-2">
                  <div className="text-muted font-medium flex">
                    Total Units Sold:
                  <div className="text-primary font-semibold ml-2">{totalUnits}</div>
                  </div>
                  <div className="text-muted font-medium flex ">
                    Total Amount:
                  <div className="text-primary font-semibold ml-2">
                    {totalAmount.toLocaleString()}
                  </div>
                  </div>
                </div>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesReport;
