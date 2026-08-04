"use client";

import React, { useState } from "react";
import { Button, Result, Input } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { resendEmailVeriLink } from "@/actions/auth";
import { AxiosError } from "axios";
import { useMessage } from "@/hooks/useMessage";

const VerifyEmailFailed: React.FC = () => {
  const { openMessage } = useMessage();
  const [email, setEmail] = useState("");

  const resendVerificationLink = useMutation({
    mutationKey: ["resend-verification-email-link"],
    mutationFn: (emailAddress: string) => resendEmailVeriLink(emailAddress),
    onSuccess: () => {
      openMessage("success", "A new verification link has been sent!");
      setEmail("");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      openMessage("error", err.response?.data.message || err.message);
    },
  });

  return (
    <Result
      status="error"
      title="Verification Failed"
      className="p-0"
      subTitle="The verification link may have expired or is invalid. Please enter your email to receive a new one."
      extra={
        <div className="flex flex-col gap-4 mt-4">
          <Input
            size="large"
            placeholder="Enter your email address"
            prefix={<MailOutlined className="text-gray-400 mr-2" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="primary"
            size="large"
            className="w-full"
            loading={resendVerificationLink.isPending}
            disabled={!email}
            onClick={() => resendVerificationLink.mutate(email)}
          >
            Resend Verification Link
          </Button>
        </div>
      }
    />
  );
};

export default VerifyEmailFailed;