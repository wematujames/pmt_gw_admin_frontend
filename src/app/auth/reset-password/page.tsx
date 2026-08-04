"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LockOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { ResetPasswordData } from "@/types/types";
import { resetPassword } from "@/actions/auth";
import { AxiosError } from "axios";
import { Form, Input, Button, Divider, Card, Typography } from "antd";
import { useMessage } from "@/hooks/useMessage";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openMessage } = useMessage();
  const [form] = Form.useForm();

  const onFinish = useMutation({
    mutationKey: ["reset-user-password"],
    mutationFn: (data: ResetPasswordData) => {
      return resetPassword(
        searchParams.get("token") as string,
        data.newPassword
      );
    },
    onSuccess: (res: any) => {
      openMessage("success", res.data?.message || "Password reset successfully");
      router.push("/auth/login");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      openMessage("error", err.response?.data.message || err.message);
    },
  });

  return (
    <div className="w-full flex flex-col items-center">
      {/* Logo placed outside the card to match the layout */}
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
          <Typography.Title level={4} className="!m-0 text-gray-800">
            Reset Your Password
          </Typography.Title>
          <p className="text-gray-500 mt-1 mb-0">
            Please enter and confirm your new password below.
          </p>
        </div>

        <Divider className="my-6" />

        <Form
          form={form}
          name="reset_password"
          layout="vertical"
          onFinish={(values) => onFinish.mutate(values)}
        >
          <Form.Item
            name="newPassword"
            rules={[
              {
                required: true,
                message: "Please input your new password!",
              },
              {
                min: 6,
                message: "Password must be at least 6 characters long",
              }
            ]}
          >
            {/* Upgraded to Input.Password so the text is obscured */}
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
              {
                required: true,
                message: "Please confirm your new password!",
              },

              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="text-gray-400 mr-2" />}
              placeholder="Confirm Password"
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
              Reset Password
            </Button>
          </Form.Item>
        </Form>

        {/* Back to Sign In Link */}
        <div className="text-center mt-6">
          <Link
            href="/auth/login"
            className="text-gray-500 hover:text-[#142868] transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <ArrowLeftOutlined /> Back to Sign In
          </Link>
        </div>
      </Card>
    </div >
  );
}

// Suspense boundary kept intact for useSearchParams
export default function ResetPasswordPageSuspended() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}