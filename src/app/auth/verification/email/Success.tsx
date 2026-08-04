"use client";

import React from "react";
import { Button, Result } from "antd";
import Link from "next/link";

const EmailVerificationSuccess: React.FC = () => (
  <Result
    status="success"
    title="Email Verified!"
    className="p-0"
    subTitle="Your email address has been successfully verified. You can now access your account."
    extra={
      <Link href="/auth/login">
        <Button type="primary" size="large" className="w-full mt-4">
          Continue to Sign In
        </Button>
      </Link>
    }
  />
);

export default EmailVerificationSuccess;