"use client";

import React from "react";
import { Layout } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const { Header, Content, Footer, Sider } = Layout;
const queryClient = new QueryClient();

export default function ProtectLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
