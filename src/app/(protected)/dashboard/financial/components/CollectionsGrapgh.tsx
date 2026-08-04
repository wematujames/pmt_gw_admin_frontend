"use client";
import { Spin } from "antd";
import { Line } from "@ant-design/plots";
import NetworkStats from "./NetworkTnxStats";

import { FaMoneyBillTrendUp } from "react-icons/fa6";
import SectionHeader from "@/components/SectionHeader";

export default function CollectionsGrapgh({
  collectionsSummary,
  loading,
}: {
  loading: boolean;
  collectionsSummary: any;
}) {
  // Safe fallbacks
  const graphData = collectionsSummary?.graph || [];
  const networks = collectionsSummary?.networks || [];

  return (
    // Replaced <Card> with the unified Tailwind container
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

      <SectionHeader
        leadText="Collections Overview"
        subText="Based on data from the past 7 days"
        icon={<FaMoneyBillTrendUp />}
      />

      <NetworkStats stats={networks} loading={loading} />

      <div className="mt-6">
        <Line
          data={graphData}
          loadingTemplate={<Spin size="large" className="mt-10" />}
          loading={loading}
          height={250}
          xField="day"
          yField="total"
          colorField="#10B981"
          style={{ lineWidth: 3 }}
          interaction={{ tooltip: { marker: false } }}
          point={{ shapeField: "circle", sizeField: 4 }}
        />
      </div>
    </div>
  );
}