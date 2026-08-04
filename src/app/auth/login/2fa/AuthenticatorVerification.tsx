"use client";

import { Typography, Form, Input, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { login2fa } from "@/actions/auth";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useMessage } from "@/hooks/useMessage";

export default function AuthenticatorVerification({
    loginToken,
    onBack,
}: {
    loginToken: string;
    onBack: () => void;
}) {
    const router = useRouter();
    const { openMessage } = useMessage();
    const [form] = Form.useForm();

    const verifyMutation = useMutation({
        mutationKey: ["verify-2fa-auth"],
        mutationFn: (data: { verificationCode: string }) => login2fa(data.verificationCode, loginToken, "authenticator"),
        onSuccess: () => {
            openMessage("success", "Verified successfully");
            router.push("/dashboard/financial");
        },
        onError: (err: AxiosError<{ message: string }>) => {
            openMessage("error", err.response?.data.message || err.message);
            form.setFields([{ name: "verificationCode", errors: ["Invalid verification code"] }]);
        },
    });

    return (
        <>
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={onBack} className="mb-2 -ml-4 text-gray-500 hover:text-gray-800">
                Back
            </Button>

            <div className="text-center mb-6">
                <Typography.Title level={4} className="!m-0 text-gray-800">
                    Authenticator App
                </Typography.Title>
                <p className="text-gray-500 mt-1 mb-0">
                    Enter the 6-digit code from your Authenticator app.
                </p>
            </div>

            <Form form={form} layout="vertical" onFinish={(values) => verifyMutation.mutate(values)}>
                <Form.Item
                    name="verificationCode"
                    className="flex justify-center mb-8"
                    rules={[
                        { required: true, message: "Code is required" },
                        { len: 6, message: "Code must be exactly 6 digits" },
                    ]}
                >
                    <Input.OTP length={6} size="large" autoFocus />
                </Form.Item>

                <Form.Item className="m-0">
                    <Button size="large" type="primary" htmlType="submit" className="w-full" loading={verifyMutation.isPending}>
                        Verify & Proceed
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}