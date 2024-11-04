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
import TransactionDetail from "./DDebitMandateDetails";
import FilterTransaction from "./FilterDDebitMandates";
import { useState } from "react";
import { MdNumbers } from "react-icons/md";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { getDirectDebitMandates } from "@/actions/directdebitmandate";
import moment from "moment";
import { FiRefreshCw } from "react-icons/fi";
import { getRecColor } from "@/utils/common";

function TransactionReport() {
  const { token } = theme.useToken();
  const [filter, setFilter] = useState({});
  const queryClient = new QueryClient();

  const mandatesQuery = useQuery({
    queryKey: ["ddebit-mandates-report", filter],
    queryFn: () => getDirectDebitMandates(filter),
  });

  const columns: TableColumnsType = [
    {
      title: "Action",
      key: "action",
      width: 80,
      align: "center",
      render: (_: any, record: any) => (
        <Space size={0}>
          <TransactionDetail mandate={record} />
        </Space>
      ),
    },
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      ellipsis: { showTitle: true },
      render: (_: any, record: any) => (
        <Space size={0} direction="vertical">
          <Typography.Text style={{ fontWeight: token.fontWeightStrong }}>
            {record._id}
          </Typography.Text>
          <small>{record.merchantRef}</small>
          <small>{record.merchant?.merchantId}</small>
        </Space>
      ),
    },
    {
      title: "Amount ",
      dataIndex: "amount",
      key: "amount",
      width: 120,
      render: (_: any, record: any) => (
        <Space size={0} direction="vertical">
          <Typography.Text style={{ fontWeight: token.fontWeightStrong }}>
            ₵ {parseFloat(record.amount).toFixed(2)}
          </Typography.Text>
        </Space>
      ),
    },
    {
      title: "Account",
      dataIndex: "phone",
      key: "phone",
      render: (_: any, record: any) => (
        <Space size={0} direction="vertical">
          <Typography.Text style={{ fontWeight: token.fontWeightStrong }}>
            {record.phone}
          </Typography.Text>
          <small
            style={{
              color: getRecColor(
                record.statusReason === "pending" ? "pending" : record.active,
                token
              ),
            }}
          >
            {record.desc?.length > 10
              ? record.desc?.slice(0, 10) + "..."
              : record.desc}
          </small>
        </Space>
      ),
    },
    {
      title: "Frequency",
      dataIndex: "frequency",
      key: "frequency",
      render: (_: any, record: any) => (
        <Space size={0} direction="vertical">
          <p>{record.frequency}</p>
          <small>
            NP: {moment(record.nextPaymentDate).format("YYYY-MM-DD")}
          </small>
          <small>EX: {moment(record.expiryDate).format("YYYY-MM-DD")}</small>
        </Space>
      ),
    },
    {
      title: "Network",
      dataIndex: "network",
      key: "network",
      width: 120,
      render: (_: any, record: any) => (
        <Space size={0} direction="vertical">
          <p>{record.network}</p>
          <small>{record.processor}</small>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
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
      title: "ExternId",
      dataIndex: "processorTerminalRef",
      key: "processorTerminalRef",
      render: (_: any, record: any) => (
        <Space size={0} direction="vertical">
          <p>{record.processorTerminalRef || "N/A"}</p>
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
            Count:{mandatesQuery?.data?.length}
          </Space>
          <Space>
            <FilterTransaction
              filter={filter}
              setFilter={setFilter}
              mandatesQuery={mandatesQuery}
            />
            <Button
              icon={<FiRefreshCw />}
              type="primary"
              disabled={mandatesQuery.isFetching}
              onClick={() => mandatesQuery.refetch()}
              title="Refresh"
            >
              Refresh
            </Button>
          </Space>
        </Flex>
      )}
      loading={mandatesQuery.isLoading}
      sticky
      size="small"
      rowHoverable
      scroll={{ x: "max-content" }}
      dataSource={mandatesQuery.data}
      columns={columns}
    />
  );
}

export default TransactionReport;
