"use client";
import {
  Button,
  Flex,
  Space,
  Table,
  TableColumnsType,
  Tag,
  theme,
  Typography,
} from "antd";
import TransactionDetail from "./MerchantDetails";
import FilterMerchants from "./FilterMerchants";
import { useState } from "react";
import { MdNumbers } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { getPlatformMerchants } from "@/actions/merchants";
import { getRecColor } from "@/utils/common";
import { FiRefreshCw } from "react-icons/fi";
import CreateMerchant from "./CreateMerchant";
import EditMerchantDropDown from "./EditMerchantDropDown";

function MerchantsReport() {
  const { token } = theme.useToken();
  const [filter, setFilter] = useState({});

  const txnsQuery = useQuery({
    queryKey: ["platform-merchants", filter],
    queryFn: () => getPlatformMerchants(filter),
  });

  const columns: TableColumnsType = [
    {
      title: "Action",
      key: "action",
      width: 80,
      align: "center",
      render: (_: any, record: any) => (
        <Space size={5}>
          <EditMerchantDropDown merchant={record} />
          <TransactionDetail merchant={record} />
        </Space>
      ),
    },
    {
      title: "Merchant ID",
      dataIndex: "_id",
      key: "_id",
      ellipsis: { showTitle: true },
      render: (_: any, record: any) => (
        <Space size={0} direction="vertical">
          <Typography.Text style={{ fontWeight: token.fontWeightStrong }}>
            {record.merchantId}
          </Typography.Text>
          <small>{record._id}</small>
        </Space>
      ),
    },
    {
      title: "Account Name",
      dataIndex: "name",
      key: "name",
      render: (_: any, record: any) => (
        <Space size={0} direction="vertical">
          <Typography.Text>{record.name}</Typography.Text>
          <Space size={5} direction="horizontal">
            <small style={{ color: getRecColor(record.phoneVerified, token) }}>
              PV: {record.phoneVerified ? "Yes   " : "No   "}
            </small>
            <small style={{ color: getRecColor(record.emailVerified, token) }}>
              EV: {record.emailVerified ? "Yes" : "No"}
            </small>
          </Space>
        </Space>
      ),
    },
    {
      title: "Contact",
      dataIndex: "phone",
      key: "phone",
      render: (_: any, record: any) => (
        <Space size={0} direction="vertical">
          <p>{record.phone}</p>
          <small>{record.email}</small>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "active",
      render: (_: any, record: any) => (
        <Space size={0} direction="vertical">
          <Tag
            color={getRecColor(
              record.statusReason === "pending" ? "pending" : record.active,
              token
            )}
          >
            {record.active ? "Active" : "Inactive"}
          </Tag>
          <small
            style={{
              color: getRecColor(
                record.statusReason === "pending" ? "pending" : record.active,
                token
              ),
            }}
          >
            {record.statusReason?.length > 10
              ? record.statusReason?.slice(0, 10) + "..."
              : record.statusReason}
          </small>
        </Space>
      ),
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
      render: (_: any, record: any) => (
        <Space size={0} direction="vertical">
          <p>{record.createdBy?.email}</p>
          <small>
            {moment(record.createdAt).format("YYYY-MM-DD HH:mm:ss")}
          </small>
        </Space>
      ),
    },
  ];

  return (
    <Table
      title={() => (
        <Flex justify="space-between">
          <Space
            style={{
              fontSize: token.fontSizeHeading5,
            }}
          >
            <MdNumbers size={token.fontSizeIcon} />
            Count:{txnsQuery?.data?.length}
          </Space>
          <Space>
            <FilterMerchants
              filter={filter}
              setFilter={setFilter}
              txnsQuery={txnsQuery}
            />
            <CreateMerchant />
            <Button
              icon={<FiRefreshCw />}
              type="primary"
              disabled={txnsQuery.isFetching}
              onClick={() => txnsQuery.refetch()}
              title="Refresh"
            >
              Refresh
            </Button>
          </Space>
        </Flex>
      )}
      loading={txnsQuery.isLoading}
      sticky
      size="small"
      rowHoverable
      scroll={{ x: "max-content" }}
      dataSource={txnsQuery.data}
      columns={columns}
    />
  );
}

export default MerchantsReport;
