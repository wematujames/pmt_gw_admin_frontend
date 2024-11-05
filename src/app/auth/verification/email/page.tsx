"use client";

import React, { Suspense, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useMessage } from "@/hooks/useMessage";
import { AxiosError } from "axios";
import { verifyUserEmail } from "@/actions/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Result } from "antd";
import VerifyEmailFailed from "./Failed";
import EmailVerificationSuccess from "./Success";
import styles from "../../../utility.module.css";
const VerifyEmail: React.FC = () => {
  const { openMessage } = useMessage();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const verifyEmailMutation = useMutation({
    mutationKey: ["verify-email"],
    mutationFn: () => verifyUserEmail(token as string),
    onError: (err: AxiosError<{ message: string }>) => {
      openMessage("error", err.response?.data.message || err.message);
    },
  });

  useEffect(() => {
    if (token) {
      verifyEmailMutation.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (verifyEmailMutation.isPending) {
    return <>Verifying Email...Please wait</>;
  }

  if (verifyEmailMutation.isError) return <VerifyEmailFailed />;

  if (verifyEmailMutation.isSuccess) return <EmailVerificationSuccess />;

  return (
    <Result
      className={styles.fscontainer}
      status="warning"
      title="Sorry, there was a problem."
      extra={
        <Button key="console" onClick={router.refresh}>
          Try Again
        </Button>
      }
    />
  );
};

export default function VerifyEmailSuspended() {
  return (
    <Suspense>
      <VerifyEmail />
    </Suspense>
  );
}
