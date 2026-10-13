"use client";
import { Card, Row, Col, Skeleton } from "antd";
import CountUp from "react-countup";
import { SummaryStats } from "@/types/types";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  BankOutlined,
  WalletOutlined
} from "@ant-design/icons";

const StatisticsCards = ({
  summaryStats,
  loading,
}: {
  summaryStats: SummaryStats | Record<string, never>;
  loading: boolean;
}) => {

  // We add custom icons and color schemes to each metric
  const metrics = [
    {
      title: "Collections Today",
      amount: summaryStats.colTodayAmt,
      count: summaryStats.colTodayCount,
      icon: <WalletOutlined className="text-emerald-600 text-xl" />,
      iconBg: "bg-emerald-100",
    },
    {
      title: "Total Collections",
      amount: summaryStats.colTotalAmt,
      count: summaryStats.colTotalCount,
      icon: <ArrowDownOutlined className="text-emerald-600 text-xl" />,
      iconBg: "bg-emerald-100",
    },
    {
      title: "Disbursements Today",
      amount: summaryStats.disTodayAmt,
      count: summaryStats.disTodayCount,
      icon: <BankOutlined className="text-blue-600 text-xl" />,
      iconBg: "bg-blue-100",
    },
    {
      title: "Total Disbursements",
      amount: summaryStats.disTotalAmt,
      count: summaryStats.disTotalCount,
      icon: <ArrowUpOutlined className="text-blue-600 text-xl" />,
      iconBg: "bg-blue-100",
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {metrics.map((metric, index) => (
        <Col xs={24} sm={12} md={8} lg={6} key={index}>
          <Card
            variant="borderless"
            className="shadow-sm hover:shadow-md transition-shadow duration-300 rounded-xl"
            styles={{ body: { padding: "20px" } }}
          >
            {loading ? (
              <Skeleton active paragraph={{ rows: 2 }} />
            ) : (
              <div className="flex flex-col h-full justify-between">

                {/* Top Row: Title and Icon */}
                <div className="flex justify-between items-start mb-4">
                  <div className="text-gray-500 font-medium text-sm">
                    {metric.title}
                  </div>
                  <div className={`p-2 rounded-lg ${metric.iconBg}`}>
                    {metric.icon}
                  </div>
                </div>

                {/* Bottom Row: Amount and Count */}
                <div>
                  <div className="text-2xl font-bold text-gray-800 flex items-baseline gap-1">
                    <span className="text-gray-400 text-lg font-medium">₵</span>
                    <CountUp
                      decimal="."
                      decimals={2}
                      end={Number(metric.amount) || 0}
                      separator=","
                      duration={1.5}
                    />
                  </div>

                  <div className="text-xs text-gray-400 mt-1 font-medium">
                    {metric.count || 0} Transactions
                  </div>
                </div>

              </div>
            )}
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StatisticsCards;