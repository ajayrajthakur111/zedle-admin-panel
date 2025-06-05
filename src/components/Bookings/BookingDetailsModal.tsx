// src/components/Bookings/BookingDetailsModal.tsx

import React, { useState, useEffect } from "react";
import { X, CheckCircle } from "lucide-react";
import {  getBookingById, type Booking } from "@/api/bookingsService";

interface BookingDetailsModalProps {
  bookingId: string;
  onClose: () => void;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  bookingId,
  onClose,
}) => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Helper to format date/time as "HH:MM AM/PM – D MMMM YYYY"
  const formatDateTime = (iso: string): string => {
    const d = new Date(iso);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return d.toLocaleString("en-GB", options);
  };

  // Fetch booking by ID (using getAllBookings internally)
  useEffect(() => {
    const fetchBooking = async () => {
      setLoading(true);
      setError(null);
      try {
        const found = await getBookingById(bookingId);
        if (!found) {
          setError("Booking not found.");
          setBooking(null);
        } else {
          setBooking(found);
        }
      } catch (err) {
        console.error("Error fetching booking:", err);
        setError("Failed to load booking details.");
        setBooking(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  // Determine the “location‐section” title based on category
  const getLocationTitle = (): string => {
    if (!booking) return "Location";
    return booking.category === "Travel & Tourism" ? "Stay Location" : "Saloon Location";
  };

  // Determine the time label inside the location box
  const getLocationTimeLabel = (): { label: string; value: string } => {
    if (!booking) return { label: "", value: "" };
    if (booking.category === "Travel & Tourism") {
      return {
        label: "Check Out",
        value: formatDateTime(booking?.checkoutTime),
      };
    } else {
      return {
        label: "Appointment Time",
        value: formatDateTime(booking.appointmentOn),
      };
    }
  };

  // Determine “Check In” or omit, based on category
  const renderCheckInRow = (): React.ReactNode => {
    if (!booking) return null;
    if (booking.category === "Travel & Tourism") {
      return (
        <p>
          <strong className="font-semibold text-primary">Check In:</strong>{" "}
          {formatDateTime(booking?.checkedInTime)}
        </p>
      );
    }
    return null;
  };

  // Badge classes for status
  const getStatusBadgeClasses = (status: string): string => {
    switch (status) {
      case "Completed":
        return "bg-green-600 text-white";
      case "In-Progress":
        return "bg-blue-600 text-white";
      case "Pending":
        return "bg-amber-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-2 sm:p-4 font-poppins">
      <div className="bg-card w-full max-w-lg rounded-xl shadow-2xl flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="flex justify-center items-center bg-transparent text-primary-foreground px-5 pt-3 pb-2 rounded-t-xl relative">
          <div className="absolute bottom-0 left-[5%] right-[5%] h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
          <h2 className="text-lg font-semibold">Booking Details</h2>
          <button
            onClick={onClose}
            className="absolute right-5 text-primary-foreground hover:text-primary-foreground/80 transition-opacity"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 space-y-4 overflow-y-auto flex-grow">
          {loading ? (
            <div className="flex flex-col items-center justify-center text-primary py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-3"></div>
              Loading Booking Details...
            </div>
          ) : error ? (
            <p className="text-center text-red-600 py-10">{error}</p>
          ) : !booking ? (
            <p className="text-center text-gray-500 py-10">Booking not found.</p>
          ) : (
            <>
              {/* Status Badge */}
              <div className="flex justify-center items-start">
                <span
                  className={`px-3 py-2 text-xs font-semibold rounded-b-xl shadow-lg shadow-black/20 ${getStatusBadgeClasses(
                    booking.status
                  )}`}
                >
                  Status: {booking.status}
                </span>
              </div>

              {/* Booking Info + Image */}
              <div className="flex justify-between">
                {/* Left ‒ Booking Fields */}
                <div className="flex flex-col gap-x-4 gap-y-3 text-xs">
                  <p>
                    <strong className="font-semibold text-primary">Booking ID:</strong>{" "}
                    {booking.bookingId}
                  </p>
                  <p>
                    <strong className="font-semibold text-primary">Booking For:</strong>{" "}
                    {booking.bookingTo}
                  </p>
                  <div className="flex gap-2">
                    <p>
                      <strong className="font-semibold text-primary">Cost:</strong>{" "}
                      {booking.costPerPerson}
                    </p>
                    <p>
                      <strong className="font-semibold text-primary">Members:</strong>{" "}
                      {booking.totalMembers}
                    </p>
                    <p>
                      <strong className="font-semibold text-primary">Total Price:</strong>{" "}
                      ${booking.totalCost}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <p>
                      <strong className="font-semibold text-primary">Booked On:</strong>{" "}
                      {new Date(booking.bookingOn).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                    <p>
                      <strong className="font-semibold text-primary">Booked User:</strong>{" "}
                      {booking.bookedUser}
                    </p>
                  </div>

                  {/* Render “Check In” only for Travel & Tourism */}
                  {renderCheckInRow()}

                  {booking.category !== "Travel & Tourism" && (
                    <p>
                      <strong className="font-semibold text-primary">Appointment Time:</strong>{" "}
                      {formatDateTime(booking.appointmentOn)}
                    </p>
                  )}

                  <p>
                    <strong className="font-semibold text-primary">Vendor:</strong>{" "}
                    {booking.vendorId}
                  </p>
                  <p>
                    <strong className="font-semibold text-primary">Category:</strong>{" "}
                    {booking.category}
                  </p>
                </div>

                {/* Right ‒ Image + Invoice */}
                <div className="flex flex-col rounded-lg overflow-hidden border-2 border-card">
                  <img
                    src={booking.categoryImage}
                    alt={booking.bookingTo}
                    className="w-28 h-28 object-cover"
                  />
                  {booking.invoiceUrl && (
                    <button className="mt-1.5 text-sm text-gray-500 font-semibold hover:underline">
                      Get Invoice
                    </button>
                  )}
                </div>
              </div>

              {/* Location Section */}
              <div className="bg-accent relative rounded-lg p-6 mb-6 space-y-1.5 border border-primary/10 shadow-sm">
                <h4 className="text-primary absolute -top-3 font-semibold text-sm mb-1 chip">
                  {getLocationTitle()}
                </h4>
                {/* For simplicity, using location string. In real, break out address fields. */}
                   <p className="text-xs text-foreground/90 leading-relaxed">
                  {booking.location?.address}
                </p>
                <p className="text-xs text-foreground/90 leading-relaxed pr-2">
                  {booking.location?.city}, {booking.location?.state},{" "}
                  {booking.location?.country} - {booking.location?.pincode}
                </p>
                <div className="flex items-center mt-2">
                  <span className="inline-block px-2.5 py-2 text-xs font-semibold bg-green-600 text-white rounded-md">
                    {getLocationTimeLabel().label}: {getLocationTimeLabel().value}
                  </span>
                </div>
              </div>

              {/* Customer Details Section */}
              <div className="bg-accent relative rounded-lg p-6 space-y-2 mb-4 border border-primary/10 shadow-sm">
                <h4 className="text-primary absolute -top-3 font-semibold text-sm mb-1 chip">
                  Customer Details
                </h4>
                <p className="text-xs">
                  <strong>Name:</strong> {booking.bookedUser}
                </p>
                <p className="text-xs">
                  <strong>Mobile No:</strong> {booking.customerPhoneNumber}
                </p>
                <div className="flex items-center text-xs">
                  <CheckCircle size={16} className="text-green-600 mr-1" />
                  <span className="font-semibold text-green-600">
                    Booking Rate: {booking.customerBookingRate}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
