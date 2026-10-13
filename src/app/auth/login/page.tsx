"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "antd";
import LoginForm from "./LoginForm";
import AuthenticatorVerification from "./2fa/AuthenticatorVerification";

export default function LoginPage() {
  const [loginToken, setLoginToken] = useState<string | null>(null);

  return (
    <div className="w-full flex flex-col items-center">      <div className="mb-8">
      <Link href="/">
        <Image src="/nerasollogo.png" alt="nerasol-logo" width={180} height={60} className="object-contain" />
      </Link>
    </div>

      <Card className="w-full max-w-md shadow-lg rounded-2xl border-none overflow-hidden" styles={{ body: { padding: "32px" } }}>

        {loginToken ? (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <AuthenticatorVerification
              loginToken={loginToken}
              onBack={() => setLoginToken(null)}
            />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <LoginForm onMultiFA={setLoginToken} />
          </div>
        )}
      </Card>
    </div>
  );
}