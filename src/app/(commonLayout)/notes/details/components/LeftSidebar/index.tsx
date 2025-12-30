"use client";

import Link from "next/link";
import { ArrowLeftOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";

export default function LeftSidebar() {
  return (
    <aside className={`${styles.leftSidebar} ${styles.sidebar}`}>
      <div className={styles.sidebarTitle}>操作</div>
      <div className={styles.sidebarActions}>
        <Link href="/notes" className={styles.backButton}>
          <ArrowLeftOutlined className={styles.backIcon} />
          返回笔记列表
        </Link>
      </div>
    </aside>
  );
}
