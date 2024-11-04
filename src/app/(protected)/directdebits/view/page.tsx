"use client";
import React, { Suspense, useState } from "react";
import { Card, theme } from "antd";
import { useSearchParams } from "next/navigation";
import { Tabs } from "antd";
import { GrOverview } from "react-icons/gr";
import OverView from "../components/OverView";
import TransactionReport from "../components/DDebitMandatesReport";
import { TbReport } from "react-icons/tb";
import { useAuth } from "../../../../hooks/useAuth";
import { CiMoneyCheck1 } from "react-icons/ci";
import PageLoader from "../../PageLoader";
import SectionHeader from "../../../../components/SectionHeader";

const DirectDebitMandates: React.FC = () => {
  const authenticated = useAuth("nerasol");

  const { token } = theme.useToken();
  const searchParams = useSearchParams();
  const [activeTabKey, setActiveTabKey] = useState<string>(
    searchParams.get("tab") ? (searchParams.get("tab") as string) : "report"
  );

  const tabs = [
    {
      key: "overview",
      label: "Overview",
      children: <OverView />,
      icon: <GrOverview />,
    },
    {
      key: "report",
      label: "Report",
      children: <TransactionReport />,
      icon: <TbReport />,
    },
  ];

  const onTabChange = (key: string) => setActiveTabKey(key);

  if (!authenticated) return <PageLoader />;

  return (
    <Card
      tabProps={{ size: "large", centered: true }}
      activeTabKey={activeTabKey}
      onTabChange={onTabChange}
    >
      <SectionHeader
        leadText="Direct Debit Mandates"
        subText="View and manage direct debit mandates"
        icon={<CiMoneyCheck1 />}
      />
      <Tabs
        size="large"
        style={{ minHeight: "80vh" }}
        activeKey={activeTabKey}
        onTabClick={(key) => setActiveTabKey(key)}
        centered
        items={tabs}
      />
    </Card>
  );
};

export default function DirectDebitMandatesSuspended() {
  return (
    <Suspense>
      <DirectDebitMandates />
    </Suspense>
  );
}
