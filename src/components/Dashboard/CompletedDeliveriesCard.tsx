// src/components/Dashboard/CompletedDeliveriesCard.tsx
import React, { useEffect, useState } from "react";
import {
  getCompletedDeliveries,
  type CompletedDelivery,
} from "@/api/authService";
import { MapPin, Loader2, AlertTriangle } from "lucide-react";
import { twMerge } from "tailwind-merge";

const getBadgeStyles = (
  badgeColor?: "red" | "gold" | "green",
  count?: number
): string => {
  console.log(badgeColor);
  if (badgeColor === "red" || (count !== undefined && count <= 300)) {
    return "bg-danger text-white";
  }
  if (
    badgeColor === "gold" ||
    (count !== undefined && count > 300 && count <= 1000)
  ) {
    return "bg-warning text-white";
  }
  if (badgeColor === "green" || (count !== undefined && count > 1000)) {
    return "bg-success text-white";
  }
  return "bg-info text-white";
};

export const CompletedDeliveriesCard: React.FC = () => {
  const [data, setData] = useState<CompletedDelivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getCompletedDeliveries();
        setData(res);
      } catch (e) {
        console.error("Failed to load completed deliveries:", e);
        setError("Failed to load deliveries.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const cardContainerClasses =
    " rounded-xl shadow-lg p-3 w-full h-fit flex flex-col border-1 border-[#c072c6]";
  const minCardHeight = "min-h-[300px]";

  if (loading) {
    return (
      <div
        className={twMerge(
          cardContainerClasses,
          "items-center justify-center",
          minCardHeight
        )}
      >
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
        <span className="text-primary font-medium">Loading deliveries…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={twMerge(
          cardContainerClasses,
          "items-center justify-center text-center",
          minCardHeight
        )}
      >
        <AlertTriangle className="h-10 w-10 text-destructive mb-3" />
        <p className="text-destructive font-semibold">Error</p>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className={twMerge(cardContainerClasses)}>
      <h2 className="text-lg font-poppins font-semibold text-primary text-center mb-4 pb-2  border-b border-primary/20">
        Completed Deliveries
      </h2>
      {data.length === 0 ? (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-muted-foreground">
            No completed deliveries found.
          </p>
        </div>
      ) : (
        <ul className="space-y-3 overflow-y-auto flex-grow pr-1">
          {data.map((delivery, idx) => (
            <li
              // key={delivery._id || idx}
              key={idx}
              className="flex justify-between items-center bg-card hover:bg-card-hover p-4 rounded-lg border border-primary/20 transition-colors duration-150 shadow-sm"
            >
              <div className="flex flex-col gap-1">
                <div className="flex  pb-1">
                <MapPin size={18} className="text-destructive mr-1 shrink-0" />
                  <p className="font-semibold text-sm text-primary">
                    {delivery.location}
                  </p>
                </div>
                  <p className="text-xs  text-muted">
                    Till {delivery.tillDate}
                  </p>
              </div>
              <span
                className={twMerge(
                  "px-8 py-1.5 rounded-md text-xs sm:text-sm font-bold whitespace-nowrap min-w-[70px] text-center",
                  getBadgeStyles(delivery.badgeColor, delivery.count)
                )}
              >
                {delivery.count}+
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
