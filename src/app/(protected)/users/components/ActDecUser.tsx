"use client";

import { Space, theme, Typography } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMessage } from "@/hooks/useMessage";
import { AxiosError } from "axios";
import { getRecColor } from "@/utils/common";
import { IoMdSwitch } from "react-icons/io";
import { updateUserStatus } from "@/actions/users";

export default function ChangeMerchantStatus({ user }: { user: any }) {
  const queryClient = useQueryClient();
  const { openMessage } = useMessage();
  const { token } = theme.useToken();

  const updateUserStatusMutation = useMutation({
    mutationKey: ["update-user-config"],
    mutationFn: () => updateUserStatus(user._id as string, !user.active),
    onSuccess: () => {
      openMessage("success", "User status updated");
      queryClient.invalidateQueries({ queryKey: ["platform-users"] });
    },
    onError: (err: AxiosError<{ message: string }>) => {
      openMessage("error", err.response?.data.message || err.message);
    },
  });

  return (
    <Space style={{ color: getRecColor(!user.active, token) }}>
      <IoMdSwitch />
      <Typography.Text
        style={{ color: getRecColor(!user.active, token) }}
        onClick={() => updateUserStatusMutation.mutate()}
      >
        {user?.active ? "Deactivate" : "Activate"}
      </Typography.Text>
    </Space>
  );
}
