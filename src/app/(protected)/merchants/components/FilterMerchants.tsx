import { useState } from "react";
import {
  Button,
  Col,
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

const { Option } = Select;

export default function FilterTransaction({
  txnsQuery,
  filter,
  setFilter,
}: {
  txnsQuery: any;
  filter: any;
  setFilter: any;
}) {
  const [open, setOpen] = useState(false);
  const { token } = theme.useToken();
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onFinish = (formVals: any) => {
    onClose();

    const vals = Object.fromEntries(
      Object.entries(formVals).filter(([key, value]) => Boolean(value))
    );

    if (vals.dateTime) {
      vals.startDate = (vals as any).dateTime[0].$d;
      vals.endDate = (vals as any).dateTime[1].$d;
    }

    setFilter({ ...vals, dateTime: undefined });

    txnsQuery.refetch(filter);
  };

  return (
    <>
      <Button type="primary" onClick={showDrawer} icon={<FiFilter />}>
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
            Filter Merchants
          </Typography.Text>
        }
        width={720}
        onClose={onClose}
        open={open}
      >
        <Form layout="vertical" requiredMark onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="merchantId" label="Mandate ID">
                <Input placeholder="4kTEdyiARWhWIZrqNJGO" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Phone">
                <Input placeholder="233554268378" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="email" label="Email">
                <Input placeholder="merchant@nerasolgh.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="active" label="Status">
                <Select defaultActiveFirstOption defaultValue="">
                  <Option value="">All</Option>
                  <Option value="true">Active</Option>
                  <Option value="false">Inactive</Option>
                </Select>
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
