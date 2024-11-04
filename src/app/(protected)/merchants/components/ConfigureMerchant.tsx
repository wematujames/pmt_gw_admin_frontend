"use client";

import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Switch,
  Tag,
  theme,
  Typography,
} from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useMessage } from "@/hooks/useMessage";
import { MdUpdate } from "react-icons/md";
import { AxiosError } from "axios";
import { getRecColor } from "@/utils/common";
import { useForm } from "antd/es/form/Form";
import { updateMerchantConfig } from "@/actions/merchants";
import { transformMerchantConfig } from "./utils";

const { Option } = Select;

export default function ConfigureMerchant({ merchant }: { merchant: any }) {
  const queryClient = useQueryClient();
  const [perms, setPerms] = useState([] as string[]);
  const { openMessage } = useMessage();
  const [open, setOpen] = useState<boolean>(false);
  const { token } = theme.useToken();
  const [form] = useForm();

  const updateMerchantConfigMutation = useMutation({
    mutationKey: ["upate-merchant-config"],
    mutationFn: () =>
      updateMerchantConfig(merchant?.config?._id as string, perms),
    onSuccess: () => {
      openMessage("success", "Merchant configuration updated");
      queryClient.invalidateQueries({ queryKey: ["platform-merchants"] });
    },
    onError: (err: AxiosError<{ message: string }>) => {
      openMessage("error", err.response?.data.message || err.message);
    },
  });

  const handleSubmit = (vals: any) => {
    setPerms(transformMerchantConfig(vals));

    updateMerchantConfigMutation.mutate();
  };

  return (
    <>
      <Typography.Text onClick={() => setOpen(true)}>Configure</Typography.Text>

      <Modal
        open={open}
        width={800}
        onCancel={() => setOpen(false)}
        title={
          <Typography.Text
            style={{
              fontWeight: token.fontWeightStrong,
              color: token.colorPrimary,
              fontSize: token.fontSizeLG,
            }}
          >
            <Tag color={getRecColor(merchant.active, token)}>
              {merchant.active ? "Active" : "Inactive"}
            </Tag>
            {"Confirgure Merchant: " + merchant?.name}
          </Typography.Text>
        }
        footer={
          <Button block type="default" htmlType="submit" onClick={form.submit}>
            <MdUpdate />
            Save
          </Button>
        }
      >
        <Form
          layout="horizontal"
          initialValues={{
            collectionc2bAllowed: merchant.config.collectionc2b.allowed,
            collectionc2bLimit: merchant.config.collectionc2b.limit,
            disbursementAllowed: merchant.config.disbursement.allowed,
            disbursementLimit: merchant.config.disbursement.limit,
            directDebitAllowed: merchant.config.directDebit?.allowed,
            directDebitLimit: merchant.config.directDebit?.limit,
            reversal: merchant.config.reversal?.allowed,
            statusCheck: merchant.config.statusCheck?.allowed,
            updateDDAmount: merchant.config.updateDDAmount?.allowed,
            cancelDirectDebit: merchant.config.cancelDirectDebit?.allowed,
            channelsMTNAllowed: merchant.config.channels?.mtn?.allowed,
            channelsTelecelAllowed: merchant.config.channels?.telecel?.allowed,
            channelsATAllowed: merchant.config.channels?.airtelTigo?.allowed,
            channelsMTNPro: merchant.config.channels?.mtn?.processor,
            channelsTelecelPro: merchant.config.channels?.telecel?.processor,
            channelsATPro: merchant.config.channels?.airtelTigo?.processor,
          }}
          form={form}
          onFinish={handleSubmit}
        >
          <Row gutter={[10, 5]}>
            <Col lg={12} style={{ width: "100%" }}>
              <Space size={10}>
                <Form.Item name="collectionc2bAllowed" label="Collection">
                  <Switch />
                </Form.Item>
                <Form.Item name="collectionc2bLimit" label="Limit">
                  <Input />
                </Form.Item>
              </Space>
            </Col>
            <Col lg={12} style={{ width: "100%" }}>
              <Space size={10}>
                <Form.Item name="reversal" label="Reversals">
                  <Switch />
                </Form.Item>
                <Form.Item name="cancelDirectDebit" label="Cancel Dir. Debit">
                  <Switch />
                </Form.Item>
              </Space>
            </Col>

            <Col lg={12} style={{ width: "100%" }}>
              <Space size={18}>
                <Form.Item name="disbursementAllowed" label="Transfer">
                  <Switch />
                </Form.Item>
                <Form.Item name="disbursementLimit" label="Limit">
                  <Input />
                </Form.Item>
              </Space>
            </Col>

            <Col lg={12} style={{ width: "100%" }}>
              <Space size={10}>
                <Form.Item name="updateDDAmount" label="Edit DDebit Amt">
                  <Switch />
                </Form.Item>
                <Form.Item name="statusCheck" label="Txn Status">
                  <Switch />
                </Form.Item>
              </Space>
            </Col>

            <Col lg={12} style={{ width: "100%" }}>
              <Space size={10}>
                <Form.Item name="directDebitAllowed" label="Dir. Debit">
                  <Switch />
                </Form.Item>
                <Form.Item name="directDebitLimit" label="Limit">
                  <Input />
                </Form.Item>
              </Space>
            </Col>

            <Col lg={12} style={{ width: "100%" }}>
              <Space size={10}>
                <Form.Item name="channelsMTNAllowed" label="MTN Txns">
                  <Switch />
                </Form.Item>
                <Form.Item name="channelsMTNPro" label="Processor">
                  <Select defaultActiveFirstOption defaultValue="MTN-MoMo">
                    <Option value="MTN-MoMo">MTN-Momo</Option>
                  </Select>
                </Form.Item>
              </Space>
            </Col>
            <Col lg={12} style={{ width: "100%" }}>
              <Space size={10}>
                <Form.Item name="channelsTelecelAllowed" label="Telecel Txns">
                  <Switch />
                </Form.Item>
                <Form.Item name="channelsTelecelPro" label="Processor">
                  <Select defaultActiveFirstOption defaultValue="MTN-MoMo">
                    <Option value="T-Cash">T-Cash</Option>
                  </Select>
                </Form.Item>
              </Space>
            </Col>
            <Col lg={12} style={{ width: "100%" }}>
              <Space size={10}>
                <Form.Item name="channelsATAllowed" label="AirtelTigo Txns">
                  <Switch />
                </Form.Item>
                <Form.Item name="channelsATPro" label="Processor">
                  <Select defaultActiveFirstOption defaultValue="T-Cash">
                    <Option value="AT-Cash">AT-Cash</Option>
                  </Select>
                </Form.Item>
              </Space>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}
