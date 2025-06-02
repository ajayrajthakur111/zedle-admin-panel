import React, { useEffect, useState } from "react";
import { getMetrics, type Metrics } from "@/api/authService";
import image from "@/assets/dashboard/statsIllustration.svg";

import {
  ShoppingCart,
  BadgeIndianRupee,
  Store,
  Users,
  LineChart,
  Loader2,
  AlertTriangle,
} from "lucide-react";

export const MetricsCard: React.FC = () => {
  const [metricsData, setMetricsData] = useState<Metrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadMetrics = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const data = await getMetrics();
        setMetricsData(data);
      } catch (error) {
        console.error("Failed to fetch metrics:", error);
        setErrorMessage("Could not load metrics data.");
      } finally {
        setIsLoading(false);
      }
    };
    loadMetrics();
  }, []);

  const renderStatItem = (
    icon: React.ReactNode,
    label: string,
    value: string | number
  ) => (
    <li className="flex items-center py-2">
      <div className="flex w-66 items-center justify-between bg-accent px-3 py-1 rounded">
        <div className="w-auto h-7 rounded-lg  flex items-center gap-2 justify-between mr-3 shrink-0">
          {icon}
          <span className="text-sm font-semibold ">{label}</span>
        </div>
        <span className="text-sm font-bold  mr-2 whitespace-nowrap text-highlight">
          : {value}
        </span>
      </div>
    </li>
  );

  if (isLoading) {
    return (
      <div className="bg-purple-50 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center min-h-[340px] h-full">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
        <span className="text-primary font-medium">Loading metrics…</span>
      </div>
    );
  }

  if (errorMessage || !metricsData) {
    return (
      <div className="bg-card rounded-xl shadow-lg p-6 flex flex-col items-center justify-center text-center min-h-[340px] h-full">
        <AlertTriangle className="h-10 w-10 text-destructive mb-3" />
        <p className="text-destructive font-semibold">Error</p>
        <p className="text-sm text-muted-foreground">
          {errorMessage || "No metrics data available."}
        </p>
      </div>
    );
  }

  return (
    <div
      className="bg-card rounded-lg p-2 px-0 flex flex-col border-2 border-secondary relative justify-between h-70"
      style={{ boxShadow: "12px 0 24px -4px rgba(0,0,0,0.15)" }}
    >
      <div className="absolute z-10">
        <ul className="space-y-0.5  ">
          {renderStatItem(
            <ShoppingCart size={18} className="text-primary" />,
            "Total Orders",
            metricsData.totalOrders
          )}
          {renderStatItem(
            <BadgeIndianRupee size={18} className="text-primary" />,
            "Total Earnings",
            `Rs ${metricsData.totalEarnings}/-`
          )}
          {renderStatItem(
            <Store size={18} className="text-primary" />,
            "Active Vendors",
            metricsData.activeVendors
          )}
          {renderStatItem(
            <Users size={18} className="text-primary" />,
            "Active Delivery Agents",
            metricsData.activeDeliveryAgents
          )}
          {renderStatItem(
            <LineChart size={18} className="text-primary " />,
            "Total Sales",
            `Rs ${metricsData.totalSales}/-`
          )}
        </ul>
      </div>
      <img src={image} className="absolute w-auto h-36 right-0 bottom-0 z-9" />
    </div>
  );
};
