import { CompletedDeliveriesCard } from "@/components/Dashboard/CompletedDeliveriesCard";
import { MetricsCard } from "@/components/Dashboard/MetricsCard";
import { PendingOrdersCard } from "@/components/Dashboard/PendingOrdersCard";
import { TopAgentsCard } from "@/components/Dashboard/TopAgentsCard";
import { VendorChart } from "@/components/Dashboard/VendorChart";
import Button from "@/components/ui/Button";
import { useAdminStore } from "@/store/adminStore";
import React from "react";
import { useNavigate } from "react-router-dom";

export const DashboardPage: React.FC = () => {
  const name = useAdminStore((state) => state.profile?.name);
  const navigate= useNavigate()
  return (
    <div className="p-8 space-y-6 bg-background min-h-screen ">
      <div className="flex gap-2 m-0">
        <span className="text-xl font-light text-secondary">Welcome Back</span>
        <span className="text-xl font-semibold ">{name},</span>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl text-primary">Dashboard</h1>
        <Button className="bg-primary px-6 py-2 rounded-md text-white hover:bg-primary/90 transition" onClick={()=>navigate('reports')}>
          Reports 📈
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <MetricsCard />
          <TopAgentsCard />
        </div>

        <div className="lg:col-span-1 ">
          <PendingOrdersCard />
          <div className="h-[350px]">
            <VendorChart />
          </div>
        </div>
        <div className="lg:col-span-1">
          <CompletedDeliveriesCard />
        </div>
      </div>
    </div>
  );
};
