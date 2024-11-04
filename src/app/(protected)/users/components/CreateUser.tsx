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
import { CgUserAdd } from "react-icons/cg";
import { useMessage } from "@/hooks/useMessage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm } from "antd/es/form/Form";
import { createUser } from "@/actions/users";

const { Option } = Select;

export default function CreateUser({}: {}) {
  const [open, setOpen] = useState(false);
  const { openMessage } = useMessage();
  const queryClient = useQueryClient();
  const [form] = useForm();
  const { token } = theme.useToken();

  const createUserMutation = useMutation({
    mutationKey: ["create-new-user"],
    mutationFn: (data: any) => createUser(data),
    onSuccess: () => {
      openMessage("success", "User created");
      form.resetFields();
      setOpen(false);

      queryClient.invalidateQueries({
        queryKey: ["platform-users"],
      });
    },
    onError: (err: AxiosError<{ message: string }>) => {
      openMessage("error", err.response?.data.message || err.message);
    },
  });

  const onFinish = (formVals: any) => {
    createUserMutation.mutate(formVals);
  };

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)} icon={<CgUserAdd />}>
        Create
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
            Create User
          </Typography.Text>
        }
        width={720}
        onClose={() => setOpen(false)}
        open={open}
      >
        <Form layout="vertical" form={form} requiredMark onFinish={onFinish}>
          <Row gutter={5}>
            <Col span={12}>
              <Form.Item
                rules={[{ required: true, message: "First name is required" }]}
                name="fName"
                label="First Name"
              >
                <Input placeholder="Wematu" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                rules={[{ required: true, message: "Last name is required" }]}
                name="lName"
                label="Last Name"
              >
                <Input placeholder="James" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={5}>
            <Col span={12}>
              <Form.Item
                rules={[{ required: true, message: "Email is required" }]}
                name="email"
                label="Email"
              >
                <Input placeholder="jwematu@nerasolgh.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                rules={[
                  { required: true, message: "Mobile number is required" },
                ]}
                name="phone"
                label="Phone"
              >
                <Input placeholder="233554268378" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Form.Item>
              <Space>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
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
