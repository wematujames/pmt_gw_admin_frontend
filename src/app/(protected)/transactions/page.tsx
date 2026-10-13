"use client";
import { AiOutlineTransaction } from "react-icons/ai";
import ModuleHeader from "@/components/layout/ModuleHeader";
import { useState } from "react";
import {
  Space,
  Table,
  TableColumnsType,
  Tag,
  theme,
  Typography
} from "antd";
import { MdNumbers } from "react-icons/md";
import { getTransactions } from "@/actions/transactions";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { getRecColor } from "@/utils/common";
import TransactionDetail from "./TransactionDetails";
import FilterTransaction from "./FilterTransactions";
import ExportTransactions from "./ExportTransactions";
import ReloadTransactions from "./ReloadTransactions";

export default function Transactions() {
  const { token } = theme.useToken();
  const [queryParams, setQueryParams] = useState<Record<string, any>>({
    _page: 1,
    _limit: 10,
  });

  const handleTableChange = (newPagination: any) => {
    setQueryParams((prev) => ({
      ...prev,
      _page: newPagination.current,
      _limit: newPagination.pageSize,
    }));
  };

  const txnsQuery = useQuery({
    queryKey: ["transactions", queryParams],
    queryFn: () => getTransactions(queryParams),
    staleTime: 60000,
  });

  const columns: TableColumnsType = [
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_: any, record: any) => <TransactionDetail txn={record} />,
    },
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      render: (_: any, record: any) => (
        <Space direction="vertical" size={0}>
          <Typography.Text style={{ fontWeight: token.fontWeightStrong }}>
            {record._id}
          </Typography.Text>
          <span className="text-xs text-gray-500">
            {record.merchant?.merchantId}
          </span>
        </Space>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (_: any, record: any) => (
        <Space direction="vertical" size={0}>
          <Typography.Text style={{ fontWeight: token.fontWeightStrong }}>
            ₵ {Number(record.amount || 0).toFixed(2)}
          </Typography.Text>
          <span
            className="text-xs font-medium"
            style={{ color: getRecColor(record.status, token) }}
          >
            {record.type}
          </span>
        </Space>
      ),
    },
    {
      title: "Account",
      dataIndex: "phone",
      key: "phone",
      render: (_: any, record: any) => (
        <Space direction="vertical" size={0}>
          <Typography.Text style={{ fontWeight: token.fontWeightStrong }}>
            {record.phone}
          </Typography.Text>
          <span className="text-xs text-gray-500">
            {record.desc?.length > 12 ? record.desc.slice(0, 12) + "..." : record.desc}
          </span>
        </Space>
      ),
    },
    {
      title: "Network",
      dataIndex: "network",
      key: "network",
      render: (_: any, record: any) => (
        <Space direction="vertical" size={0}>
          <Typography.Text style={{ fontWeight: token.fontWeightStrong }}>
            {record.network}
          </Typography.Text>
          <span className="text-xs text-gray-500">{record.processor}</span>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_: any, record: any) => (
        <Space direction="vertical" size={2}>
          <Tag color={getRecColor(record.status, token)} className="m-0">
            {record.status?.toUpperCase()}
          </Tag>
          <span
            className="text-xs font-medium"
            style={{ color: getRecColor(record.status, token) }}
          >
            {record.statusReason?.length > 15
              ? record.statusReason.slice(0, 15) + "..."
              : record.statusReason}
          </span>
        </Space>
      ),
    },
    {
      title: "External ID / Date",
      dataIndex: "processorTerminalRef",
      key: "processorTerminalRef",
      render: (_: any, record: any) => (
        <Space direction="vertical" size={0}>
          <Typography.Text>
            {record.processorTerminalRef || "N/A"}
          </Typography.Text>
          {/* Replaced moment with dayjs */}
          <span className="text-xs text-gray-500">
            {dayjs(record.createdAt).format("YYYY-MM-DD HH:mm:ss")}
          </span>
        </Space>
      ),
    },
  ];



  return (
    <div className="flex flex-col gap-6 w-full pb-10">

      <ModuleHeader
        title="Transactions"
        description="View all transactions and extract reports."
        icon={<AiOutlineTransaction className="text-2xl" />}
        rightActions={<ExportTransactions filter={queryParams} />}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 ">

        {/* Table Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3 p-3 pb-0">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-lg text-[#142868]">
              <MdNumbers size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold m-0 text-gray-800 tracking-tight">
                Total Records: {txnsQuery.data?.meta?.total || 0}
              </h3>
            </div>
          </div>

          <Space>
            <FilterTransaction filter={queryParams} setFilter={setQueryParams} />
            <ReloadTransactions keys={["transactions"]} />
          </Space>
        </div>

        <Table
          rowHoverable
          loading={txnsQuery.isFetching}
          dataSource={txnsQuery.data?.data || []}
          columns={columns}
          size="small"
          rowKey="_id"
          onChange={handleTableChange}
          pagination={{
            current: queryParams._page,
            pageSize: queryParams._limit,
            total: txnsQuery.data?.meta?.total || 0,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      </div>
    </div>
  );
}