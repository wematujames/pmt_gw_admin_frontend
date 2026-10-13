"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spin } from "antd";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/financial");
  }, [router]);

  return <Spin fullscreen size="large" />;
}
