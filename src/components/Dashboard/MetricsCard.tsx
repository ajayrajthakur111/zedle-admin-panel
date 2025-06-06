import React, { useEffect, useState } from "react";
import { getMetrics, type Metrics } from "@/api/authService";
import image from "@/assets/dashboard/statsIllustration.svg";
import totalOrdersIcon from "@/assets/dashboard/total_order_icon.svg";
import totalEarningsIcon from "@/assets/dashboard/Total_Earnings.svg";
import vendorsIcon from "@/assets/dashboard/active_vendor.svg";
import activeDeliveryIcon from "@/assets/dashboard/delivery_agents.svg";
import totalSalesIcon from "@/assets/dashboard/Sales_icon.svg";

import { Loader2, AlertTriangle } from "lucide-react";

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
      <div className="flex w-66 items-center justify-between bg-[#5B104D0F] px-3 py-1 rounded">
        <div className="w-auto h-7 rounded-lg  flex items-center gap-2 justify-between mr-3 shrink-0">
          {icon}
          <span className="text-xs font-semibold text-[#630853] ">{label}</span>
        </div>
        <span className="text-xs font-bold  mr-4 whitespace-nowrap text-[#5E0474]">
          : {value}
        </span>
      </div>
    </li>
  );

  if (isLoading) {
    return (
      <div
        style={{
          background:
            "linear-gradient(119.81deg, rgba(255, 218, 254, 0.25) 26.02%, rgba(230, 166, 229, 0.12) 119.51%)",
        }}
        className="rounded-xl shadow-lg p-6 flex flex-col items-center justify-center min-h-[340px] h-full"
      >
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
        <span className="text-primary font-medium">Loading metrics…</span>
      </div>
    );
  }

  if (errorMessage || !metricsData) {
    return (
      <div className="bg-[#fcf3fc] rounded-xl shadow-lg p-6 flex flex-col items-center justify-center text-center min-h-[340px] h-full">
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
      className="bg-accent rounded-lg p-2 px-0 flex flex-col relative justify-between h-70 border-2 border-[#ca90c4]"
     
    >
      <div className="absolute z-10">
        <ul className="space-y-0.5  ">
          {renderStatItem(
            <img src={totalOrdersIcon} alt="total orders" />,
            "Total Orders",
            metricsData.totalOrders
          )}
          {renderStatItem(
            <img src={totalEarningsIcon} alt="total Earnings" />,
            "Total Earnings",
            `Rs ${metricsData.totalEarnings}/-`
          )}
          {renderStatItem(
            <img src={vendorsIcon} alt="Active Vendors" />,
            "Active Vendors",
            metricsData.activeVendors
          )}
          {renderStatItem(
            <img src={activeDeliveryIcon} alt="Active Delivery Agents" />,
            "Active Delivery Agents",
            metricsData.activeDeliveryAgents
          )}
          {renderStatItem(
            <img src={totalSalesIcon} alt="total Sales" />,
            "Total Sales",
            `Rs ${metricsData.totalSales}/-`
          )}
        </ul>
      </div>
      <div className="bg-[#95047B] w-8 h-10 absolute right-0  rounded-l z-10"></div>
      <div className="bg-[#FAC3E1] w-8 h-10 absolute right-5 top-5 rounded z-8"></div>
      <img
        src={image}
        className="absolute w-auto right-0 bottom-0 z-9 bg-transparent"
      />
    </div>
  );
};
