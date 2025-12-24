"use client";

import { useState } from "react";
import { CopyOutlined, CheckOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";

interface CopyButtonProps {
  code: string;
}

export default function CopyButton({ code }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      className={styles.copyButton}
      onClick={handleCopy}
      title={copied ? "已复制" : "复制代码"}
      aria-label={copied ? "已复制" : "复制代码"}
    >
      {copied ? (
        <CheckOutlined className={styles.icon} />
      ) : (
        <CopyOutlined className={styles.icon} />
      )}
      <span className={styles.label}>{copied ? "已复制" : "复制"}</span>
    </button>
  );
}
