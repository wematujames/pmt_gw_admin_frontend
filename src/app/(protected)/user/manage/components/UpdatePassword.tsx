"use client";

import { updatePassword } from "@/actions/auth";
import { useLogout } from "@/hooks/useLogout";
import { useMessage } from "@/hooks/useMessage";
import { removeUndefinedValues } from "@/utils/common";
import { useMutation } from "@tanstack/react-query";
import { Button, Col, Flex, Form, Input, Row } from "antd";
import { useForm } from "antd/es/form/Form";
import { AxiosError } from "axios";

function UpdatePassword() {
  const logout = useLogout("nerasol");
  const { openMessage } = useMessage();
  const [form] = useForm();

  const updateUserPassword = useMutation({
    mutationKey: ["update-current-user-password"],
    mutationFn: (data: any) =>
      updatePassword(
        data.currentPassword,
        data.newPassword,
        data.confirmNewPassword
      ),
    onSuccess: () => {
      form.resetFields();
      openMessage("success", "Password updated, please login");
      logout();
    },
    onError: (err: AxiosError<{ message: string }>) => {
      openMessage("error", err.response?.data.message || err.message);
    },
  });

  const onFinish = (vals: any) => {
    const sanitized = removeUndefinedValues(vals);

    if (sanitized.newPassword !== sanitized.confirmNewPassword) return;

    updateUserPassword.mutate(sanitized);
  };

  return (
    <Flex justify="center" flex="vertical" content="center">
      <Form form={form} layout="vertical" requiredMark onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              rules={[
                { required: true, message: "Current password is required" },
              ]}
              name="currentPassword"
              label="Current Password"
            >
              <Input.Password type="password" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              rules={[{ required: true, message: "New password is required" }]}
              name="newPassword"
              label="New Password"
            >
              <Input.Password type="password" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="confirmNewPassword"
              rules={[{ required: true, message: "Confirm new password" }]}
              label="Confirm New Password"
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

export default UpdatePassword;
