// src/components/Order/OrderDetailsModal.tsx

import React, { useState, useEffect, useRef } from "react";
import { X, MapPin, Star, ChevronDown } from "lucide-react";
import { getOrderById, getAvailableAgents } from "@/api/ordersService";
import Button from "../ui/Button";
import type { Order } from "@/views/Orders/OrdersPage";

interface OrderDetailsModalProps {
  orderId: string;
  allowAssign?: boolean; // default to false
  onClose: () => void;
  onAssign?: (orderId: string, agentName: string) => Promise<void>;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  orderId,
  allowAssign = false,
  onClose,
  onAssign,
}) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [availableAgents, setAvailableAgents] = useState<string[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [isAgentDropdownOpen, setIsAgentDropdownOpen] = useState(false);
  const agentDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        agentDropdownRef.current &&
        !agentDropdownRef.current.contains(e.target as Node)
      ) {
        setIsAgentDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function fetchOrderData() {
      setLoading(true);
      setError(null);
      try {
        const data = await getOrderById(orderId);
        setOrder(data);

        if (allowAssign && data && !data.agent) {
          const agents = await getAvailableAgents();
          setAvailableAgents(agents);
          if (agents.length > 0) {
            setSelectedAgent(agents[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("Failed to load order details.");
      } finally {
        setLoading(false);
      }
    }
    fetchOrderData();
  }, [orderId, allowAssign]);

  const getStatusBadgeClasses = (status?: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-600 text-white";
      case "On-Going":
        return "bg-blue-600 text-white";
      case "In Progress":
        return "bg-blue-600 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const getDeliveryTimeClasses = (status?: string) => {
    return status === "On-Going" || status === "In Progress"
      ? "bg-green-500 text-white"
      : "bg-red-500 text-white";
  };

  const handleAssignClick = async () => {
    if (order && selectedAgent && onAssign) {
      setLoading(true);
      try {
        await onAssign(order.orderId, selectedAgent);
        const updatedOrder = await getOrderById(orderId);
        setOrder(updatedOrder);
      } catch (assignError) {
        console.error("Error assigning order:", assignError);
      } finally {
        setLoading(false);
      }
    }
  };

  // Placeholder image logic (adjust as needed)
  const productImage = order?.orderFor
    .toLowerCase()
    .includes("burger")
    ? "/placeholder-burger.jpg"
    : "/placeholder-mango.jpg";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-2 sm:p-4 font-poppins">
      <div className="bg-card w-full max-w-lg rounded-xl shadow-2xl flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="flex justify-center items-center bg-transparent text-primary-foreground px-5 pt-3 pb-2 rounded-t-xl relative">
          <div className="absolute bottom-0 left-[5%] right-[5%] h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"></div>
          <h2 className="text-lg font-semibold">Order Details</h2>
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
              Loading Order Details...
            </div>
          ) : error ? (
            <p className="text-center text-red-600 py-10">{error}</p>
          ) : !order ? (
            <p className="text-center text-gray-500 py-10">Order not found.</p>
          ) : (
            <>
              {/* Status Badge */}
              <div className="flex justify-center items-start">
                <span
                  className={`px-3 py-2 text-xs font-semibold rounded-b-xl shadow-lg shadow-black/20 ${getStatusBadgeClasses(
                    order.status
                  )}`}
                >
                  Order Status: {order.status}
                </span>
              </div>

              {/* Order Info + Image */}
              <div className="flex justify-between">
                <div className="flex flex-col gap-x-4 gap-y-3 text-xs">
                  <p>
                    <strong className="font-semibold text-primary">Order ID:</strong>{" "}
                    {order.orderId}
                  </p>
                  <p>
                    <strong className="font-semibold text-primary">Order For:</strong>{" "}
                    {order.orderFor}
                  </p>
                  <div className="flex gap-2">
                    <p>
                      <strong className="font-semibold text-primary">Quantity:</strong>{" "}
                      {order.quantity}
                    </p>
                    <p>
                      <strong className="font-semibold text-primary">Unit Price:</strong>{" "}
                      {order.unitPrice}
                    </p>
                    <p>
                      <strong className="font-semibold text-primary">Total Price:</strong>{" "}
                      {order.totalPrice}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <p>
                      <strong className="font-semibold text-primary">Ordered On:</strong>{" "}
                      {new Date(order.orderOn).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                    <p>
                      <strong className="font-semibold text-primary">Ordered User:</strong>{" "}
                      {order.orderedUser}
                    </p>
                  </div>

                  {order.agent && (
                    <p>
                      <strong className="font-semibold text-primary">Delivered By:</strong>{" "}
                      {order.agent}
                    </p>
                  )}

                  <p>
                    <strong className="font-semibold text-primary">Vendor:</strong>{" "}
                    {order.vendor}
                  </p>

                  <p>
                    <strong className="font-semibold text-primary">Category:</strong>{" "}
                    {order.category}
                  </p>
                </div>
                <div className="flex flex-col rounded-lg overflow-hidden border-2 border-card">
                  <img
                    src={productImage}
                    alt={order.orderFor}
                    className="w-28 h-28 object-cover"
                  />
                  {order.status === "Completed" && (
                    <button className="mt-1.5 text-sm text-gray-500 font-semibold hover:underline">
                      Get Invoice
                    </button>
                  )}
                </div>
              </div>

              {/* Delivery Location + Live GPS */}
              <div className="bg-accent relative rounded-lg p-6 mb-6 space-y-1.5 border border-primary/10 shadow-sm">
                <h4 className="text-primary absolute -top-3 font-semibold text-sm mb-1 chip">
                  Delivery Location
                </h4>
                <p className="text-xs text-foreground/90 leading-relaxed">
                  {order.deliveryLocation.address}
                </p>
                <p className="text-xs text-foreground/90 leading-relaxed pr-2">
                  {order.deliveryLocation.city}, {order.deliveryLocation.state},{" "}
                  {order.deliveryLocation.country} - {order.deliveryLocation.pincode}
                </p>

                <div className="flex items-center justify-between mt-2">
                  <span
                    className={`inline-block px-2.5 py-2 text-xs font-semibold rounded-md ${getDeliveryTimeClasses(
                      order.status
                    )}`}
                  >
                    {order.status === "In Progress"
                      ? "Delivery Time: On-Time"
                      : "Delivery Time: Delayed"}
                  </span>

                  {/* Live GPS Button (only if status is "On-Going") */}
                  {order.status === "In Progress" && (
                    <Button
                      variant="successHoriZontalGradient"
                      className="text-xs  text-white px-3 py-1.5 focus:outline-none focus:ring-0"
                      onClick={() => {
                        // TODO: replace with your “open map” logic
                        console.log("Open live GPS for order:", order.orderId);
                      }}
                    >
                      Live GPS
                    </Button>
                  )}
                </div>
              </div>

              {/* Assign Order (only if allowAssign && no agent) */}
              {allowAssign && !order.agent && (
                <div className="flex items-center justify-between py-2 mb-4">
                  <label
                    htmlFor="agentDropdown"
                    className="text-sm font-semibold text-primary whitespace-nowrap mr-2"
                  >
                    Assign Order –
                  </label>

                  {/* Custom Dropdown */}
                  <div
                    ref={agentDropdownRef}
                    className="relative w-full max-w-[200px]"
                  >
                    {/* Trigger */}
                    <div
                      id="agentDropdown"
                      className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white text-xs font-semibold rounded-md shadow-md cursor-pointer"
                      onClick={() =>
                        setIsAgentDropdownOpen((prev) => !prev)
                      }
                    >
                      <span>
                        {selectedAgent || "Select an Agent"}
                      </span>
                      <ChevronDown size={16} className="text-white" />
                    </div>

                    {/* Dropdown List */}
                    {isAgentDropdownOpen && (
                      <ul className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-auto z-10">
                        {availableAgents.length > 0 ? (
                          availableAgents.map((agent) => (
                            <li
                              key={agent}
                              className={`px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer ${
                                selectedAgent === agent
                                  ? "bg-gray-100 font-semibold"
                                  : ""
                              }`}
                              onClick={() => {
                                setSelectedAgent(agent);
                                setIsAgentDropdownOpen(false);
                              }}
                            >
                              {agent}
                            </li>
                          ))
                        ) : (
                          <li className="px-3 py-2 text-sm text-gray-500">
                            No agents available
                          </li>
                        )}
                      </ul>
                    )}
                  </div>

                  {/* Ratings Display */}
                  <div className="flex items-center ml-3">
                    <span className="text-xs text-primary mr-1">
                      Ratings –
                    </span>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={`${
                          i < (order.ratings || 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-300 text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Customer Details */}
              <div className="bg-accent relative rounded-lg p-6 space-y-2 border border-primary/10 shadow-sm">
                <h4 className="text-primary absolute -top-3 font-semibold text-sm mb-1 chip">
                  Customer Details
                </h4>
                <p className="text-xs">Name: {order.orderedUser}</p>
                <p className="text-xs">Mobile No: {order.customerMobile}</p>
                <div className="flex items-center text-xs">
                  <span
                    className={`font-semibold flex gap-1 ${
                      order.orderRate === "High"
                        ? "text-green-600"
                        : order.orderRate === "Medium"
                        ? "text-yellow-500"
                        : "text-red-600"
                    }`}
                  >
                    <MapPin size={14} className="mr-1" />
                    Order Rate:
                  </span>
                  <span
                    className={`font-semibold ml-1 ${
                      order.orderRate === "High"
                        ? "text-green-600"
                        : order.orderRate === "Medium"
                        ? "text-yellow-500"
                        : "text-red-600"
                    }`}
                  >
                    {order.orderRate}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bottom Assign Button */}
        {allowAssign && order && !order.agent && (
          <div className="px-5 flex justify-center py-2 bg-background rounded-b-xl">
            <Button
              variant="primaryHorizontalGradient"
              onClick={handleAssignClick}
              disabled={!selectedAgent || loading}
            >
              {loading ? "Assigning..." : "Assign Order"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsModal;
