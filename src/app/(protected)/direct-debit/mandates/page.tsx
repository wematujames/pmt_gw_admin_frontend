"use client";
import { CiMoneyCheck1 } from "react-icons/ci";
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
import { getDirectDebitMandates } from "@/actions/directdebitmandate";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { getRecColor } from "@/utils/common";
import MandateDetail from "./DDebitMandateDetails";
import FilterDDebitMandates from "./FilterDDebitMandates";
import ReloadDirectDebitMandates from "./ReloadDirectDebitMandates";

export default function DirectDebitMandates() {
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

  const mandatesQuery = useQuery({
    queryKey: ["directdebit-mandates", queryParams],
    queryFn: () => getDirectDebitMandates(queryParams),
    staleTime: 60000,
  });

  const columns: TableColumnsType = [
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_: any, record: any) => <MandateDetail mandate={record} />,
    },
    {
      title: "ID / Ref",
      dataIndex: "_id",
      key: "_id",
      render: (_: any, record: any) => (
        <Space direction="vertical" size={0}>
          <Typography.Text style={{ fontWeight: token.fontWeightStrong }}>
            {record._id}
          </Typography.Text>
          <span className="text-xs text-gray-500">{record.merchantRef}</span>
          <span className="text-xs text-gray-500">{record.merchant?.merchantId}</span>
        </Space>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (_: any, record: any) => (
        <Typography.Text style={{ fontWeight: token.fontWeightStrong }}>
          ₵ {Number(record.amount || 0).toFixed(2)}
        </Typography.Text>
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
      title: "Frequency",
      dataIndex: "frequency",
      key: "frequency",
      render: (_: any, record: any) => (
        <Space direction="vertical" size={0}>
          <Typography.Text>{record.frequency}</Typography.Text>
          <span className="text-xs text-gray-500">
            NP: {dayjs(record.nextPaymentDate).format("YYYY-MM-DD")}
          </span>
          <span className="text-xs text-gray-500">
            EX: {dayjs(record.expiryDate).format("YYYY-MM-DD")}
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
      dataIndex: "active",
      key: "active",
      render: (_: any, record: any) => {
        const statusColor = getRecColor(
          record.statusReason === "pending" ? "pending" : record.active,
          token
        );

        return (
          <Space direction="vertical" size={2}>
            <Tag color={statusColor} className="m-0">
              {record.active ? "ACTIVE" : "INACTIVE"}
            </Tag>
            <span className="text-xs font-medium" style={{ color: statusColor }}>
              {record.statusReason?.length > 15
                ? record.statusReason.slice(0, 15) + "..."
                : record.statusReason}
            </span>
          </Space>
        );
      },
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
        title="Direct Debit Mandates"
        description="View and manage direct debit mandates."
        icon={<CiMoneyCheck1 className="text-2xl" />}
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
                Total Records: {mandatesQuery.data?.meta?.total || 0}
              </h3>
            </div>
          </div>

          <Space>
            <FilterDDebitMandates filter={queryParams} setFilter={setQueryParams} />
            <ReloadDirectDebitMandates keys={["directdebit-mandates"]} />
          </Space>
        </div>

        <Table
          rowHoverable
          loading={mandatesQuery.isFetching}
          dataSource={mandatesQuery.data?.data || []}
          columns={columns}
          size="small"
          rowKey="_id"
          scroll={{ x: "max-content" }}
          onChange={handleTableChange}
          pagination={{
            current: queryParams._page,
            pageSize: queryParams._limit,
            total: mandatesQuery.data?.meta?.total || 0,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      </div>
    </div>
  );
}
