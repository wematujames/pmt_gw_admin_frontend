"use client";

import { useUser } from "@/hooks/useUser";
import { Spin } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function ProtectLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading, error } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard/financial");
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#EDF2EC] gap-4 overflow-hidden">
        <Spin fullscreen size="large" tip="Verifying access..." />
      </div>
    );
  }

  return (<>{children}</>);
}
