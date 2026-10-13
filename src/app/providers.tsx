"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NotificationProvider from "@/context/NotificationContext";
import MessageProvider from "@/context/MessageContext";
import { ConfigProvider } from "antd";
import theme from "@/themes/default";
import { useState } from "react";

export default function Providers({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [queryClient] = useState(() => new QueryClient());

    // AntdRegistry must wrap everything that renders antd so its styles are
    // collected into the server HTML (otherwise first paint is unstyled).
    return (
        <AntdRegistry>
            {/* antd 6 renders custom-colour tags light by default; keep v5's solid look */}
            <ConfigProvider theme={theme} tag={{ variant: "solid" }}>
                <NotificationProvider>
                    <MessageProvider>
                        <QueryClientProvider client={queryClient}>
                            {children}
                        </QueryClientProvider>
                    </MessageProvider>
                </NotificationProvider>
            </ConfigProvider>
        </AntdRegistry>
    );
}
