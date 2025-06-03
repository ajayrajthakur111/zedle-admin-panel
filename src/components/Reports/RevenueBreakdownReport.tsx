// src/components/Reports/RevenueBreakdownReport.tsx
import React, { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { fetchRevenueBreakdown } from "@/api/reportsService";
import Button from "../ui/Button";

interface RevenueBreakdownReportProps {
  onBack: () => void;
}

const categories = ["Food", "Grocery", "Events", "Category 4"];

export const RevenueBreakdownReport: React.FC<
  RevenueBreakdownReportProps
> = () => {
  const [selectedCat, setSelectedCat] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [revenue, setRevenue] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Ref & effect to close dropdown when clicking outside
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const handleFetch = async (cat: string) => {
    setLoading(true);
    const data = await fetchRevenueBreakdown(cat);
    setRevenue(data.totalRevenue);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Category selector */}
      <div
        className="relative flex gap-2 justify-start items-center "
        ref={dropdownRef}
      >
        <div className="text-muted text-sm mb-1 ml-8 ">
          Please select Category to continue
        </div>
        <div className="flex items-center gap-2 max-w-md w-60">
          <Button
            variant="dropdown"
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex-grow flex items-center justify-between px-4 py-2  text-white rounded-l-md focus:outline-none"
          >
            <span className="text-sm">
              {selectedCat ? selectedCat : "Select Category"}
            </span>
          </Button>

          {/* Fetch button with right‐arrow */}
          <button
            onClick={() => selectedCat && handleFetch(selectedCat)}
            disabled={!selectedCat || loading}
            className={`
              flex items-center justify-center px-4 py-2
              rounded-r-md text-white shadow-md hover:shadow-lg
              ${!selectedCat || loading ? "bg-white cursor-not-allowed" : ""}
              focus:outline-none
            `}
          >
            {loading ? (
              <span className="text-sm">Loading…</span>
            ) : (
              <ArrowRight className="h-5 w-5 text-primary font-semibold" />
            )}
          </button>
        </div>

        {/* Dropdown menu items */}
        {dropdownOpen && (
          <ul className="absolute top-full mt-1 left-60 w-60 bg-primary rounded-md shadow-lg z-10">
            {categories.map((cat) => (
              <li
                key={cat}
                onClick={() => {
                  setSelectedCat(cat);
                  setDropdownOpen(false);
                  setRevenue(null);
                }}
                className="px-4 py-2 text-sm text-white hover:bg-secondary cursor-pointer"
              >
                {cat}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Display Total Revenue */}
      <div className="bg-surface min-h-60 rounded-xl p-6">
        {loading ? (
          <p className="text-center text-primary">Loading…</p>
        ) : revenue !== null ? (
          <p className="text-primary font-semibold">
            Total revenue till {new Date().toLocaleDateString("en-GB")} -{" "}
            <span className="font-semibold">
              Rs. {revenue.toLocaleString()}/-
            </span>
          </p>
        ) : (
          <p className="text-center text-muted py-12">No Data Found</p>
        )}
      </div>
    </div>
  );
};

export default RevenueBreakdownReport;
