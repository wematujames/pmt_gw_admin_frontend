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
import TransactionDetail from "./TransactionDetails";
import FilterTransaction from "./FilterTransactions";
import { useState } from "react";
import { MdNumbers } from "react-icons/md";
import { getTransactions } from "@/actions/transactions";
import { useInfiniteQuery } from "@tanstack/react-query";
import moment from "moment";
import exportData from "@/utils/exportData";
import { BiExport } from "react-icons/bi";
import { getRecColor } from "@/utils/common";
import { FiRefreshCw } from "react-icons/fi";

function TransactionReport() {
  const { token } = theme.useToken();

  const columns: TableColumnsType = [
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_: any, record: any) => (
        <Space>
          <TransactionDetail txn={record} />
        </Space>
      ),
    },
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      ellipsis: { showTitle: true },
      render: (_: any, record: any) => (
        <Space direction="vertical">
          <Typography.Text style={{ fontWeight: token.fontWeightStrong }}>
            {record._id}
          </Typography.Text>
          <small>{record.merchant?.merchantId}</small>
        </Space>
      ),
    },
    {
      title: "Amount ",
      dataIndex: "amount",
      key: "amount",
      render: (_: any, record: any) => (
        <Space direction="vertical">
          <Typography.Text style={{ fontWeight: token.fontWeightStrong }}>
            ₵ {parseFloat(record.amount).toFixed(2)}
          </Typography.Text>
          <small
            style={{
              color: getRecColor(record.status, token),
              fontWeight: token.fontWeightStrong,
            }}
          >
            {record.type}
          </small>
        </Space>
      ),
    },
    {
      title: "Account",
      dataIndex: "phone",
      key: "phone",
      render: (_: any, record: any) => (
        <Space direction="vertical">
          <Typography.Text style={{ fontWeight: token.fontWeightStrong }}>
            {record.phone}
          </Typography.Text>
          <small>
            {record.desc?.length > 12
              ? record.desc?.slice(0, 12) + "..."
              : record.desc}
          </small>
        </Space>
      ),
    },
    {
      title: "Network",
      dataIndex: "network",
      key: "network",
      render: (_: any, record: any) => (
        <Space direction="vertical">
          <Typography.Text style={{ fontWeight: token.fontWeightStrong }}>
            {record.network}
          </Typography.Text>
          <small>{record.processor}</small>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_: any, record: any) => (
        <Space direction="vertical">
          <Tag color={getRecColor(record.status, token)}>{record.status}</Tag>
          <small
            style={{
              color: getRecColor(record.status, token),
              fontWeight: token.fontWeightStrong,
            }}
          >
            {record.statusReason?.length > 15
              ? record.statusReason?.slice(0, 15) + "..."
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
        <Space direction="vertical">
          <Typography.Text>
            {record.processorTerminalRef || "N/A"}
          </Typography.Text>
          <small>
            {moment(record.createdAt).format("YYYY-MM-DD HH:mm:ss")}
          </small>
        </Space>
      ),
    },
  ];

  const [filter, setFilter] = useState({
    startDate: moment().startOf("day").toISOString(),
    endDate: moment().endOf("day").toISOString(),
  });

  const txnsQuery = useInfiniteQuery({
    queryKey: ["transactions", filter],
    queryFn: ({ pageParam = 1 }) => getTransactions({ pageParam, filter }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage?.meta?.pagination?.next?.page || false;
    },
  });

  const transactions = txnsQuery.data?.pages.flatMap((page) => page.data) || [];

  return (
    <Table
      title={() => (
        <Flex justify="space-between">
          <Space style={{ fontSize: token.fontSizeHeading5 }}>
            <MdNumbers size={token.fontSizeIcon} />
            Count: {transactions.length}
          </Space>
          <Space>
            <FilterTransaction
              filter={filter}
              setFilter={setFilter}
              txnsQuery={txnsQuery}
            />
            <Button
              icon={<BiExport />}
              type="primary"
              disabled={txnsQuery.isFetching || !transactions?.length}
              onClick={() => exportData(transactions, "transactions")}
              title="Export"
            >
              Export
            </Button>
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
      rowHoverable
      scroll={{ x: "max-content" }}
      dataSource={transactions}
      columns={columns}
      size="small"
      rowKey="_id"
    />
  );
}

export default TransactionReport;
