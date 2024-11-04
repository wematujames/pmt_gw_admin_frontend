import React from "react";
import { Button, Result } from "antd";

const EmailVerificationSuccess: React.FC = () => (
  <Result
    status="success"
    title="Email verification successful"
    subTitle=""
    extra={
      <Button type="primary" key="console" href="/auth/login">
        Go To Home
      </Button>
    }
  />
);

export default EmailVerificationSuccess;
