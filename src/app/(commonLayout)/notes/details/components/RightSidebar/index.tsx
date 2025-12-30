"use client";

import { MenuOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";
import { useHeadings, Heading } from "../useHeadings";

export default function RightSidebar() {
  const { headings, activeId, handleHeadingClick } = useHeadings();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    handleHeadingClick(id);
  };

  return (
    <aside className={styles.rightSidebar}>
      <div className={styles.sidebarContent}>
        <div className={styles.sidebarTitle}>
          <MenuOutlined className={styles.sidebarTitleIcon} />
          目录
        </div>
        {headings.length > 0 ? (
          <nav className={styles.tocNav}>
            {headings.map((heading) => (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                className={`${styles.tocItem} ${styles[`level${heading.level}`]} ${activeId === heading.id ? styles.active : ""}`}
                onClick={(e) => handleClick(e, heading.id)}
              >
                {heading.text}
              </a>
            ))}
          </nav>
        ) : (
          <div className={styles.tocEmpty}>暂无目录</div>
        )}
      </div>
    </aside>
  );
}
