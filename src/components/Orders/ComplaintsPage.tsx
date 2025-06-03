// src/components/Complaints/ComplaintsPage.tsx
import React, { useState, useEffect } from "react";
import { ChevronLeft, ListCheck, Phone } from "lucide-react";
import {
  getAllComplaints,
  resolveComplaint,
  type Complaint,
} from "@/api/complaintsService";
import PhoneDetailsModal from "@/components/Complaints/PhoneDetailsModal";
import ResolveSuccessModal from "@/components/Complaints//ResolveSuccessModal";
import OrderDetailsModal from "@/components/Orders/OrderDetailsModal";
import Button from "@/components/ui/Button";

interface ComplaintsPageProps {
  onCloseIssues: () => void;
}

const ComplaintsPage: React.FC<ComplaintsPageProps> = ({ onCloseIssues }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  // For phone modal:
  const [phoneModalData, setPhoneModalData] = useState<{
    name: string;
    phone: string;
  } | null>(null);

  // For reassign:
  const [reassignOrderId, setReassignOrderId] = useState<string | null>(null);

  // For showing “Resolved!” success overlay:
  const [resolveSuccessMsg, setResolveSuccessMsg] = useState<string | null>(
    null
  );

  // Fetch all “Open” complaints on mount
  useEffect(() => {
    async function loadComplaints() {
      setLoading(true);
      try {
        const data = await getAllComplaints();
        setComplaints(data);
      } catch (err) {
        console.error("Error loading complaints:", err);
      } finally {
        setLoading(false);
      }
    }
    loadComplaints();
  }, []);

  // Handle “Resolve” click
  const handleResolve = async (complaintId: string) => {
    try {
      await resolveComplaint(complaintId);
      setResolveSuccessMsg("Complaint resolved successfully!");
      // Remove the resolved complaint from the list immediately:
      setComplaints((prev) =>
        prev.filter((c) => c.complaintId !== complaintId)
      );
    } catch (err) {
      console.error("Error resolving:", err);
    }
  };

  return (
    <div className="p-6 space-y-4">
      {/* 1) Header + Back Button */}
      <div className="flex gap-2">
        <button
          onClick={onCloseIssues}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close Issues"
        >
            <ChevronLeft/>
        </button>
        <h2 className="text-2xl font-semibold text-primary">Issues Raised</h2>
      </div>

      {/* 2) Complaint Cards Container */}
      {loading ? (
        <p className="text-center text-primary py-12">Loading complaints…</p>
      ) : complaints.length === 0 ? (
        <p className="text-center text-gray-500 py-12">
          No open complaints.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4  bg-surface min-h-[50vh] p-6 rounded-xl">
          {complaints.map((c) => (
            <div
              key={c.complaintId}
              className="bg-card border border-purple-200 h-fit rounded-lg shadow-sm p-4 space-y-3"
            >
              {/* Top: Title + Phone Icon */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-primary">
                    {c.title}
                  </h3>
                  {/* <p className="text-xs text-gray-500">Complaint ID: {c.complaintId}</p> */}
                </div>
                <button
                  onClick={() =>
                    setPhoneModalData({
                      name: c.deliveryPersonName,
                      phone: c.deliveryPersonPhone,
                    })
                  }
                  className="text-red-600 hover:text-red-800"
                  aria-label="Show phone details"
                >
                  <Phone size={20} />
                </button>
              </div>

              {/* Complaint Info */}
              <div className="text-xs space-y-1">
                <p>
                  <strong className="font-semibold text-primary">
                    Order ID:
                  </strong>{" "}
                  {c.orderId}
                </p>
                <p>
                  <strong className="font-semibold text-primary">
                    Description:
                  </strong>{" "}
                  {c.description}
                </p>
                <p>
                  <strong className="font-semibold text-primary">Raised By:</strong>{" "}
                  {c.raisedBy}
                </p>
                <p>
                  <strong className="font-semibold text-primary">
                    Delivery Person:
                  </strong>{" "}
                  {c.deliveryPersonName}
                </p>
                <p>
                  <strong className="font-semibold text-primary">
                    Raised On:
                  </strong>{" "}
                  {new Date(c.raisedOn).toLocaleDateString("en-GB")}
                </p>
              </div>

              {/* Buttons: Re-Assign + Resolve */}
              <div className="flex gap-2 mt-2">
                {/* Re-Assign */}
                <Button
                  variant="infoSolid"
                  onClick={() => setReassignOrderId(c.orderId)}
                  className="flex-1 text-xs"
                >
                  Re-Assign
                </Button>

                {/* Resolve */}
                <Button
                icon={<ListCheck size={18}/>}
                iconPosition="right"
                  variant="successSolidGradient"
                  onClick={() => handleResolve(c.complaintId)}
                  className="flex-1 text-xs bg-green-700  text-white"
                >
                  Resolved
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3) Phone Details Modal */}
      {phoneModalData && (
        <PhoneDetailsModal
          name={phoneModalData.name}
          phone={phoneModalData.phone}
          onClose={() => setPhoneModalData(null)}
        />
      )}

      {/* 4) Re-Assign Order Modal */}
      {reassignOrderId && (
        <OrderDetailsModal
          orderId={reassignOrderId}
          allowAssign={true}
          // We pass a no-op onAssign for now; you can wire real logic if needed
          onAssign={async (orderId, agentName) => {
            console.log(`Re-assign ${orderId} → ${agentName}`);
          }}
          onClose={() => setReassignOrderId(null)}
        />
      )}

      {/* 5) Transient “Resolved!” Overlay */}
      {resolveSuccessMsg && (
        <ResolveSuccessModal
          message={resolveSuccessMsg}
          onClose={() => setResolveSuccessMsg(null)}
        />
      )}
    </div>
  );
};

export default ComplaintsPage;
