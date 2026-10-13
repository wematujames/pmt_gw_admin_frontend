"use client";

import { Button } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import { FiRefreshCw } from "react-icons/fi";

export default function ReloadUsers({ keys }: { keys: string[] }) {
    const queryClient = useQueryClient();

    const refresh = () => {
        queryClient.invalidateQueries({ queryKey: keys });
    }

    return (
        <Button
            icon={<FiRefreshCw />}
            type="primary"
            onClick={refresh}
        >
            Refresh
        </Button>
    )
}