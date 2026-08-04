"use client";

import React, { useState } from "react";
import { Divider, Flex, Layout, Menu, theme, Button } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined, CloseOutlined } from "@ant-design/icons";
import UserAvatar from "./user/components/Avatar";
import Link from "next/link";
import Image from "next/image";
import { useLogout } from "@/hooks/useLogout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMessage } from "@/hooks/useMessage";
import useInactivityTimeout from "@/hooks/useInactivityTimeout";
import withAuth from "../../components/routing/withAuth";
import { usePathname } from "next/navigation";
import { getGreeting } from "@/utils/common";
import { useUser } from "@/hooks/useUser";
import sideMenuItems from "./sideMenuItems";
const { Header, Content, Footer, Sider } = Layout;

function ProtectedLayout({ children, sideMenuItems }: Readonly<{ children: React.ReactNode, sideMenuItems: any[] }>) {
  const [collapsed, setCollapsed] = useState(false);
  const { token } = theme.useToken();
  const { user } = useUser()
  const { logout } = useLogout();
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
      <Layout hasSider style={{ maxHeight: "100vh", overflow: "hidden" }}>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          breakpoint="lg"
          collapsedWidth="0"
          width={200}
          className={`
            max-lg:absolute! max-lg:z-1000! max-lg:h-screen! transition-all duration-300
            ${!collapsed ? "max-lg:w-full! max-lg:max-w-full! max-lg:min-w-full! max-lg:flex-[0_0_100%]!" : ""}
          `}
        >
          <Flex style={{ width: "100%", height: "64px" }} justify="space-between" align="center" className="px-4">
            <Link href="/">
              {!collapsed && (
                <Image
                  src="/nerasollogo.png"
                  alt="nerasol-logo"
                  width={140}
                  height={45}
                />
              )}
            </Link>

            {/* This Close button only appears on mobile screens so users can exit the full-screen menu */}
            {!collapsed && (
              <Button
                type="text"
                icon={<CloseOutlined style={{ color: "white", fontSize: "18px" }} />}
                onClick={() => setCollapsed(true)}
                className="lg:hidden"
              />
            )}
          </Flex>

          <Divider style={{ margin: 0, borderColor: "rgba(255,255,255,0.1)" }} />

          <Menu
            items={sideMenuItems}
            theme="dark"
            style={{ width: "100%" }}
            defaultOpenKeys={["dashboard"]}
            selectedKeys={[pathname]}
            mode="inline"
            onClick={() => {
              // Automatically close the full-screen sidebar on mobile when a user clicks a menu link
              if (window.innerWidth < 1024) {
                setCollapsed(true);
              }
            }}
          />
        </Sider>

        <Layout className="relative">
          <Header
            className="flex justify-between items-center px-4 p-0 shadow-sm relative z-10"
            style={{
              background: token.colorBgContainer,
              paddingLeft: collapsed ? "50px" : 0,
            }}
          >
            {/* Left Side: Collapse Button + Greeting */}
            <div className="flex items-center">
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ fontSize: "16px", width: 64, height: 64 }}
              />

              {/* The Greeting (Hidden on extra-small mobile screens to save space) */}
              <div className="hidden sm:inline-block ml-2 text-base text-gray-500">
                {getGreeting()}, <span className="font-semibold text-gray-800">{user?.person?.fName || "User"}</span>
              </div>
            </div>

            {/* Right Side: Avatar */}
            <UserAvatar />
          </Header>

          <Content className="h-[calc(100vh-64px-64px)] p-5 overflow-y-auto bg-gray-50">
            {children}
          </Content>

          <Footer style={{ textAlign: "center", padding: 0 }}>
            Nerasika ©{new Date().getFullYear()} Created by NeraSol Ghana Limited
          </Footer>
        </Layout>
      </Layout>
    </QueryClientProvider>
  );
}

function ProtectedRootLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout sideMenuItems={sideMenuItems}>{children}</ProtectedLayout>;
}

export default withAuth(ProtectedRootLayout);