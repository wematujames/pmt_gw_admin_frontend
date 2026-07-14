"use client";
import { useUser } from "@/hooks/useUser";
import { Card, theme, Typography } from "antd";

const Jumbotron = () => {
  const { token } = theme.useToken();
  const { user, loading } = useUser()

  function getGreeting() {
    const now = new Date();
    const hour = now.getHours();

    if (hour < 12) return "Good morning,";
    else if (hour < 18) return "Good afternoon,";
    else return "Good evening,";
  }

  return (
    <Card
      loading={loading}
      variant="outlined"
      style={{ marginTop: token.marginXXS, marginBottom: token.marginSM }}
    >
      <Typography.Title style={{ fontSize: token.fontSizeHeading2 }}>
        {getGreeting()} {user?.person?.fName}
      </Typography.Title>
      <p style={{ fontSize: token.fontSize, color: token.colorBgMask }}>
        {"Here's"} your financial overview
      </p>
    </Card>
  );
};

export default Jumbotron;
