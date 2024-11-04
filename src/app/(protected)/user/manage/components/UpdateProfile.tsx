"use client";

import { loadUser, updateUser } from "@/actions/auth";
import { useMessage } from "@/hooks/useMessage";
import { removeUndefinedValues } from "@/utils/common";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Col, Flex, Form, Input, Row } from "antd";
import { useForm } from "antd/es/form/Form";
import { AxiosError } from "axios";

function UpdateProfile() {
  const queryClient = useQueryClient();
  const { openMessage } = useMessage();
  const [form] = useForm();

  const userQuery = useQuery({
    queryKey: ["current-user"],
    queryFn: () => loadUser(),
  });

  const updateUserMutation = useMutation({
    mutationKey: ["update-current-user"],
    mutationFn: (data: any) => updateUser(data),
    onSuccess: () => {
      form.resetFields(["password"]);
      openMessage("success", "Profile updated");
      queryClient.invalidateQueries({
        queryKey: ["update-current-user"],
      });
    },
    onError: (err: AxiosError<{ message: string }>) => {
      openMessage("error", err.response?.data.message || err.message);
    },
  });

  const onFinish = (vals: any) => {
    const sanitized = removeUndefinedValues(vals);

    updateUserMutation.mutate(sanitized);
  };

  return (
    <Flex justify="center" flex="vertical" content="center">
      <Form
        form={form}
        requiredMark
        initialValues={{
          fName: userQuery.data?.person?.fName,
          lName: userQuery.data?.person?.lName,
          password: "",
        }}
        layout="vertical"
        onFinish={onFinish}
      >
        <Row gutter={15}>
          <Col span={24}>
            <Form.Item
              rules={[{ required: true, message: "First name is required" }]}
              name="fName"
              label="First Name"
            >
              <Input placeholder="Wematu" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              rules={[{ required: true, message: "Last name is required" }]}
              name="lName"
              label="Last Name"
            >
              <Input placeholder="James" />
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

export default UpdateProfile;
