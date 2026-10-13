"use client";
import { FaUserGroup } from "react-icons/fa6";
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
import { getPlatformUsers } from "@/actions/users";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { getRecColor } from "@/utils/common";
import UserDetail from "./UserDetails";
import FilterUsers from "./FilterUsers";
import CreateUser from "./CreateUser";
import UserActionDropDown from "./UserActionDropDown";
import ReloadUsers from "./ReloadUsers";

export default function Users() {
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

  const usersQuery = useQuery({
    queryKey: ["platform-users", queryParams],
    queryFn: () => getPlatformUsers(queryParams),
    staleTime: 60000,
  });

  const columns: TableColumnsType = [
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_: any, record: any) => (
        <Space size={5}>
          <UserActionDropDown merchant={record} />
          <UserDetail user={record} />
        </Space>
      ),
    },
    {
      title: "Name",
      dataIndex: "person",
      key: "person",
      render: (_: any, record: any) => (
        <Space direction="vertical" size={0}>
          <Typography.Text style={{ fontWeight: token.fontWeightStrong }}>
            {record.person?.title} {record.person?.fName} {record.person?.lName}
          </Typography.Text>
          <span className="text-xs text-gray-500">{record.email}</span>
        </Space>
      ),
    },
    {
      title: "Contact",
      dataIndex: "phone",
      key: "phone",
      render: (_: any, record: any) => (
        <Space direction="vertical" size={0}>
          <Typography.Text style={{ fontWeight: token.fontWeightStrong }}>
            {record.phone}
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
      title: "Status",
      dataIndex: "active",
      key: "active",
      render: (_: any, record: any) => (
        <Space direction="vertical" size={2}>
          <Tag color={getRecColor(record.active, token)} className="m-0">
            {record.active ? "ACTIVE" : "INACTIVE"}
          </Tag>
          <span className="text-xs text-gray-500">{record.role}</span>
        </Space>
      ),
    },
    {
      title: "Created By / Date",
      dataIndex: "createdBy",
      key: "createdBy",
      render: (_: any, record: any) => (
        <Space direction="vertical" size={0}>
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
        title="Users"
        description="View and manage platform users."
        icon={<FaUserGroup className="text-2xl" />}
        rightActions={<CreateUser />}
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
                Total Records: {usersQuery.data?.meta?.total || 0}
              </h3>
            </div>
          </div>

          <Space>
            <FilterUsers filter={queryParams} setFilter={setQueryParams} />
            <ReloadUsers keys={["platform-users"]} />
          </Space>
        </div>

        <Table
          rowHoverable
          loading={usersQuery.isFetching}
          dataSource={usersQuery.data?.data || []}
          columns={columns}
          size="small"
          rowKey="_id"
          scroll={{ x: "max-content" }}
          onChange={handleTableChange}
          pagination={{
            current: queryParams._page,
            pageSize: queryParams._limit,
            total: usersQuery.data?.meta?.total || 0,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      </div>
    </div>
  );
}
