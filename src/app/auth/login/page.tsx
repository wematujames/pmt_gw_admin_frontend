"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "antd";
import LoginForm from "./LoginForm";
import MfaSelector from "./2fa/MfaSelector";
import SmsVerification from "./2fa/smsVerification";
import AuthenticatorVerification from "./2fa/AuthenticatorVerification";

export type MfaMethod = "sms" | "authenticator";

export default function LoginPage() {
  const [step, setStep] = useState<"login" | "select-mfa" | "verify-mfa">("login");
  const [loginToken, setLoginToken] = useState<string>("");
  const [availableMfa, setAvailableMfa] = useState<{ sms: boolean; authenticator: boolean }>({ sms: false, authenticator: false });
  const [selectedMethod, setSelectedMethod] = useState<MfaMethod | null>(null);

  const handleLoginSuccess = (res: any) => {
    if (res.mfa) {
      const hasSms = res.mfa.sms?.enabled;
      const hasAuth = res.mfa.authenticator?.enabled;

      setLoginToken(res.loginToken);
      setAvailableMfa({ sms: hasSms, authenticator: hasAuth });

      if (hasSms && hasAuth) {
        setStep("select-mfa");
      } else if (hasSms) {
        handleMethodSelection("sms");
      } else if (hasAuth) {
        handleMethodSelection("authenticator");
      }
    }
  };

  const handleMethodSelection = (method: MfaMethod) => {
    setSelectedMethod(method);
    setStep("verify-mfa");
  };

  return (
    <div className="w-full flex flex-col items-center">      <div className="mb-8">
      <Link href="/">
        <Image src="/nerasollogo.png" alt="nerasol-logo" width={180} height={60} className="object-contain" />
      </Link>
    </div>

      <Card className="w-full max-w-md shadow-lg rounded-2xl border-none overflow-hidden" bodyStyle={{ padding: "32px" }}>

        {/* Step 1: Initial Login */}
        {step === "login" && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <LoginForm onSuccess={handleLoginSuccess} />
          </div>
        )}

        {/* Step 2: MFA Selection (Only shown if both SMS and Authenticator are enabled) */}
        {step === "select-mfa" && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <MfaSelector
              options={availableMfa}
              onSelect={handleMethodSelection}
              onBack={() => setStep("login")}
            />
          </div>
        )}

        {/*  Step 3 in your page.tsx with this: */}
        {step === "verify-mfa" && selectedMethod === "sms" && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <SmsVerification
              loginToken={loginToken}
              onBack={() => setStep(availableMfa.sms && availableMfa.authenticator ? "select-mfa" : "login")}
            />
          </div>
        )}

        {step === "verify-mfa" && selectedMethod === "authenticator" && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <AuthenticatorVerification
              loginToken={loginToken}
              onBack={() => setStep(availableMfa.sms && availableMfa.authenticator ? "select-mfa" : "login")}
            />
          </div>
        )}

      </Card>
    </div>
  );
}