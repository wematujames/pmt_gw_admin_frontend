"use client";

import React, { Suspense, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useMessage } from "@/hooks/useMessage";
import { AxiosError } from "axios";
import { verifyUserEmail } from "@/actions/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, Result, Spin, Button } from "antd";
import Image from "next/image";
import Link from "next/link";
import VerifyEmailFailed from "./Failed";
import EmailVerificationSuccess from "./Success";

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
        {verifyEmailMutation.isPending && (
          <div className="flex flex-col items-center justify-center py-10">
            <Spin size="large" />
            <p className="mt-6 text-gray-500 font-medium">Verifying your email...</p>
          </div>
        )}

        {verifyEmailMutation.isError && <VerifyEmailFailed />}

        {verifyEmailMutation.isSuccess && <EmailVerificationSuccess />}

        {/* Fallback if no token is present in the URL */}
        {!token && !verifyEmailMutation.isPending && (
          <Result
            status="warning"
            title="Invalid Link"
            subTitle="No verification token was found in the URL."
            extra={
              <Button type="primary" onClick={() => router.push("/auth/login")}>
                Go to Sign In
              </Button>
            }
          />
        )}
      </Card>
    </div>
  );
};

export default function VerifyEmailSuspended() {
  return (
    <Suspense>
      <VerifyEmail />
    </Suspense>
  );
}