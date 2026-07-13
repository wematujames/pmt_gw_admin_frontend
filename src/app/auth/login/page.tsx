"use client";

import { Flex, Divider, Card } from "antd";
import Image from "next/image";
import Link from "next/link";
import { Typography } from "antd";
import styles from "./styles.module.css";
import NerasolLogin from "./AdminLogin";

export default function LoginPage() {

  return (
    <Flex
      className={styles.authLogin}
      justify="center"
      content="right"
      vertical
    >
      <Flex style={{ width: "100%" }} justify="center" align="center" vertical>
        <Link href="/">
          <Image
            src="/nerasollogo.png"
            alt="neraol-logo"
            width={180}
            height={80}
          />
        </Link>
      </Flex>
      <Flex style={{ width: "100%" }} justify="center" align="center" vertical>
        <Card className={styles.loginForm}>
          <Flex
            style={{ width: "100%" }}
            justify="center"
            align="center"
            vertical
          >
            <Typography.Title level={4}>
              Sign In To Your Account
            </Typography.Title>
          </Flex>
          <Divider style={{ marginTop: 5, marginBottom: 30 }} />
          <NerasolLogin />
        </Card>
      </Flex>
    </Flex>
  );
}
