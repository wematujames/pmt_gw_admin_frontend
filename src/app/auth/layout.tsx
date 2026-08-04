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

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard/financial");
    }
  }, [user, loading, router]);

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/auth-bg.jpg')` }}
    >
      {/* 
        The solid color overlay has been removed.
        We kept 'backdrop-blur-sm' to give the background a slight out-of-focus effect, 
        ensuring the image is highly visible while keeping the text on the card readable.
      */}
      <div className="absolute inset-0 backdrop-blur-xs z-0"></div>

      {/* The main content area sits above the background overlay (z-10) */}
      <div className="relative z-10 flex w-full flex-col items-center justify-center p-4">
        {loading || user ? (
          <Spin size="large" tip="Verifying access..." className="mt-8" />
        ) : (
          children
        )}
      </div>
    </div>
  );
}