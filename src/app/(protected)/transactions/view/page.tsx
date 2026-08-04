"use client";
import { Typography, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { AiOutlineTransaction } from "react-icons/ai";
import TransactionReport from "../components/TransactionsReport";

export default function Transactions() {
  return (
    // Added a flex column wrapper to handle spacing between the header and the report
    <div className="flex flex-col gap-6 w-full pb-10">

      {/* 1. The Page Header (Jumbotron Style) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all">

        {/* Left Side: Icon and Title */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-[#142868] rounded-lg hidden sm:block">
            <AiOutlineTransaction className="text-2xl" />
          </div>

          <div>
            <Typography.Title level={3} className="!m-0 text-gray-800 tracking-tight">
              Transactions
            </Typography.Title>
            <p className="text-gray-500 text-sm mt-1 mb-0 font-medium">
              View all transactions and extract reports.
            </p>
          </div>
        </div>

        {/* Right Side: Page-Level Actions */}
        <div className="w-full sm:w-auto flex justify-end">
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            className="shadow-sm"
          >
            Export CSV
          </Button>
        </div>

      </div>

      {/* 2. The Main Report Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[70vh]">
        <TransactionReport />
      </div>

    </div>
  );
}