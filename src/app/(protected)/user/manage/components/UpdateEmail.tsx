"use client";

import { loadUser, updateUserEmail } from "@/actions/auth";
import { useMessage } from "@/hooks/useMessage";
import { removeUndefinedValues } from "@/utils/common";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Col, Flex, Form, Input, Row } from "antd";
import { useForm } from "antd/es/form/Form";
import { AxiosError } from "axios";

function UpdateEmail() {
  const { openMessage } = useMessage();
  const [form] = useForm();
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: ["current-user"],
    queryFn: () => loadUser(),
  });

  const updateEmailMutation = useMutation({
    mutationKey: ["update-current-user-email"],
    mutationFn: (data: any) => updateUserEmail(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["update-current-user-email"],
      });
      form.resetFields();
      openMessage("success", "Email updated, verification link sent");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      openMessage("error", err.response?.data.message || err.message);
    },
  });

  const onFinish = (vals: any) => {
    const sanitized = removeUndefinedValues(vals);
    updateEmailMutation.mutate(sanitized);
  };

  return (
    <Flex justify="center" flex="vertical" content="center">
      <Form
        form={form}
        initialValues={{
          currentEmail: userQuery.data?.email,
          newEmail: "",
          password: "",
        }}
        layout="vertical"
        requiredMark
        onFinish={onFinish}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="currentEmail" label="Current Email">
              <Input
                readOnly
                type="email"
                addonAfter={"V: " + userQuery.data?.emailVerified}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              rules={[{ required: true, message: "New email is required" }]}
              name="newEmail"
              label="New Email"
            >
              <Input type="email" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              rules={[{ required: true, message: "Password is required" }]}
              name="password"
              label="Password"
            >
              <Input.Password type="password" />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Form.Item>
            <Button htmlType="submit" type="primary">
              Submit
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </Flex>
  );
}

export default UpdateEmail;
