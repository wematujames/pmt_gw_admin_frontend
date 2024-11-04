"use client";
import { Line } from "@ant-design/plots";
import { Card, Spin, theme } from "antd";
import { BiMoneyWithdraw } from "react-icons/bi";
import NetworkStats from "./NetworkTnxStats";
import SectionHeader from "../../../../../components/SectionHeader";

export default function DisbursementsGrapgh({
  disbursmentsSummary,
  loading,
}: {
  loading: boolean;
  disbursmentsSummary: any;
}) {
  const { token } = theme.useToken();

  const graphData = disbursmentsSummary.graph || [];
  const networks = disbursmentsSummary.networks || [];

  return (
    <Card style={{ marginTop: token.marginMD }}>
      <SectionHeader
        leadText="Disbursements Overview"
        subText="Based on data from the past 7 days"
        icon={<BiMoneyWithdraw />}
      />

      <NetworkStats stats={networks} loading={loading} />

      <Line
        data={graphData}
        loading={loading}
        loadingTemplate={<Spin>Loading</Spin>}
        height={250}
        xField="day"
        yField="total"
        colorField={token["green-5"]}
        style={{ lineWidth: 2 }}
        interaction={{ tooltip: { marker: false } }}
        point={{ shapeField: "circle", sizeField: 4 }}
      />
    </Card>
  );
}
