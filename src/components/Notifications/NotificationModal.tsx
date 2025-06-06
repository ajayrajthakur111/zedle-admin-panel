import React from "react";
import crossIcon from "@/assets/cross_icon.svg";
import notificationTrainingIcon from "@/assets/header/notification_training_icon.svg";

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
      <div className="relative bg-white w-[520] min-h-[400px] rounded-b-lg shadow-lg overflow-hidden border p-5 border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between text-2xl p-3 border-b-3 border-[#C0C0C0BF]">
          <h2 className="text-[16px] font-semibold text-[var(--color-primary)]">
            Notifications
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--color-primary)] p-1 hover:bg-gray-100 rounded-full"
          >
            <img src={crossIcon} className="w-3 h-3" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-6 w-6 border-2 border-b-0 border-[var(--color-primary)] rounded-full" />
            </div>
          ) : count > 0 ? (
            <div className="bg-[#742969] rounded-[var(--radius-md)] px-4 py-3 flex items-center gap-3 text-white">
              <div className=" rounded-md">
                <img src={notificationTrainingIcon} />
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="text-xl font-bold mr-1">{count}</span>
                  New Complaints Raised...!
                </p>
              </div>
                <Button
                variant="secondary"
                className="bg-white text-xs whitespace-nowrap border border-white/30 w-auto p-2"
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
