/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/Dashboard/TopAgentsCard.tsx
import React, { useEffect, useState } from 'react';
import { getTopAgents,type TopAgent } from '@/api/authService';

export const TopAgentsCard: React.FC = () => {
  const [data, setData] = useState<TopAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getTopAgents();
        setData(res);
      } catch (e) {
        setError('Failed to load top agents.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="bg-card rounded-lg shadow-md p-6  mt-4 flex items-center justify-center">
        <span className="text-primary">Loading top agents…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card rounded-lg shadow-md p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg shadow-md p-4 mt-4 border-2 border-secondary">
      <h2 className="text-lg font-poppins font-semibold text-primary text-center mb-4 pb-2 border-b border-primary/20">
        Best 3 Delivery Agents</h2>
      <ul className="space-y-4">
        {data.map((agent) => (
          <li key={agent.id} className="flex items-center p-4  relative pr-0 min-h-[80px] justify-between bg-card rounded-xl border border-primary/20  py-1">
            <div className="flex items-center gap-3 w-[70%]">
              <img
                src={agent.avatarUrl}
                alt={agent.name}
                className="h-12 w-12 rounded-full object-cover border border-border"
              />
              <div>
                <p className="text-secondary font-semibold">{agent.name}</p>
                <p className="text-xs text-muted font-semibold">Location: {agent.location}</p>
              </div>
            </div>
            <div className="text-center text-[10px] rounded-bl-[20px] font-semibold border bg-accent border-pink-100">
              <p className="text-xs text-secondary">Total Delivered Count</p>
              <p className="text-primary text-lg font-semibold">{agent.deliveredCount}+</p>
            </div>
            <span className='absolute bottom-0 right-2 text-[8px] text-muted'>As per {agent.updatedAt} record</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
