import { login2fa } from "@/actions/auth";
import { useMessage } from "@/hooks/useMessage";
import { removeUndefinedValues } from "@/utils/common";
import { useMutation } from "@tanstack/react-query";
import { Col, Form, Input, Modal, Row } from "antd";
import { useForm } from "antd/es/form/Form";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

function AdminTwoFAModal({
  loginToken,
  open = false,
  setOpen,
}: {
  open: boolean;
  setOpen: Function;
  loginToken: string;
}) {
  const [form] = useForm();
  const router = useRouter();
  const { openMessage } = useMessage();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const nKey = "2faMsg";

  const login2faMutation = useMutation({
    mutationKey: ["update-user-email"],
    mutationFn: (data: any) => login2fa(data.verificationCode, loginToken),
    onSuccess: () => {
      openMessage("success", "Logged in");
      return router.push("/dashboard/financial");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      openMessage("error", err.response?.data.message || err.message);
      setConfirmLoading(false);
    },
  });

  const onFinish = (e: any) => {
    const sanitized = removeUndefinedValues(form.getFieldsValue());
    setConfirmLoading(true);
    login2faMutation.mutate(sanitized);
  };

  const handleCancel = () => {
    form.resetFields();
    setConfirmLoading(false);
    setOpen(false);
  };

  return (
    <Modal
      onOk={onFinish}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      centered
      title="Enter Verifcation Code"
      open={open}
    >
      <Form form={form} layout="vertical" requiredMark>
        <Row>
          <Col span={24}>
            <Form.Item
              label="2FA Verification Code"
              name="verificationCode"
              rules={[
                { required: true, message: "Verification code is required" },
                { len: 6, message: "VC must be 6 characters" },
              ]}
            >
              <Input.OTP length={6} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default AdminTwoFAModal;
