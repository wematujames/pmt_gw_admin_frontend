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
import { useEffect, useState } from "react";
import { MdNumbers } from "react-icons/md";
import { getTransactions } from "@/actions/transactions";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { BiExport } from "react-icons/bi";
import { getRecColor } from "@/utils/common";
import { FiRefreshCw } from "react-icons/fi";
import FilterTransaction from "./FilterTransactions";
import exportData from "@/utils/exportData";

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

  const [txns, setTxns] = useState([] as any[]);
  const [page, setPage] = useState(0);
  //"2024-08-01" //"2024-12-01"
  const [filter, setFilter] = useState({
    startDate: moment().startOf("day").toISOString(),
    endDate: moment().endOf("day").toISOString(),
  });

  const txnsQuery = useQuery({
    queryKey: ["transactions", page],
    queryFn: async () => {
      if (page === 0 || page === 1) setTxns([]);

      const res = await getTransactions({ pageParam: page, filter });

      if (page === 0 || page === 1) {
        setTxns(res.data);
      } else setTxns((prev) => [...prev, ...res.data]);

      return res;
    },
    // placeholderData: keepPreviousData,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (
        !txnsQuery.isFetching &&
        !txnsQuery.isPending &&
        txnsQuery.data?.meta?.pagination?.next?.page &&
        txns.length < txnsQuery.data?.meta.total
      ) {
        setPage(txnsQuery.data?.meta?.pagination?.next?.page);
      }
    }, 1500);

    return () => clearTimeout(timeout);
  }, [txnsQuery.data, txnsQuery.isPending, txnsQuery.isFetching]);

  return (
    <Table
      title={() => (
        <Flex justify="space-between">
          <Space style={{ fontSize: token.fontSizeHeading5 }}>
            <MdNumbers size={token.fontSizeIcon} />
            Count: {txns.length} / {txnsQuery.data?.meta.total}
          </Space>

          {txnsQuery.isFetching && "Loading"}

          <Space>
            <FilterTransaction
              filter={filter}
              setPage={setPage}
              setFilter={setFilter}
              txnsQuery={txnsQuery}
              setTxns={setTxns}
            />
            <Button
              icon={<BiExport />}
              type="primary"
              disabled={
                txnsQuery.isFetching ||
                !txns?.length ||
                txnsQuery.data?.meta?.pagination?.next?.page ||
                txns.length < txnsQuery.data?.meta.total
              }
              onClick={() => exportData(txns, "transactions")}
              title="Export"
            >
              Export
            </Button>
            <Button
              icon={<FiRefreshCw />}
              type="primary"
              disabled={
                txnsQuery.isFetching || txns.length < txnsQuery.data?.meta.total
              }
              onClick={() => {
                setPage(0);
                txnsQuery.refetch();
              }}
              title="Refresh"
            >
              Refresh
            </Button>
          </Space>
        </Flex>
      )}
      loading={page === 1 && txnsQuery.isLoading}
      rowHoverable
      scroll={{ x: "max-content", y: "57vh" }}
      pagination={false}
      dataSource={txns}
      columns={columns}
      size="small"
      rowKey="_id"
    />
  );
}

export default TransactionReport;
