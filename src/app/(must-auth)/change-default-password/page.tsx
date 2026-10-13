"use client";

import { updatePassword } from "@/actions/auth";
import { useLogout } from "@/hooks/useLogout";
import { useMessage } from "@/hooks/useMessage";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, Card, Typography, Divider } from "antd";
import { LockOutlined, KeyOutlined } from "@ant-design/icons";
import { AxiosError } from "axios";
import Image from "next/image";

interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export default function ChangeDefaultPassword() {
  const { logout } = useLogout();
  const { openMessage } = useMessage();
  const [form] = Form.useForm();

  const updateUserPassword = useMutation({
    mutationKey: ["update-current-user-password"],
    mutationFn: (data: PasswordUpdateData) =>
      updatePassword(
        data.currentPassword,
        data.newPassword,
        data.confirmNewPassword
      ),
    onSuccess: () => {
      form.resetFields();
      openMessage("success", "Password updated successfully. Please log in again.");
      logout();
    },
    onError: (err: AxiosError<{ message: string }>) => {
      openMessage("error", err.response?.data.message || err.message);
    },
  });

  const onFinish = (values: PasswordUpdateData) => {
    updateUserPassword.mutate(values);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Logo Placement */}
      <div className="mb-8">
        <Image
          src="/nerasollogo.png"
          alt="nerasol-logo"
          width={180}
          height={60}
          className="object-contain"
          priority
        />
      </div>

      <Card
        className="w-full max-w-md shadow-lg rounded-2xl border-none overflow-hidden bg-white"
        styles={{ body: { padding: "32px" } }}
      >
        <div className="text-center">
          <Typography.Title level={4} className="m-0! text-gray-800 tracking-tight">
            Update Default Password
          </Typography.Title>
          <p className="text-gray-500 mt-2 mb-0 text-sm">
            For your security, you must change the default password provided to you before accessing the platform.
          </p>
        </div>

        <Divider className="my-6" />

        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={onFinish}
        >
          <Form.Item
            name="currentPassword"
            rules={[{ required: true, message: "Current password is required" }]}
          >
            <Input.Password
              size="large"
              prefix={<KeyOutlined className="text-gray-400 mr-2" />}
              placeholder="Current Password"
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            rules={[
              { required: true, message: "New password is required" },
              { min: 6, message: "Password must be at least 6 characters" }
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="text-gray-400 mr-2" />}
              placeholder="New Password"
            />
          </Form.Item>

          <Form.Item
            name="confirmNewPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: "Please confirm your new password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The new passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="text-gray-400 mr-2" />}
              placeholder="Confirm New Password"
            />
          </Form.Item>

          <Form.Item className="mt-8 mb-0">
            <Button
              size="large"
              htmlType="submit"
              type="primary"
              className="w-full"
              loading={updateUserPassword.isPending}
            >
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}