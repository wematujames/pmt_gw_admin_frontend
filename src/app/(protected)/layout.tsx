"use client";

import React from "react";
import { Divider, Flex, Layout, theme } from "antd";
import UserAvatar from "./user/components/Avatar";
import Link from "next/link";
import Image from "next/image";
import AppSideMenu from "./AppSideMenu";
import { useLogout } from "@/hooks/useLogout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMessage } from "@/hooks/useMessage";
import { useNotification } from "@/hooks/useNotification";
import useInactivityTimeout from "@/hooks/useInactivityTimeout";
const { Header, Content, Footer, Sider } = Layout;

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { token } = theme.useToken();
  const logout = useLogout("nerasol");
  const { openMessage } = useMessage();
  const { openNotification } = useNotification();

  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
        onSuccess: () => openMessage("success", "Success"),
        onError: (err: any) =>
          openMessage("error", err.response?.data.message || err.message),
      },
      queries: {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    },
  });

  useInactivityTimeout(logout);

  return (
    <QueryClientProvider client={queryClient}>
      <Layout hasSider>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {}}
          onCollapse={(collapsed, type) => {}}
          style={{ minHeight: "100vh" }}
        >
          <Flex style={{ width: "100%" }} justify="center" align="center">
            <Link href="/">
              <Image
                src="/nerasollogo.png"
                alt="nerasol-logo"
                width={180}
                height={80}
              />
            </Link>
          </Flex>
          <Divider style={{ margin: 0 }} />
          <AppSideMenu />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              background: token.colorBgContainer,
              paddingRight: token.paddingMD,
              textAlign: "right",
            }}
          >
            <UserAvatar />
          </Header>
          <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
            {children}
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Nerasika ©{new Date().getFullYear()} Created by NeraSol Ghana
            Limited
          </Footer>
        </Layout>
      </Layout>
    </QueryClientProvider>
  );
}
