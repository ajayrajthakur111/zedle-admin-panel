// src/components/Reports/ReportsPage.tsx
import React, { useState } from "react";
import SalesReport from "@/components/Reports/SalesReport";
import TopSellingReport from "@/components/Reports/TopSellingReport";
import DeliveryAgentPerformanceReport from "@/components/Reports/DeliveryAgentPerformanceReport";
import RevenueBreakdownReport from "@/components/Reports/RevenueBreakdownReport";
import { ChevronLeft } from "lucide-react";
import Checkbox from "@/components/ui/Checkbox";
import { useNavigate } from "react-router-dom";

type ReportKey =
  | "sales"
  | "topSelling"
  | "deliveryPerf"
  | "revenueBreakdown"
  | null;

// Human-readable labels for each key
const LABELS: Record<Exclude<ReportKey, null>, string> = {
  sales: "Sales Report",
  topSelling: "Top-Selling Product / Service Report",
  deliveryPerf: "Delivery Performance Report",
  revenueBreakdown: "Revenue Breakdown Report",
};

export const ReportsPage: React.FC = () => {
  const [selected, setSelected] = useState<ReportKey>(null);
  const navigate = useNavigate();

  // Clear selection (uncheck everything)
  const clearSelection = () => setSelected(null);

  return (
    <div className="p-6 bg-background min-h-screen">
      {/* HEADER (always visible) */}
      <div className="flex items-center gap-4 mb-4">
        {selected && (
          <button onClick={clearSelection} className="p-1">
            <ChevronLeft size={24} className="text-primary" />
          </button>
        )}
        <ChevronLeft
          size={24}
          className={`${selected ? "hidden" : "text-primary cursor-pointer"}`}
          onClick={() => navigate(-1)}
        />
        <h2 className="text-2xl text-primary font-semibold">Reports</h2>
      </div>

      {/* FULL LIST: fades/collapses when a report is selected */}
      <div
        className={`
          transition-all duration-300 overflow-hidden
          ${selected ? "max-h-0 opacity-0" : "max-h-[500px] opacity-100"}
        `}
      >
        <div className="space-y-2 max-w-md ml-6">
          {(
            [
              { id: "sales", label: "Sales Report" },
              { id: "topSelling", label: "Top-Selling Product / Service Report" },
              { id: "deliveryPerf", label: "Delivery Performance Report" },
              { id: "revenueBreakdown", label: "Revenue Breakdown Report" },
            ] as Array<{ id: Exclude<ReportKey, null>; label: string }>
          ).map((item) => (
            <label
              key={item.id}
              className="flex items-center space-x-2 cursor-pointer select-none"
            >
              <Checkbox
                id={item.id}
                label=""
                checked={selected === item.id} 
                onChange={() => setSelected(item.id)} 
              />
              <span className="text-secondary font-semibold">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* SELECTED VIEW: fades/expands when a report is selected */}
      <div
        className={`
          transition-all duration-300 overflow-hidden
          ${selected ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        {selected && (
          <div className="space-y-6">
            {/* Single checked checkbox + label (clicking unchecks & returns to list) */}
            <div className="flex items-center ml-6 space-x-2">
              <Checkbox
                id="selected-report"
                label=""
                checked={true}
                onChange={clearSelection}
              />
              <span className="text-secondary font-semibold">{LABELS[selected]}</span>
            </div>

            {/* Render the chosen report’s component */}
            <div className="mt-4">
              {selected === "sales" && <SalesReport onBack={clearSelection} />}
              {selected === "topSelling" && <TopSellingReport onBack={clearSelection} />}
              {selected === "deliveryPerf" && (
                <DeliveryAgentPerformanceReport onBack={clearSelection} />
              )}
              {selected === "revenueBreakdown" && (
                <RevenueBreakdownReport onBack={clearSelection} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
