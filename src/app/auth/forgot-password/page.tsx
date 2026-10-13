"use client";

import { Form, Input, Button, Divider, Card, Typography } from "antd";
import { MailOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { forgotPassword } from "@/actions/auth";
import { ForgotPasswordData } from "@/types/types";
import { useMessage } from "@/hooks/useMessage";

export default function ForgotPasswordPage() {
  const { openMessage } = useMessage();
  const [form] = Form.useForm();

  const onFinish = useMutation({
    mutationKey: ["user-forgot-password"],
    mutationFn: (values: ForgotPasswordData) => forgotPassword(values.email),
    onSuccess: (res: AxiosResponse<{ message: string }>) => {
      openMessage("success", res.data?.message || "Password reset link sent!");
      form.resetFields();
    },
    onError: (err: AxiosError<{ message: string }>) => {
      openMessage("error", err.response?.data.message || err.message);
    },
  });

  return (
    <div className="w-full flex flex-col items-center">
      {/* Logo placed outside the card to match the Login layout */}
      <div className="mb-8">
        <Link href="/">
          <Image
            src="/nerasollogo.png"
            alt="nerasol-logo"
            width={180}
            height={60}
            className="object-contain"
          />
        </Link>
      </div>

      <Card
        className="w-full max-w-md shadow-lg rounded-2xl border-none overflow-hidden"
        styles={{ body: { padding: "32px" } }}
      >
        <div className="text-center">
          <Typography.Title level={4} className="m-0! text-gray-800">
            Forgot Password
          </Typography.Title>
          <p className="text-gray-500 mt-1 mb-0">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        <Divider className="my-6" />

        <Form
          form={form}
          name="forgot_password"
          layout="vertical"
          onFinish={(values) => onFinish.mutate(values)}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email address!" }
            ]}
          >
            <Input
              size="large"
              prefix={<MailOutlined className="text-gray-400 mr-2" />}
              placeholder="Email address"
            />
          </Form.Item>

          <Form.Item className="mt-6 mb-0">
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={onFinish.isPending}
            >
              Send Reset Link
            </Button>
          </Form.Item>
        </Form>

        {/* Essential Back to Login Link */}
        <div className="text-center mt-6">
          <Link
            href="/auth/login"
            className="text-gray-500 hover:text-[#142868] transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <ArrowLeftOutlined /> Back to Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
}