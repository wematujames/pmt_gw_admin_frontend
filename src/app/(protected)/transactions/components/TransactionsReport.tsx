"use client";
import {
  Button,
  Flex,
  Space,
  Spin,
  Table,
  TableColumnsType,
  Tag,
  theme,
  Typography,
} from "antd";
import TransactionDetail from "./TransactionDetails";
import { useState } from "react";
import { MdNumbers } from "react-icons/md";
import { exportTransactions, getTransactions } from "@/actions/transactions";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import moment from "moment";
import { BiExport } from "react-icons/bi";
import { getRecColor } from "@/utils/common";
import { FiRefreshCw } from "react-icons/fi";
import FilterTransaction from "./FilterTransactions";

function TransactionReport() {
  const { token } = theme.useToken();
  const [exporting, setExporting] = useState(false);
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

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // "2024-08-01" //"2024-12-01"
  const [filter, setFilter] = useState({
    startDate: moment().startOf("day").toISOString(),
    endDate: moment().endOf("day").toISOString(),
  });

  const txnsQuery = useQuery({
    queryKey: ["transactions", pagination],
    queryFn: async () =>
      await getTransactions({
        pageParam: pagination.current,
        _limit: pagination.pageSize,
        filter,
      }),
    staleTime: 100000,
    placeholderData: keepPreviousData,
  });

  const handleTableChange = (newPagination: any) => {
    setPagination({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    } as any);
  };

  return (
    <Spin spinning={txnsQuery.isLoading}>
      <Table
        title={() => (
          <Flex justify="space-between">
            <Space style={{ fontSize: token.fontSizeHeading5 }}>
              <MdNumbers size={token.fontSizeIcon} />
              Total : {txnsQuery.data?.meta?.total}
            </Space>

            <Space>
              <FilterTransaction
                filter={filter}
                setFilter={setFilter}
                txnsQuery={txnsQuery}
              />
              <Button
                title="Export"
                icon={<BiExport />}
                type="primary"
                loading={exporting}
                onClick={() => exportTransactions(filter, setExporting)}
              >
                Export
              </Button>
              <Button
                title="Refresh"
                icon={<FiRefreshCw />}
                type="primary"
                onClick={() => txnsQuery.refetch()}
              >
                Refresh
              </Button>
            </Space>
          </Flex>
        )}
        loading={txnsQuery.isLoading}
        rowHoverable
        dataSource={txnsQuery.data?.data as any}
        columns={columns}
        size="small"
        rowKey="_id"
        onChange={handleTableChange}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: txnsQuery.data?.meta.total,
          onChange: (page, pageSize) =>
            setPagination({ current: page, pageSize } as any),
        }}
      />
    </Spin>
  );
}

export default TransactionReport;
