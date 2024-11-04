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
import { useMessage } from "@/hooks/useMessage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm } from "antd/es/form/Form";
import { MdOutlineAddBusiness } from "react-icons/md";
import { createMerchant } from "@/actions/merchants";

const { Option } = Select;

export default function CreateMerchant({}: {}) {
  const [open, setOpen] = useState(false);
  const { openMessage } = useMessage();
  const queryClient = useQueryClient();
  const [form] = useForm();
  const { token } = theme.useToken();

  const createMerchantMutation = useMutation({
    mutationKey: ["create-new-merchant"],
    mutationFn: (data: any) => createMerchant(data),
    onSuccess: () => {
      openMessage("success", "Merchant created");
      form.resetFields();
      setOpen(false);

      queryClient.invalidateQueries({
        queryKey: ["platform-merchants"],
      });
    },
    onError: (err: AxiosError<{ message: string }>) => {
      openMessage("error", err.response?.data.message || err.message);
    },
  });

  const onFinish = (formVals: any) => {
    createMerchantMutation.mutate(formVals);
  };

  return (
    <>
      <Button
        type="primary"
        onClick={() => setOpen(true)}
        icon={<MdOutlineAddBusiness />}
      >
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
            Create Merchant
          </Typography.Text>
        }
        width={600}
        onClose={() => setOpen(false)}
        open={open}
      >
        <Form layout="vertical" form={form} requiredMark onFinish={onFinish}>
          <Row gutter={5}>
            <Col span={24}>
              <Form.Item
                rules={[
                  { required: true, message: "Merchant name is required" },
                ]}
                name="name"
                label="Merchant Name"
              >
                <Input placeholder="Nerasol Ghana Limited" />
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
                  Create
                </Button>
              </Space>
            </Form.Item>
          </Row>
        </Form>
      </Drawer>
    </>
  );
}
