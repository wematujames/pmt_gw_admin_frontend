"use client";

import { enable2Fa, getQrCode } from "@/actions/auth";
import { useLogout } from "@/hooks/useLogout";
import { useMessage } from "@/hooks/useMessage";
import { removeUndefinedValues } from "@/utils/common";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Col, Flex, Form, Image, Input, Row } from "antd";
import { useForm } from "antd/es/form/Form";
import { AxiosError } from "axios";

function TwoFactorAuth() {
  const logout = useLogout("nerasol");
  const { openMessage } = useMessage();
  const queryClient = useQueryClient();
  const [form] = useForm();
  const generateQrCode = useQuery({
    queryKey: ["current-user-2fa-qrcode"],
    queryFn: () => getQrCode(),
  });

  const enableUser2Fa = useMutation({
    mutationKey: ["enable-2fa-current-user"],
    mutationFn: (data: any) => enable2Fa(data.verificationCode),
    onSuccess: () => {
      form.resetFields();
      queryClient.invalidateQueries({
        queryKey: ["enable-2fa-current-user"],
      });
      openMessage("success", "2FA: Success");
      logout();
    },
    onError: (err: AxiosError<{ message: string }>) => {
      openMessage("error", err.response?.data.message || err.message);
    },
  });

  const onFinish = (vals: any) => {
    const sanitized = removeUndefinedValues(vals);
    enableUser2Fa.mutate(sanitized);
  };

  return (
    <Flex justify="center" flex="vertical" content="center">
      <Form form={form} layout="vertical" requiredMark onFinish={onFinish}>
        <Flex justify="center" align="center">
          <Row>
            <Col span={24}>
              <Flex justify="center" align="center">
                <Image
                  alt="2fa-qrcode"
                  src={generateQrCode.data}
                  width={250}
                  height={250}
                />
              </Flex>
            </Col>
            <Col span={24}>
              <Flex justify="center" align="center">
                <Form.Item
                  name="verificationCode"
                  label="2FA Verification Code"
                  rules={[
                    {
                      required: true,
                      message: "Verification code is required",
                    },
                    { len: 6, message: "VC must be 6 characters" },
                  ]}
                >
                  <Input.OTP length={6} itemType="number" />
                </Form.Item>
              </Flex>
            </Col>
          </Row>
        </Flex>
        <Row>
          <Col span={24}>
            <Flex justify="center" align="center">
              <Form.Item>
                <Button block htmlType="submit" type="primary">
                  Submit
                </Button>
              </Form.Item>
            </Flex>
          </Col>
        </Row>
      </Form>
    </Flex>
  );
}

export default TwoFactorAuth;
