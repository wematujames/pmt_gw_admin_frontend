"use client";

import React from "react";
import { Divider, Flex, Layout, Menu, theme } from "antd";
import UserAvatar from "./user/components/Avatar";
import Link from "next/link";
import Image from "next/image";
import { useLogout } from "@/hooks/useLogout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMessage } from "@/hooks/useMessage";
import useInactivityTimeout from "@/hooks/useInactivityTimeout";
import withAuth from "./withAuth";
import sideMenuItems from "./sideMenuItems";
import { usePathname } from "next/navigation";
const { Header, Content, Footer, Sider } = Layout;

function ProtectedLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  const { token } = theme.useToken();
  const logout = useLogout();
  const { openMessage } = useMessage();
  const pathname = usePathname();

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
      <Layout hasSider style={{ maxHeight: "100vh" }}>
        <Sider breakpoint="lg" collapsedWidth="0">
          <Flex style={{ width: "100%" }} justify="center" align="center">
            <Link href="/">
              <Image
                src="/nerasollogo.png"
                alt="nerasol-logo"
                width={180}
                height={60}
              />
            </Link>
          </Flex>

          <Divider style={{ margin: 0 }} />

          <Menu
            items={sideMenuItems}
            theme="dark"
            style={{ width: 200 }}
            defaultOpenKeys={["dashboard"]}
            selectedKeys={[pathname]}
            mode="inline"
          />
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

          <Content style={{ overflow: "scroll", maxHeight: "100vh" }}>
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

function ProtectedRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedLayout>{children}</ProtectedLayout>
  );
}

export default withAuth(ProtectedRootLayout);