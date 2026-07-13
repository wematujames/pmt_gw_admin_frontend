"use client";
import React, { useState } from "react";
import { Card } from "antd";
import { Tabs } from "antd";
import { GrOverview } from "react-icons/gr";
import OverView from "../components/OverView";
import TransactionReport from "../components/UsersReport";
import { TbReport } from "react-icons/tb";
import SectionHeader from "../../../../components/SectionHeader";
import { FaUserGroup } from "react-icons/fa6";

const App: React.FC = () => {
  const [activeTabKey, setActiveTabKey] = useState<string>("report");

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

  return (
    <Card
      tabProps={{ size: "large", centered: true }}
      activeTabKey={activeTabKey}
      onTabChange={onTabChange}
    >
      <SectionHeader
        leadText="Users"
        subText="View users and extract reports"
        icon={<FaUserGroup />}
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

export default App;
