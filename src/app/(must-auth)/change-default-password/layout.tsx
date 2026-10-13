"use client";

import { useUser } from "@/hooks/useUser";
import { Spin } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useUser();
  const router = useRouter();

  // If a logged-in user tries to visit /auth/login, push them to the dashboard
  useEffect(() => {
    if (!loading && user && user.isPasswordReset) {
      router.replace("/"); // Or "/dashboard" depending on your setup
    }
  }, [user, loading, router]);

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat bg-[#EDF2EC]"
      style={{ backgroundImage: `url('/auth-bg.jpg')` }}
    >
      <div className="absolute inset-0 backdrop-blur-xs z-0"></div>

      <div className="relative z-10 flex w-full flex-col items-center justify-center p-4">
        {loading ? (
          <Spin fullscreen size="large" description="Loading..." />
        ) : (
          children
        )}
      </div>
    </div>
  );
}