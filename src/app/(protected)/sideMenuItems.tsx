"use client";
import Link from "next/link";
import { ImMeter } from "react-icons/im";
import { GoldenFilled, SwapOutlined } from "@ant-design/icons";
import { GiPlatform } from "react-icons/gi";
import { MdOutlineAppRegistration } from "react-icons/md";
import { Flex } from "antd";

const sideMenuItems = [
  {
    key: "/dashboard",
    type: "group",
    label: <Flex align="center" gap={5}> <ImMeter /> Dashboards </Flex>,
    children: [
      {
        key: "/dashboard/financial",
        label: <Link href="/dashboard/financial"> - Financial</Link>
      }
    ],
  },
  {
    type: "group",
    key: "/transactions",
    label: <Flex align="center" gap={5}> <SwapOutlined /> Transactions </Flex>,
    children: [
      // {
      //   key: "/transactions/overview",
      //   label: <Link href="/transactions/overview"> - Overview</Link>,
      // },
      {
        key: "/transactions",
        label: <Link href="/transactions"> - Report</Link>,
      },
    ],
  },
  {
    type: "group",
    key: "/direct-debit",
    label: <Flex align="center" gap={5}> <GoldenFilled /> Direct Debit </Flex>,
    children: [
      // {
      //   key: "/directdebit/overview",
      //   label: <Link href="/transactions/overview"> - Overview</Link>,
      // },
      {
        key: "/direct-debit/mandates",
        label: <Link href="/direct-debit/mandates"> - Report</Link>,
      },
    ],
  },
  // {
  //   type: "group",
  //   key: "/accounts",
  //   label: <Flex align="center" gap={5}> <BookOutlined /> Statements </Flex>,
  //   icon: <BookOutlined />,
  //   children: [
  //     {
  //       key: "/statements/transactions/view",
  //       label: <Link href="/transactions/view"> - Transactions</Link>,
  //     },
  //     {
  //       key: "/statments/directdebit/view",
  //       label: <Link href="/directdebit/view"> - Direct Debit M</Link>,
  //     },
  //   ],
  // },
  {
    type: "group",
    key: "/merchants",
    label: <Flex align="center" gap={5}> <MdOutlineAppRegistration /> Operations </Flex>,
    children: [
      {
        key: "/merchants",
        label: <Link href="/merchants"> - Merchant</Link>,
      },
    ],
  },
  {
    type: "group",
    key: "/platform",
    label: <Flex align="center" gap={5}> <GiPlatform /> Platform </Flex>,
    children: [
      {
        key: "/users",
        label: <Link href="/users"> - Users</Link>
      }
    ],
  },
];

export default sideMenuItems;
