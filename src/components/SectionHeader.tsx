"use client";
import { Space, theme, Typography } from "antd";
import Meta from "antd/es/card/Meta";

function SectionHeader({
  leadText,
  subText,
  icon,
}: {
  leadText: string;
  subText: string;
  icon: JSX.Element;
}) {
  const { token } = theme.useToken();

  return (
    <Meta
      title={
        <Space>
          {icon}
          <Typography.Title level={4}>{leadText}</Typography.Title>
        </Space>
      }
      description={
        <Typography.Paragraph
          style={{
            fontSize: token.fontSizeSM,
            marginBottom: token.marginXS,
            marginTop: -token.marginXS,
            color: token.colorTextDescription,
          }}
        >
          {subText}
        </Typography.Paragraph>
      }
    />
  );
}

export default SectionHeader;
