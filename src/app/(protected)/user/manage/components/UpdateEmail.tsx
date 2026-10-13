"use client";

import { updateUserEmail } from "@/actions/auth";
import { useMessage } from "@/hooks/useMessage";
import { useUser } from "@/hooks/useUser";
import { removeUndefinedValues } from "@/utils/common";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Col, Flex, Form, Input, Row, Space } from "antd";
import { AxiosError } from "axios";

function UpdateEmail() {
  const { openMessage } = useMessage();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { user } = useUser()

  const updateEmailMutation = useMutation({
    mutationKey: ["update-current-user-email"],
    mutationFn: (data: any) => updateUserEmail(data),
    onSuccess: async () => {
      openMessage("success", "Email updated, verification link sent");
      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
      form.resetFields();
      // Initial values may still hold the old user until the next render
      form.setFieldValue("currentEmail", queryClient.getQueryData<any>(["current-user"])?.email);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      openMessage("error", err.response?.data.message || err.message);
    },
  });

  const onFinish = (vals: any) => {
    const sanitized = removeUndefinedValues(vals);
    updateEmailMutation.mutate(sanitized);
  };

  return (
    <Flex justify="center" flex="vertical" content="center">
      <Form
        form={form}
        initialValues={{
          currentEmail: user?.email,
          newEmail: "",
          password: "",
        }}
        layout="vertical"
        requiredMark
        onFinish={onFinish}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Current Email">
              <Space.Compact block>
                <Form.Item name="currentEmail" noStyle>
                  <Input readOnly type="email" />
                </Form.Item>
                <Space.Addon>{"V: " + user?.emailVerified}</Space.Addon>
              </Space.Compact>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              rules={[{ required: true, message: "New email is required" }]}
              name="newEmail"
              label="New Email"
            >
              <Input type="email" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              rules={[{ required: true, message: "Password is required" }]}
              name="password"
              label="Password"
            >
              <Input.Password type="password" />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Form.Item>
            <Button htmlType="submit" type="primary">
              Submit
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </Flex>
  );
}

export default UpdateEmail;
