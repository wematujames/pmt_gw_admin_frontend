"use client";
import { NetworkCollectionStat } from "@/types/types";
import { Avatar, Skeleton } from "antd";

const logos: Record<string, string> = {
  "MTN-MoMo": "/mtnghlogo.jpg",
  "T-Cash": "/tcashlogo.jpg",
  "AT-Cash": "/atcashlogo.jpg",
};

export default function NetworkStats({
  stats,
  loading,
}: {
  stats: NetworkCollectionStat[];
  loading: boolean;
}) {

  if (loading) return <Skeleton active paragraph={{ rows: 2 }} />;
  if (!stats || stats.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {stats.map((netrk) => (
        <div
          key={netrk.network}
          className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100"
        >
          {/* Added fallback to empty string if logo isn't found */}
          <Avatar src={logos[netrk.network] || ""} size={48} className="shadow-sm bg-white" />

          <div className="flex flex-col">
            <span className="font-bold text-gray-800 text-sm">{netrk.network}</span>
            <span className="text-xs text-gray-500 font-medium">
              Today: ₵{Number(netrk.today || 0).toFixed(2)}
            </span>
            <span className="text-xs text-gray-500 font-medium">
              Total: ₵{Number(netrk.allTime || 0).toFixed(2)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}