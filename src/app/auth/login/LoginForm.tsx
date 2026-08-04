"use client";

import { Typography, Divider, Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/actions/auth";
import { LoginCredentials } from "@/types/types";
import { AxiosError } from "axios";
import { useMessage } from "@/hooks/useMessage";
import { useRouter } from "next/navigation";

export default function LoginForm({ onSuccess }: { onSuccess: (res: any) => void }) {
    const router = useRouter();
    const { openMessage } = useMessage();

    const onFinishMutation = useMutation({
        mutationKey: ["login-user"],
        mutationFn: (credentials: LoginCredentials) => login(credentials.email, credentials.password),
        onSuccess: (res) => {
            if (res.mfa) {
                onSuccess(res);
                return;
            }
            openMessage("success", "Logged in successfully");
            router.push("/dashboard/financial");
        },
        onError: (err: AxiosError<{ message: string }>) => {
            openMessage("error", err.response?.data.message || err.message);
        },
    });

    return (
        <>
            <div className="text-center">
                <Typography.Title level={4} className="m-0! text-gray-800">
                    Sign In
                </Typography.Title>
                <p className="text-gray-500 mt-1 mb-0">Enter your credentials to access your account</p>
            </div>

            <Divider className="my-6" />

            <Form name="normal_login" layout="vertical" onFinish={(values) => onFinishMutation.mutate(values)}>
                <Form.Item name="email" rules={[{ required: true, type: "email", message: "Please input your Email!" }]}>
                    <Input size="large" prefix={<UserOutlined className="text-gray-400 mr-2" />} placeholder="Email address" />
                </Form.Item>

                <Form.Item name="password" rules={[{ required: true, message: "Please input your Password!" }]}>
                    <Input.Password size="large" prefix={<LockOutlined className="text-gray-400 mr-2" />} placeholder="Password" />
                </Form.Item>

                <div className="flex justify-between items-center mb-6">
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                    <a href="/auth/forgot-password" className="text-[#142868] hover:underline text-sm font-medium">
                        Forgot password?
                    </a>
                </div>

                <Form.Item className="m-0">
                    <Button size="large" type="primary" htmlType="submit" className="w-full" loading={onFinishMutation.isPending}>
                        Continue
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}