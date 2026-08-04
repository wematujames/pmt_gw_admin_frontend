"use client";

import { useState, useEffect } from "react";
import { Typography, Form, Input, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { login2fa, sendSmsOtp } from "@/actions/auth";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useMessage } from "@/hooks/useMessage";

export default function SmsVerification({
    loginToken,
    onBack,
}: {
    loginToken: string;
    onBack: () => void;
}) {
    const router = useRouter();
    const { openMessage } = useMessage();
    const [form] = Form.useForm();

    // Cooldown timer state
    const [countdown, setCountdown] = useState(120);
    const [canResend, setCanResend] = useState(false);

    // 1. Send SMS Mutation
    const sendSmsOtpM = useMutation({
        mutationKey: ["send-sms-otp"],
        mutationFn: () => sendSmsOtp(),
        onSuccess: () => openMessage("success", "OTP sent successfully"),
        onError: (err: AxiosError<{ message: string }>) => openMessage("error", err.response?.data.message || err.message),
    });

    // 2. Verify OTP Mutation
    const verifyMutation = useMutation({
        mutationKey: ["verify-2fa"],
        mutationFn: (data: { verificationCode: string }) => login2fa(data.verificationCode, loginToken, "sms"),
        onSuccess: () => {
            openMessage("success", "Verified successfully");
            router.push("/dashboard/financial");
        },
        onError: (err: AxiosError<{ message: string }>) => {
            openMessage("error", err.response?.data.message || err.message);
            form.setFields([{ name: "verificationCode", errors: ["Invalid verification code"] }]);
        },
    });

    // Automatically send SMS on mount
    useEffect(() => {
        sendSmsOtpM.mutate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle the countdown timer
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countdown > 0) {
            timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
        } else {
            setCanResend(true);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    const handleResend = () => {
        setCanResend(false);
        setCountdown(120);
        sendSmsOtpM.mutate();
    };

    return (
        <>
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={onBack} className="mb-2 -ml-4 text-gray-500 hover:text-gray-800">
                Back
            </Button>

            <div className="text-center mb-6">
                <Typography.Title level={4} className="!m-0 text-gray-800">
                    Enter SMS Code
                </Typography.Title>
                <p className="text-gray-500 mt-1 mb-0">
                    We&apos;ve sent a 6-digit code to your registered phone number.
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

            <div className="text-center mt-6">
                <span className="text-gray-500 text-sm">Didn&apos;t receive the code? </span>
                <Button
                    type="link"
                    className="p-0 text-[#142868]"
                    onClick={handleResend}
                    disabled={!canResend || sendSmsOtpM.isPending}
                >
                    {canResend ? "Resend SMS" : `Resend in ${countdown}s`}
                </Button>
            </div>
        </>
    );
}