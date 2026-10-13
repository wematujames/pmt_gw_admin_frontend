"use client";

import { useUser } from "@/hooks/useUser";
import { Spin } from "antd";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  // Signed-in users open verification links after changing their email.
  const allowSignedIn = pathname?.startsWith("/auth/verification/email");

  useEffect(() => {
    if (!loading && user && !allowSignedIn) {
      router.replace("/dashboard/financial");
    }
  }, [user, loading, router, allowSignedIn]);

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
        {loading || (user && !allowSignedIn) ? (
          <Spin fullscreen size="large" description="Verifying access..." />
        ) : (
          children
        )}
      </div>
    </div>
  );
}