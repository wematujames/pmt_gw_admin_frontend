import React from "react";
import { Button, Col, Input, Modal, Row, Tag, theme, Typography } from "antd";
import { BsEye } from "react-icons/bs";
import { getRecColor } from "@/utils/common";

export default function TxnDetails({ mandate }: { mandate: any }) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);
  const { token } = theme.useToken();

  const transformMandate: any = (mandate: any) => ({
    Active: mandate.active,
    Reason: mandate.statusReason,
    "Amount ₵": parseFloat(mandate.amount).toFixed(2),
    Account: mandate.phone,
    Narration: mandate.desc,
    Network: mandate.network,
    Merchant: mandate.merchant?.merchantId,
    MerchantRef: mandate.merchantRef,
    MerchantCreateCallback: mandate.merchantCreateDDMCallbackURL,
    MerchantPayCallback: mandate.merchantPayDDMCallbackURL,
    MerchantUpdateCallback: mandate.merchantUpdateCallbackURL || "N/A",
    MerchantCancelCallback: mandate.merchantCancelCallbackURL || "N/A",
    ExternalRef: mandate.processorTerminalRef || "N/A",
    CreatedAt: mandate.createdAt,
  });

  const txnTransformed = transformMandate(mandate);

  return (
    <>
      <Button
        type="default"
        icon={<BsEye />}
        size="middle"
        onClick={() => setOpen(true)}
        style={{
          color: getRecColor(
            mandate.statusReason === "pending" ? "pending" : mandate.active,
            token
          ),
          borderColor: getRecColor(
            mandate.statusReason === "pending" ? "pending" : mandate.active,
            token
          ),
        }}
      />

      <Modal
        open={open}
        width={1000}
        onCancel={() => setOpen(false)}
        title={
          <Typography.Title level={5}>
            <Tag
              color={getRecColor(
                mandate.statusReason === "pending" ? "pending" : mandate.active,
                token
              )}
            >
              {mandate.statusReason === "pending"
                ? "pending"
                : mandate.active
                ? "Active"
                : "Inactive"}
            </Tag>
            {"Mandate: " + mandate._id}
          </Typography.Title>
        }
        footer={false}
      >
        <Row gutter={[10, 5]}>
          {Object.keys(txnTransformed).map((key) => (
            <Col key={key} lg={12} style={{ width: "100%" }}>
              <Input
                readOnly
                addonBefore={
                  <strong style={{ color: token.colorTextLabel }}>{key}</strong>
                }
                value={txnTransformed[key]}
              />
            </Col>
          ))}
        </Row>
      </Modal>
    </>
  );
}
