/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState } from "react";
import { getPendingOrder, type PendingOrder } from "@/api/authService";
import image from "@/assets/dashboard/cardboard-box-with-cargo-checklist-pencil.svg";

export const PendingOrdersCard: React.FC = () => {
  const [data, setData] = useState<PendingOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getPendingOrder();
        setData(res);
      } catch (e) {
        setError("Failed to load pending order.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="bg-card rounded-lg shadow-md p-6 flex items-center justify-center">
        <span className="text-primary">Loading pending order…</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-purple-50 rounded-lg shadow-md p-6">
        <p className="text-red-500">{error || "No data."}</p>
      </div>
    );
  }

  return (
    <div className="bg-white relative rounded-lg border-1 border-[#ca90c4] shadow-md p-4">
      <h2 className="text-xl font-bold text-[#8E0976] mb-2">
        Pending Orders
      </h2>

      <p className="text-sm mt-4 flex flex-col gap-1">
        <span className=" text-sm text-primary ">
          Order By: {data.orderBy}{" "}
        </span>
        <span className="font-semibold text-sm text-[#E31616]">
          Due: {data.dueDate}
        </span>
      </p>

      <div>
        <img src={image} className="absolute w-30 h-30  top-0 right-6 "/>
      </div>
    </div>
  );
};
