"use client";
import { FaStore } from "react-icons/fa6";
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
import { getPlatformMerchants } from "@/actions/merchants";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { getRecColor } from "@/utils/common";
import MerchantDetails from "./MerchantDetails";
import FilterMerchants from "./FilterMerchants";
import CreateMerchant from "./CreateMerchant";
import EditMerchantDropDown from "./EditMerchantDropDown";
import ReloadMerchants from "./ReloadMerchants";

export default function Merchants() {
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

  const merchantsQuery = useQuery({
    queryKey: ["platform-merchants", queryParams],
    queryFn: () => getPlatformMerchants(queryParams),
    staleTime: 60000,
  });

  const columns: TableColumnsType = [
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_: any, record: any) => (
        <Space size={5}>
          <EditMerchantDropDown merchant={record} />
          <MerchantDetails merchant={record} />
        </Space>
      ),
    },
    {
      title: "Merchant ID",
      dataIndex: "merchantId",
      key: "merchantId",
      render: (_: any, record: any) => (
        <Space orientation="vertical" size={0}>
          <Typography.Text style={{ fontWeight: token.fontWeightStrong }}>
            {record.merchantId}
          </Typography.Text>
          <span className="text-xs text-gray-500">{record._id}</span>
        </Space>
      ),
    },
    {
      title: "Account Name",
      dataIndex: "name",
      key: "name",
      render: (_: any, record: any) => (
        <Space orientation="vertical" size={0}>
          <Typography.Text style={{ fontWeight: token.fontWeightStrong }}>
            {record.name}
          </Typography.Text>
          <Space size={5}>
            <span
              className="text-xs font-medium"
              style={{ color: getRecColor(record.phoneVerified, token) }}
            >
              PV: {record.phoneVerified ? "Yes" : "No"}
            </span>
            <span
              className="text-xs font-medium"
              style={{ color: getRecColor(record.emailVerified, token) }}
            >
              EV: {record.emailVerified ? "Yes" : "No"}
            </span>
          </Space>
        </Space>
      ),
    },
    {
      title: "Contact",
      dataIndex: "phone",
      key: "phone",
      render: (_: any, record: any) => (
        <Space orientation="vertical" size={0}>
          <Typography.Text style={{ fontWeight: token.fontWeightStrong }}>
            {record.phone}
          </Typography.Text>
          <span className="text-xs text-gray-500">{record.email}</span>
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
          <Space orientation="vertical" size={2}>
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
      title: "Created By / Date",
      dataIndex: "createdBy",
      key: "createdBy",
      render: (_: any, record: any) => (
        <Space orientation="vertical" size={0}>
          <Typography.Text>{record.createdBy?.email || "N/A"}</Typography.Text>
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
        title="Merchants"
        description="View and manage platform merchants."
        icon={<FaStore className="text-2xl" />}
        rightActions={<CreateMerchant />}
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
                Total Records: {merchantsQuery.data?.meta?.total || 0}
              </h3>
            </div>
          </div>

          <Space>
            <FilterMerchants filter={queryParams} setFilter={setQueryParams} />
            <ReloadMerchants keys={["platform-merchants"]} />
          </Space>
        </div>

        <Table
          rowHoverable
          loading={merchantsQuery.isFetching}
          dataSource={merchantsQuery.data?.data || []}
          columns={columns}
          size="small"
          rowKey="_id"
          scroll={{ x: "max-content" }}
          onChange={handleTableChange}
          pagination={{
            current: queryParams._page,
            pageSize: queryParams._limit,
            total: merchantsQuery.data?.meta?.total || 0,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      </div>
    </div>
  );
}
