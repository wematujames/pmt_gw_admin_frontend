"use client";
import { Typography } from "antd";

export default function ModuleHeader(
    { title, description, icon, rightActions }:
        { title: string, description: string, icon: React.ReactNode, rightActions?: React.ReactNode }
) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all" >
            {/* Left Side: Icon and Title */}
            <div className="flex items-center gap-4" >
                <div className="p-3 bg-blue-50 text-[#142868] rounded-lg hidden sm:block">
                    {icon}
                </div>

                <div>
                    <Typography.Title level={3} className="!m-0 text-gray-800 tracking-tight">
                        {title}
                    </Typography.Title>
                    <p className="text-gray-500 text-sm mt-1 mb-0 font-medium">
                        {description}
                    </p>
                </div>
            </div>

            {/* Right Side: Page-Level Actions */}
            <div className="w-full sm:w-auto flex justify-end" >
                {rightActions}
            </div >
        </div >
    )
}
