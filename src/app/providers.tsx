"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NotificationProvider from "@/context/NotificationContext";
import MessageProvider from "@/context/MessageContext";
import { ConfigProvider } from "antd";
import theme from "@/themes/default";

export default function Providers({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const queryClient = new QueryClient();

    return (
        <NotificationProvider>
            <MessageProvider>
                <QueryClientProvider client={queryClient}>
                    <ConfigProvider theme={theme}>
                        <AntdRegistry>{children}</AntdRegistry>
                    </ConfigProvider>
                </QueryClientProvider>
            </MessageProvider>
        </NotificationProvider>
    );
}
