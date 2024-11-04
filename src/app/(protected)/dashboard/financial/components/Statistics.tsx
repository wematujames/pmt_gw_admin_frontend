"use client";
import { Card, Statistic, theme, Row, Col, Space } from "antd";
import CountUp from "react-countup";
import type { StatisticProps } from "antd";
import { SummaryStats } from "@/types/types";

const formatter: StatisticProps["formatter"] = (value) => (
  <CountUp decimal="." decimals={2} end={value as number} separator="," />
);

const StatisticsCards = ({
  summaryStats,
  loading,
}: {
  summaryStats: SummaryStats;
  loading: boolean;
}) => {
  const { token } = theme.useToken();

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Card>
          <Statistic
            loading={loading}
            formatter={formatter}
            title="Collections Today"
            value={summaryStats.colTodayAmt}
            prefix="₵"
          />
          <Space direction="vertical">
            <small>Count: {summaryStats.colTodayCount}</small>
          </Space>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Card>
          <Statistic
            loading={loading}
            formatter={formatter}
            title="Total Collections"
            value={summaryStats.colTotalAmt}
            prefix="₵"
          />
          <Space direction="vertical">
            <small>Count: {summaryStats.colTotalCount}</small>
          </Space>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Card>
          <Statistic
            loading={loading}
            formatter={formatter}
            title="Disbursements Today"
            value={summaryStats.disTodayAmt}
            prefix="₵"
          />
          <Space direction="vertical">
            <small>Count: {summaryStats.disTodayCount}</small>
          </Space>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Card>
          <Statistic
            loading={loading}
            formatter={formatter}
            title="Total Disbursements"
            value={summaryStats.disTotalAmt}
            prefix="₵"
          />
          <small>Count: {summaryStats.disTotalCount}</small>
        </Card>
      </Col>
    </Row>
  );
};

export default StatisticsCards;
