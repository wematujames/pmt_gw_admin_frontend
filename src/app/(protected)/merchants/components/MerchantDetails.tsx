import React from "react";
import {
  Button,
  Col,
  Collapse,
  Input,
  Modal,
  Row,
  Tag,
  theme,
  Typography,
} from "antd";
import { BsEye } from "react-icons/bs";
import { getRecColor } from "@/utils/common";
import { transformMerchant, transformMerchantAccount } from "./utils";

export default function TxnDetails({ merchant }: { merchant: any }) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);
  const { token } = theme.useToken();

  const merchantTransformed = transformMerchant(merchant);
  const accountTransformed = transformMerchantAccount(merchant?.account);
  return (
    <>
      <Button
        type="default"
        icon={<BsEye />}
        onClick={() => setOpen(true)}
        size="middle"
        style={{
          color: getRecColor(merchant.active, token),
          borderColor: getRecColor(merchant.active, token),
        }}
      />

      <Modal
        open={open}
        width={1000}
        onCancel={() => setOpen(false)}
        title={
          <Typography.Title level={5}>
            <Tag color={getRecColor(merchant.active, token)}>
              {merchant.active ? "Active" : "Inactive"}
            </Tag>
            {"Merchant: " + merchant._id}
          </Typography.Title>
        }
        footer={false}
      >
        <Collapse
          size="small"
          style={{ marginBottom: token.marginSM }}
          items={[
            {
              key: "1",
              label: "Merchant Account Balance",
              children: (
                <p>
                  <Row gutter={[10, 5]}>
                    {Object.keys(accountTransformed).map((key) => (
                      <Col key={key} lg={12} style={{ width: "100%" }}>
                        <Input
                          readOnly
                          addonBefore={
                            <strong style={{ color: token.colorTextLabel }}>
                              {key}
                            </strong>
                          }
                          value={accountTransformed[key]}
                        />
                      </Col>
                    ))}
                  </Row>
                </p>
              ),
            },
          ]}
        />

        <Row gutter={[10, 5]}>
          {Object.keys(merchantTransformed).map((key) => (
            <Col key={key} lg={12} style={{ width: "100%" }}>
              <Input
                readOnly
                addonBefore={
                  <strong style={{ color: token.colorTextLabel }}>{key}</strong>
                }
                value={merchantTransformed[key]}
              />
            </Col>
          ))}
        </Row>
      </Modal>
    </>
  );
}
