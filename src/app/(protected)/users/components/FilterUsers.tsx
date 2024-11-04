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

const { Option } = Select;

export default function FilterUsers({
  usersQuery,
  filter,
  setFilter,
}: {
  usersQuery: any;
  filter: any;
  setFilter: any;
}) {
  const [open, setOpen] = useState(false);
  // const [filter, setFilter] = useState({});
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

    usersQuery.refetch(filter);
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
            Filter Users
          </Typography.Text>
        }
        width={720}
        onClose={onClose}
        open={open}
      >
        <Form layout="vertical" requiredMark onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="email" label="Email">
                <Input placeholder="jwematu@nerasolgh.com" />
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
              <Form.Item name="type" label="Role">
                <Select defaultActiveFirstOption defaultValue="">
                  <Option value="">All</Option>
                </Select>
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
            <Col span={24}>
              <Form.Item name="dateTime" label="Created Between">
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
