// src/pages/BookingsPage.tsx

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Filter, Search,  MessageSquareDot } from "lucide-react";
import Table, { type Column } from "@/components/ui/Table";
import { debounce } from "lodash";
import Button from "@/components/ui/Button";
import { getAllBookings, type Booking, type BookingCategory } from "@/api/bookingsService";
import ComplaintsPage from "@/components/Orders/ComplaintsPage"; // reuse existing
import BookingDetailsModal from "@/components/Bookings/BookingDetailsModal";
// src/pages/BookingsPage.tsx

const BOOKING_CATEGORIES: BookingCategory[] = [
  "Travel & Tourism",
  "Enterprise Hub",
];

export const BookingsPage: React.FC = () => {
  // ─────────────────────────────────────
  // State
  // ─────────────────────────────────────
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [categoryFilter, setCategoryFilter] = useState<BookingCategory | "">("");
  const [searchTerm, setSearchTerm] = useState<string>("");       // used in API call
  const [searchInput, setSearchInput] = useState<string>("");     // bound to <input>
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);

  // “Issues Raised” mode
  const [issuesMode, setIssuesMode] = useState(false);

  // Booking Details Modal
  const [detailsModalBookingId, setDetailsModalBookingId] = useState<string | null>(null);

  // ─────────────────────────────────────
  // Debounce the searchTerm so we only call API after user stops typing
  // ─────────────────────────────────────
  // We debounce setting `searchTerm` by 500ms whenever `searchInput` changes.
  const debouncedSetSearch = useMemo(() => {
    return debounce((val: string) => {
      setSearchTerm(val);
      setPage(1);
    }, 500);
  }, []);

  // When the user types, update searchInput, then trigger debouncedSetSearch
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setSearchInput(val);
      debouncedSetSearch(val);
    },
    [debouncedSetSearch]
  );

  // ─────────────────────────────────────
  // Fetch bookings whenever page, categoryFilter, or searchTerm change (unless in issuesMode)
  // ─────────────────────────────────────
  useEffect(() => {
    if (issuesMode) return;

    const fetchBookings = async () => {
      setLoading(true);
      setError(null);

      try {
        // Pass categoryFilter and searchTerm directly to the service call
        const { rows, totalCount } = await getAllBookings({
          page,
          limit: 10,
          category: categoryFilter || undefined,
          search: searchTerm || undefined,
        });

        setBookings(rows);
        setTotalCount(totalCount);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setError("Unable to load bookings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [page, categoryFilter, searchTerm, issuesMode]);

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
  // Column Definitions for “Bookings” table
  // ─────────────────────────────────────
  const baseColumns: Column<Booking>[] = [
    {
      header: "Booking ID",
      accessor: "bookingId",
      width: "w-[8vw]",
    },
    {
      header: "Booking To",
      accessor: "bookingTo",
      width: "w-[12vw]",
    },
    {
      header: "Cost",
      accessor: "costPerPerson",
      width: "w-[8vw]",
      cell: (row) => row.costPerPerson,
    },
    {
      header: "Booked On",
      accessor: "bookingOn",
      width: "w-[10vw]",
      cell: (row) =>
        new Date(row.bookingOn).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
    },
    {
      header: "Booked User",
      accessor: "customerPhoneNumber",
      width: "w-[12vw]",
      cell: (row) => row.customerPhoneNumber,
    },
    {
      header: "Vendor",
      accessor: "vendorId",
      width: "w-[12vw]",
      cell: (row) => row.vendorId,
    },
    {
      header: "Status",
      accessor: "status",
      width: "w-[8vw]",
      cell: (row) => {
        let color = "text-secondary";
        if (row.status === "Pending") color = "text-amber-500";
        else if (row.status === "In-Progress") color = "text-blue-500";
        else if (row.status === "Completed") color = "text-green-600";
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
      header: "Info",
      width: "w-[8vw]",
      accessor: "bookingId", // dummy accessor to satisfy type
      cell: (row) => (
        <button
          onClick={() => setDetailsModalBookingId(row.bookingId)}
          className="text-primary underline text-sm"
        >
          View Details
        </button>
      ),
      className: "text-center",
    },
  ];

  // ─────────────────────────────────────
  // If in “Issues Raised” mode → render ComplaintsPage
  // ─────────────────────────────────────
  if (issuesMode) {
    return <ComplaintsPage onCloseIssues={() => setIssuesMode(false)} />;
  }

  // ─────────────────────────────────────
  // Otherwise → render normal BookingsPage UI
  // ─────────────────────────────────────
  return (
    <div className="space-y-6 p-8">
      {/* 1) Title + “Issues Raised” Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-primary">Bookings</h1>
        <Button
          variant="primaryHorizontalGradient"
          icon={<MessageSquareDot className="transform scale-x-[-1]" />}
          onClick={() => {
            setIssuesMode(true);
            setCategoryFilter("");
            setSearchInput("");
            setSearchTerm("");
            setPage(1);
          }}
        >
          <span>Issues Raised</span>
        </Button>
      </div>

      {/* 2) Filters / Search Bar */}
      <div className="bg-surface rounded-xl p-6 space-y-4">
        {/* Total Bookings + Filter Icon */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-secondary text-lg font-semibold">
              Total Bookings:{" "}
              <span className="text-primary font-semibold">{totalCount}</span>
            </div>
            {/* Category Filter */}
            <div className="relative" ref={categoryRef}>
              <button
                onClick={() => setCatDropdownOpen((o) => !o)}
                className="p-2 hover:bg-surface rounded"
              >
                <Filter className="h-5 w-5 text-primary" />
              </button>
              {catDropdownOpen && (
                <ul className="absolute top-full mt-1 w-48 bg-white border border-muted rounded-md shadow-lg z-20">
                  {BOOKING_CATEGORIES.map((cat) => (
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

          {/* Search Input */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 border border-none rounded-md px-2 py-1 w-64 text-muted bg-white">
              <Search className="h-4 w-4" />
              <input
                type="text"
                placeholder="Search Booking by ID"
                value={searchInput}
                onChange={handleSearchChange}
                className="flex-grow text-sm text-primary focus:outline-none"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Show an error if API call fails */}
        {error && <p className="text-danger text-sm">{error}</p>}

        {/* 3) Main Table */}
        {loading ? (
          <p className="text-primary text-center py-12">Loading…</p>
        ) : bookings.length > 0 ? (
          <Table
            columns={baseColumns}
            data={bookings}
            className="border-separate"
            pagination={{
              currentPage: page,
              totalPages: Math.ceil(totalCount / 10),
              onPageChange: (newPage) => {
                setPage(newPage);
                window.scrollTo({ top: 0, behavior: "smooth" });
              },
            }}
            rowClassName={(row) =>
              row.status === "In-Progress" ? "bg-[#FFCCCC42] rounded-lg" : ""
            }
          />
        ) : (
          <p className="text-center text-muted py-12">No Data Found</p>
        )}
      </div>

      {/* 4) Booking Details Modal */}
      {detailsModalBookingId && (
        <BookingDetailsModal
          bookingId={detailsModalBookingId}
          onClose={() => {
            setDetailsModalBookingId(null);
            setPage(1);
          }}
        />
      )}
    </div>
  );
};

export default BookingsPage;
