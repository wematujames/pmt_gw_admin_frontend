import React from "react";
import { Button, Col, Input, Modal, Row, Space, Tag, theme, Typography } from "antd";
import { BsEye } from "react-icons/bs";
import { getRecColor } from "@/utils/common";

export default function UserDetail({ user }: { user: any }) {
  const [open, setOpen] = React.useState<boolean>(false);
  const { token } = theme.useToken();

  const transformUser: any = (user: any) => {
    return {
      "First Name": user.person?.fName,
      "Last Name": user.person?.lName,
      Status: user.active ? "Active" : "Inactive",
      Reason: user.statusReason || "N/A",
      Phone: user.phone,
      "Phone Verified": user.phoneVerified,
      Email: user.email,
      "Email Verified": user.emailVerified,
      "Old Phones": user.oldPhones?.join(",") || "N/A",
      "Old Emails": user.oldEmail?.join(",") || "N/A",
      "2FA Eabled": user.multiFA?.enabled ? "Yes" : "No",
      "Account Locked": user.accountLock?.active ? "Yes" : "No",
      CreatedBy: user.createdBy?.email || "N/A",
      CreatedAt: user.createdAt,
    };
  };

  const userTransformed = transformUser(user);

  return (
    <>
      <Button
        type="default"
        icon={<BsEye />}
        size="middle"
        onClick={() => setOpen(true)}
        style={{
          color: getRecColor(user.active, token),
          borderColor: getRecColor(user.active, token),
        }}
      />

      <Modal
        open={open}
        width={1000}
        onCancel={() => setOpen(false)}
        title={
          <Typography.Title level={5}>
            <Tag style={{ marginInlineEnd: token.marginXS }} color={getRecColor(user.active, token)}>
              {user.active ? "Active" : "Inactive"}
            </Tag>
            {`User: ${user?.person?.fName} ${user?.person?.lName}`}
          </Typography.Title>
        }
        footer={false}
      >
        <Row gutter={[10, 5]}>
          {Object.keys(userTransformed).map((key) => (
            <Col key={key} lg={12} style={{ width: "100%" }}>
              <Space.Compact block>
                <Space.Addon>
                  <strong style={{ color: token.colorTextLabel }}>{key}</strong>
                </Space.Addon>
                <Input readOnly value={userTransformed[key]} />
              </Space.Compact>
            </Col>
          ))}
        </Row>
      </Modal>
    </>
  );
}
