import React from "react";
import { X, Users } from "lucide-react";
import Button from "../ui/Button";

interface Props {
  isOpen: boolean;
  loading: boolean;
  count: number;
  onClose: () => void;
  onView: () => void;
}

const NotificationModal: React.FC<Props> = ({
  isOpen,
  loading,
  count,
  onClose,
  onView,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end pt-16 pr-4">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white w-200 max-w-sm rounded-[var(--radius-lg)] shadow-lg overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-[16px] font-semibold text-[var(--color-primary)]">
            Notifications
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--color-primary)] p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-6 w-6 border-2 border-b-0 border-[var(--color-primary)] rounded-full" />
            </div>
          ) : count > 0 ? (
            <div className="bg-[var(--color-primary)]/95 rounded-[var(--radius-md)] px-4 py-3 flex items-center gap-3 text-white">
              <div className="bg-white/20 p-2 rounded-md">
                <Users size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="text-lg font-bold mr-1">{count}</span>
                  New Complaints Raised...!
                </p>
              </div>
              <Button
                variant="secondary"
                className="bg-white px-2 text-sm border border-white/30 w-auto"
                onClick={onView}
              >
                View Complaints
              </Button>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-6">
              <p>No new notifications</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
