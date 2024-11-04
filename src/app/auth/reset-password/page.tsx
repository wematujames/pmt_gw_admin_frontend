"use client";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LockOutlined } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import styles from "./styles.module.css";
import { useMutation } from "@tanstack/react-query";
import { ResetPasswordData } from "@/types/types";
import { resetPassword } from "@/actions/auth";
import { AxiosError } from "axios";
import { Form, Input, Button, Flex, Divider, Card, Typography } from "antd";
import { useMessage } from "@/hooks/useMessage";

const { Title } = Typography;

function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openMessage } = useMessage();

  const onFinish = useMutation({
    mutationKey: ["reset-user-password"],
    mutationFn: (data: ResetPasswordData) => {
      return resetPassword(
        searchParams.get("token") as string,
        data.newPassword
      );
    },
    onSuccess: (res) => {
      openMessage("success", res.data.message);
      router.push("/auth/login");
    },
    onError: (err: AxiosError<Error>) => {
      openMessage("error", err.response?.data.message || err.message);
    },
  });

  return (
    <Flex
      className={styles.authLogin}
      justify="center"
      content="right"
      vertical
    >
      <Flex style={{ width: "100%" }} justify="center" align="center" vertical>
        <Link href="/">
          <Image
            src="/nerasollogo.png"
            alt="neraol-logo"
            width={180}
            height={80}
          />
        </Link>
      </Flex>
      <Flex style={{ width: "100%" }} justify="center" align="center" vertical>
        <Card className={styles.loginForm}>
          <Form
            name="normal_login"
            initialValues={{ remember: true }}
            onFinish={(values) => onFinish.mutate(values)}
          >
            <Flex
              style={{ width: "100%" }}
              justify="center"
              align="center"
              vertical
            >
              <Title level={4}>Reset Your Password</Title>
              <Divider style={{ marginTop: 10 }} />
            </Flex>

            <Form.Item
              name="newPassword"
              rules={[
                {
                  required: true,
                  message: "Please input your new password!",
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="New Password"
              />
            </Form.Item>
            <Form.Item
              name="confirmNewPassword"
              rules={[
                {
                  required: true,
                  message: "Please confirm your new password!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Confirm Password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                style={{ width: "100%" }}
                type="primary"
                htmlType="submit"
              >
                Reset Password
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Flex>
    </Flex>
  );
}

export default function ResetPasswordPageSuspended() {
  return (
    <Suspense>
      <ResetPasswordPage />
    </Suspense>
  );
}
