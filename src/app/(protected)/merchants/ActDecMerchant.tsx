"use client";

import { Select, Space, theme, Typography } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMessage } from "@/hooks/useMessage";
import { AxiosError } from "axios";
import { getRecColor } from "@/utils/common";
import { updateMerchantStatus } from "@/actions/merchants";
import { IoMdSwitch } from "react-icons/io";

const { Option } = Select;

export default function ChangeMerchantStatus({ merchant }: { merchant: any }) {
  const queryClient = useQueryClient();
  const { openMessage } = useMessage();
  const { token } = theme.useToken();

  const updateMerchantStatusMutation = useMutation({
    mutationKey: ["upate-merchant-config"],
    mutationFn: () =>
      updateMerchantStatus(merchant._id as string, !merchant.active),
    onSuccess: () => {
      openMessage("success", "Merchant status updated");
      queryClient.invalidateQueries({ queryKey: ["platform-merchants"] });
    },
    onError: (err: AxiosError<{ message: string }>) => {
      openMessage("error", err.response?.data.message || err.message);
    },
  });

  return (
    <Space style={{ color: getRecColor(!merchant.active, token) }}>
      <IoMdSwitch />
      <Typography.Text
        style={{ color: getRecColor(!merchant.active, token) }}
        onClick={() => updateMerchantStatusMutation.mutate()}
      >
        {merchant?.active ? "Deactivate" : "Activate"}
      </Typography.Text>
    </Space>
  );
}
