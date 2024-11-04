import React from "react";
import { Button, Result } from "antd";
import { useMutation } from "@tanstack/react-query";
import { resendEmailVeriLink } from "@/actions/auth";
import { AxiosError } from "axios";
import { useMessage } from "@/hooks/useMessage";

const VerifyEmailFailed: React.FC = () => {
  const { openMessage } = useMessage();

  const resendVerificationLink = useMutation({
    mutationKey: ["resend-verification-email-link"],
    mutationFn: () => resendEmailVeriLink(""),
    onError: (err: AxiosError<{ message: string }>) => {
      openMessage("error", err.response?.data.message || err.message);
    },
  });

  return (
    <Result
      status="error"
      title="Verification Failed"
      subTitle={
        <>
          <>The verification link may have expired</>
          <br />
          <>Please click the button below to send a new one.</>
        </>
      }
      extra={[
        <Button key="console" onClick={() => resendVerificationLink.mutate()}>
          Resend Verification Link
        </Button>,
      ]}
    />
  );
};

export default VerifyEmailFailed;
