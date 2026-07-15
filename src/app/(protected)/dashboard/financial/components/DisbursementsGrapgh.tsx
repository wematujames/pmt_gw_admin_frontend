"use client";
import { Line } from "@ant-design/plots";
import { Spin } from "antd";
import { BiMoneyWithdraw } from "react-icons/bi";
import NetworkStats from "./NetworkTnxStats";
import SectionHeader from "../../../../../components/SectionHeader";

export default function DisbursementsGraph({
  disbursementsSummary, // Fixed spelling prop
  loading,
}: {
  loading: boolean;
  disbursementsSummary: any;
}) {
  // Safe fallbacks
  const graphData = disbursementsSummary?.graph || [];
  const networks = disbursementsSummary?.networks || [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

      {/* 1. Unified Header */}
      <SectionHeader
        leadText="Disbursements Overview"
        subText="Based on data from the past 7 days"
        icon={<BiMoneyWithdraw />}
      />

      {/* 2. Unified Network Stats Pill Grid */}
      <NetworkStats stats={networks} loading={loading} />

      {/* 3. The Graph */}
      <div className="mt-6">
        <Line
          data={graphData}
          loading={loading}
          loadingTemplate={<Spin size="large" className="mt-10" />}
          height={250}
          xField="day"
          yField="total"
          // Changed from green-5 to your primary brand color to differentiate from Collections
          colorField="#142868"
          style={{ lineWidth: 3 }}
          interaction={{ tooltip: { marker: false } }}
          point={{ shapeField: "circle", sizeField: 4 }}
        />
      </div>

    </div>
  );
}