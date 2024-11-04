"use client";

import { useRouter } from "next/navigation";
import { Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/actions/auth";
import { LoginCredentials } from "@/types/types";
import { AxiosError } from "axios";
import { useState } from "react";
import AdminTwoFAModal from "./AdminTwoFAModal";
import { useMessage } from "@/hooks/useMessage";

export default function LoginPage() {
  const router = useRouter();
  const { openMessage } = useMessage();
  const [loginToken, setLoginToken] = useState("null");
  const [open2faModal, setOpen2faModal] = useState(false);

  const onFinish = useMutation({
    mutationKey: ["login-user"],
    mutationFn: (credentials: LoginCredentials) =>
      login(credentials.email, credentials.password),
    onSuccess: (res) => {
      if (res.multiFAEnabled) {
        setOpen2faModal(true);
        setLoginToken(res.loginToken);
        return;
      }

      openMessage("success", "Logged in");
      router.push("/dashboard/financial");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      openMessage("error", err.response?.data.message || err.message);
    },
  });

  return (
    <>
      <AdminTwoFAModal
        loginToken={loginToken}
        open={open2faModal}
        setOpen={setOpen2faModal}
      />
      <Form
        name="normal_login"
        initialValues={{ remember: true }}
        onFinish={(values) => onFinish.mutate(values)}
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <a href="/auth/forgot-password" style={{ float: "right" }}>
            Forgot password
          </a>
        </Form.Item>
        <Form.Item>
          <Button style={{ width: "100%" }} type="primary" htmlType="submit">
            Log in
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
