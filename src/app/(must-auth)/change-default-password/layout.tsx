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

  // Signed-out visitors go to login; users who already reset their password go home
  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/auth/login");
    } else if (user.isPasswordReset) {
      router.replace("/");
    }
  }, [user, loading, router]);

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat bg-[#EDF2EC]"
      style={{ backgroundImage: `url('/auth-bg.jpg')` }}
    >
      <div className="absolute inset-0 backdrop-blur-xs z-0"></div>

      <div className="relative z-10 flex w-full flex-col items-center justify-center p-4">
        {loading || !user ? (
          <Spin fullscreen size="large" description="Loading..." />
        ) : (
          children
        )}
      </div>
    </div>
  );
}