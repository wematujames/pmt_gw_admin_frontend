"use client";

import { Typography, Button } from "antd";
import { ArrowLeftOutlined, MobileOutlined, MessageOutlined } from "@ant-design/icons";
import { MfaMethod } from "../page";

export default function MfaSelector({
    options,
    onSelect,
    onBack,
}: {
    options: { sms: boolean; authenticator: boolean };
    onSelect: (method: MfaMethod) => void;
    onBack: () => void;
}) {
    return (
        <>
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={onBack} className="mb-4 -ml-4 text-gray-500 hover:text-gray-800">
                Back
            </Button>

            <div className="text-center mb-6">
                <Typography.Title level={4} className="m-0! text-gray-800">
                    Security Verification
                </Typography.Title>
                <p className="text-gray-500 mt-1 mb-0">Select how you would like to receive your security code.</p>
            </div>

            <div className="flex flex-col gap-3">
                {options.authenticator && (
                    <button
                        onClick={() => onSelect("authenticator")}
                        className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-[#142868] hover:bg-blue-50 transition-all text-left bg-white"
                    >
                        <div className="p-3 bg-gray-50 rounded-lg text-gray-600">
                            <MobileOutlined className="text-xl" />
                        </div>
                        <div>
                            <div className="font-bold text-gray-800">Authenticator App</div>
                            <div className="text-sm text-gray-500">Get a code from your authenticator app</div>
                        </div>
                    </button>
                )}

                {options.sms && (
                    <button
                        onClick={() => onSelect("sms")}
                        className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-[#142868] hover:bg-blue-50 transition-all text-left bg-white"
                    >
                        <div className="p-3 bg-gray-50 rounded-lg text-gray-600">
                            <MessageOutlined className="text-xl" />
                        </div>
                        <div>
                            <div className="font-bold text-gray-800">SMS Verification</div>
                            <div className="text-sm text-gray-500">We will send a code to your phone</div>
                        </div>
                    </button>
                )}
            </div>
        </>
    );
}