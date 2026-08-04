"use client";

import { Button } from "antd";
import { BiExport } from "react-icons/bi";
import { exportTransactions } from "@/actions/transactions";
import { useState } from "react";

export default function ExportTransactions({ filter }: { filter: Record<string, any> }) {
    const [exporting, setExporting] = useState(false);

    return (
        <Button
            type="primary"
            icon={<BiExport />}
            loading={exporting}
            onClick={() => exportTransactions(filter, setExporting)}
            className="border-gray-200 text-gray-700 hover:text-[#142868] hover:border-[#142868]"
        >
            Export CSV
        </Button>
    )
}