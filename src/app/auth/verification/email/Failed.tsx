"use client";

import React from "react";
import { Button, Result } from "antd";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";

// v1 has no public resend route: a new link comes from re-submitting the email
// on the account Email tab, which requires sign-in.
const VerifyEmailFailed: React.FC = () => {
  const { user } = useUser();

  return (
    <Result
      status="error"
      title="Verification Failed"
      className="p-0"
      subTitle="This verification link is invalid or has expired. To get a new one, sign in, open your account's Email tab, enter your email address as the New Email, add your password, and submit."
      extra={
        <Link href={user ? "/user/manage?tab=email" : "/auth/login"}>
          <Button type="primary" size="large" className="w-full mt-4">
            {user ? "Open Email settings" : "Go to Sign In"}
          </Button>
        </Link>
      }
    />
  );
};

export default VerifyEmailFailed;
