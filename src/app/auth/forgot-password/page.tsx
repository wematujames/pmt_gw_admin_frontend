"use client";
import { Form, Input, Button, Flex, Divider, Card } from "antd";
import { MailOutlined } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { Typography } from "antd";
import styles from "./styles.module.css";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { forgotPassword } from "@/actions/auth";
import { ForgotPasswordData } from "@/types/types";
import { useMessage } from "@/hooks/useMessage";

const { Title } = Typography;

export default function LoginPage() {
  const { openMessage } = useMessage();

  const onFinish = useMutation({
    mutationKey: ["user-forgot-password"],
    mutationFn: (values: ForgotPasswordData) => forgotPassword(values.email),
    onSuccess: (res: AxiosResponse<{ message: string }>) => {
      openMessage("success", res.data.message);
    },
    onError: (err: AxiosError<{ message: string }>) => {
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
              <Title level={4}>Forgot Password</Title>
              <Divider style={{ marginTop: 10 }} />
            </Flex>

            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input
                prefix={<MailOutlined className="site-form-item-icon" />}
                placeholder="Email"
              />
            </Form.Item>
            <Form.Item>
              <Button
                style={{ width: "100%" }}
                type="primary"
                htmlType="submit"
              >
                Send Reset Link
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Flex>
    </Flex>
  );
}
