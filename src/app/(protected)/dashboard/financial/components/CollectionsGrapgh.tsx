"use client";
import { Card, Spin, theme } from "antd";
import { Line } from "@ant-design/plots";
import NetworkStats from "./NetworkTnxStats";
import SectionHeader from "../../../../../components/SectionHeader";
import { FaMoneyBillTrendUp } from "react-icons/fa6";

export default function CollectionsGrapgh({
  collectionsSummary,
  loading,
}: {
  loading: boolean;
  collectionsSummary: any;
}) {
  const { token } = theme.useToken();

  const graphData = collectionsSummary?.graph || [];
  const networks = collectionsSummary?.networks || [];

  return (
    <Card style={{ marginTop: token.marginMD }}>
      <SectionHeader
        leadText="Collections Overview"
        subText="Based on data from the past 7 days"
        icon={<FaMoneyBillTrendUp />}
      />

      <NetworkStats stats={networks} loading={loading} />

      <Line
        data={graphData}
        loadingTemplate={<Spin>Loading</Spin>}
        loading={loading}
        height={250}
        xField="day"
        yField="total"
        colorField={token["green-5"]}
        style={{ lineWidth: 2 }}
        interaction={{ tooltip: { marker: false } }}
        point={{ shapeField: "circle", sizeField: 3 }}
      />
    </Card>
  );
}
