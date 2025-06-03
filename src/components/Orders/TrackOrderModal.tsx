import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { TrackInfo } from "@/api/ordersService";
import { trackOrderById } from "@/api/ordersService";

interface TrackOrderModalProps {
  orderId: string;
  onClose: () => void;
}

const TrackOrderModal: React.FC<TrackOrderModalProps> = ({ orderId, onClose }) => {
  const [trackInfo, setTrackInfo] = useState<TrackInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchTrack() {
      setLoading(true);
      const info = await trackOrderById(orderId);
      setTrackInfo(info);
      setLoading(false);
    }
    fetchTrack();
  }, [orderId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md mx-auto overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center bg-green-600 text-white px-4 py-2">
          <h3 className="text-lg font-medium">Tracking Order: {orderId}</h3>
          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          {loading || !trackInfo ? (
            <p className="text-center text-primary py-8">Loading…</p>
          ) : (
            <>
              <p className="text-sm text-primary">
                <span className="font-medium">Latitude:</span>{" "}
                {trackInfo.lat.toFixed(5)}
              </p>
              <p className="text-sm text-primary">
                <span className="font-medium">Longitude:</span>{" "}
                {trackInfo.lng.toFixed(5)}
              </p>
              <p className="text-sm text-primary">
                <span className="font-medium">ETA:</span> {trackInfo.eta}
              </p>
              {/* In Phase 2, embed a map here using lat/lng */}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackOrderModal;
