import { useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Space,
  theme,
  Typography,
} from "antd";
import { FiFilter } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { getPlatformMerchants } from "@/actions/merchants";
import moment from "moment";

const { Option } = Select;

export default function FilterTransaction({
  txnsQuery,
  filter,
  setFilter,
  setPage,
  setTxns,
}: {
  txnsQuery: any;
  filter: any;
  setFilter: any;
  setPage: any;
  setTxns: any;
}) {
  const [open, setOpen] = useState(false);
  const { token } = theme.useToken();

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  const merchantIds = useQuery({
    queryKey: ["merchants-ids"],
    queryFn: () =>
      getPlatformMerchants({
        _select: "merchantId name",
      }),
  });

  const onFinish = async (formVals: any) => {
    onClose();

    const vals = Object.fromEntries(
      Object.entries(formVals).filter(([key, value]) => Boolean(value))
    );

    if (vals.dateTime) {
      vals.startDate = moment((vals as any).dateTime[0].$d)
        .startOf("day")
        .toISOString();

      vals.endDate = moment((vals as any).dateTime[1].$d)
        .endOf("day")
        .toISOString();
    }

    setFilter({ ...vals, dateTime: undefined });

    await new Promise((res) => setTimeout(() => res("done"), 1000));

    setTxns([]);

    setPage(0);

    txnsQuery.refetch(filter);
  };

  return (
    <>
      <Button
        type="primary"
        onClick={showDrawer}
        icon={<FiFilter />}
        title="Filter"
      >
        Filter
      </Button>
      <Drawer
        title={
          <Typography.Text
            style={{
              fontWeight: token.fontWeightStrong,
              color: token.colorPrimary,
              fontSize: token.fontSizeLG,
            }}
          >
            Filter Transactions
          </Typography.Text>
        }
        width={720}
        onClose={onClose}
        open={open}
      >
        <Form layout="vertical" requiredMark onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="_id" label="Transaction ID">
                <Input placeholder="6648574ee18c5235e783f834" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Account">
                <Input placeholder="233554268378" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="type" label="Type">
                <Select defaultActiveFirstOption defaultValue="">
                  <Option value="">All</Option>
                  <Option value="collection">Collection</Option>
                  <Option value="collection-dd">DD Collection</Option>
                  <Option value="disbursement-b2c">Disbursement</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Status">
                <Select defaultActiveFirstOption defaultValue="">
                  <Option value="">All</Option>
                  <Option value="successful">Successful</Option>
                  <Option value="pending">Pending</Option>
                  <Option value="failed">Failed</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="merchant" label="Merchant">
                <Select
                  listHeight={250}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={[
                    { label: "All", value: "" },
                    ...(merchantIds.data?.map((merc: any) => ({
                      label: merc.name,
                      value: merc._id,
                    })) || []),
                  ]}
                  defaultActiveFirstOption
                  defaultValue=""
                  loading={merchantIds.isPending}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="processorTerminalRef" label="External Txn ID">
                <Input placeholder="40733500385" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="dateTime"
                label="Created Between"
                rules={[{ required: true, message: "Select date range" }]}
              >
                <DatePicker.RangePicker
                  style={{ width: "100%" }}
                  getPopupContainer={(trigger) => trigger.parentElement!}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Form.Item>
              <Space>
                <Button onClick={onClose}>Cancel</Button>
                <Button htmlType="submit" type="primary">
                  Submit
                </Button>
              </Space>
            </Form.Item>
          </Row>
        </Form>
      </Drawer>
    </>
  );
}
