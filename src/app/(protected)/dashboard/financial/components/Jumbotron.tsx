"use client";
import { Typography } from "antd";
import { BarChartOutlined } from "@ant-design/icons";

const Jumbotron = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all">

      {/* Left Side: Icon and Title */}
      <div className="flex items-center gap-4">
        {/* Decorative Brand Icon */}
        <div className="p-3 bg-blue-50 text-[#142868] rounded-lg hidden sm:block">
          <BarChartOutlined className="text-2xl" />
        </div>

        <div>
          <Typography.Title level={3} className="!m-0 text-gray-800 tracking-tight">
            Dashboard Overview
          </Typography.Title>
          <p className="text-gray-500 text-sm mt-1 mb-0 font-medium">
            Monitor your live financial collections and daily disbursements.
          </p>
        </div>
      </div>

      {/* Right Side: Page-Level Actions */}
      <div className="w-full sm:w-auto flex justify-end">
        {/* <Button
          type="primary"
          icon={<DownloadOutlined />}
          className="shadow-sm"
        >
          Export Report
        </Button> */}
      </div>
    </div>
  );
};

export default Jumbotron;