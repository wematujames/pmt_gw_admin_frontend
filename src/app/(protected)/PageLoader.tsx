import React from "react";
import { Spin } from "antd";
import styles from "./pageloader.module.css";

const PageLoader: React.FC = () => {
  return (
    <div className={styles["centered-spin"]}>
      <Spin size="large" />
    </div>
  );
  return;
};

export default PageLoader;
