"use client";
import { useSearchParams } from "next/navigation";
import { Card, Tabs } from "antd";
import { CgPassword } from "react-icons/cg";
import { BsLockFill } from "react-icons/bs";
import { BiMobile, BiUserCircle } from "react-icons/bi";

import UpdateProfile from "./components/UpdateProfile";
import TwoFactorAuth from "./components/TwoFactorAuth";
import UpdatePassword from "./components/UpdatePassword";
import { Suspense, useState } from "react";
import UpdatePhone from "./components/UpdatePhone";
import UpdateEmail from "./components/UpdateEmail";
import { MdEmail } from "react-icons/md";

const tabs = [
  {
    key: "profile",
    label: `Profile`,
    children: <UpdateProfile />,
    icon: <BiUserCircle />,
  },
  {
    key: "phone",
    label: `Phone`,
    children: <UpdatePhone />,
    icon: <BiMobile />,
  },
  {
    key: "email",
    label: `Email`,
    children: <UpdateEmail />,
    icon: <MdEmail />,
  },
  {
    key: "password",
    label: `Password`,
    children: <UpdatePassword />,
    icon: <CgPassword />,
  },
  {
    key: "2fa",
    label: `2-Factor Authentication`,
    children: <TwoFactorAuth />,
    icon: <BsLockFill />,
  },
];

const User: React.FC = () => {
  const searchParams = useSearchParams();

  const [activeKey, setActiveKey] = useState(
    searchParams.get("tab") ? (searchParams.get("tab") as string) : "profile"
  );

  return (
    <Card>
      <Tabs
        size="large"
        style={{ height: "80vh" }}
        activeKey={activeKey}
        onTabClick={(key) => setActiveKey(key)}
        centered
        items={tabs}
      />
    </Card>
  );
};
export default function UserSuspended() {
  return (
    <Suspense>
      <User />
    </Suspense>
  );
}
