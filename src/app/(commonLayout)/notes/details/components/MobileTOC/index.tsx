"use client";

import { useMemo, useState, useRef } from "react";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface MobileTOCProps {
  headings: Heading[];
  activeId: string;
  onHeadingClick: (id: string) => void;
}

export default function MobileTOC({ headings, activeId, onHeadingClick }: MobileTOCProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const activeText = useMemo(() => {
    const activeHeading = headings.find((h) => h.id === activeId);
    return activeHeading?.text || "目录";
  }, [activeId, headings]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleClick = (id: string) => {
    onHeadingClick(id);
    setIsOpen(false);
  };

  return (
    <div className={styles.mobileTOC}>
      <button className={styles.tocButton} onClick={toggleOpen}>
        <MenuOutlined className={styles.tocButtonIcon} />
        <span className={styles.tocButtonText}>{activeText}</span>
        <CloseOutlined className={`${styles.tocButtonClose} ${isOpen ? styles.open : ""}`} />
      </button>
      <div
        className={`${styles.tocContent} ${isOpen ? styles.open : ""}`}
        ref={contentRef}
      >
        {headings.length > 0 ? (
          <nav className={styles.tocNav}>
            {headings.map((heading) => (
              <button
                key={heading.id}
                className={`${styles.tocItem} ${styles[`level${heading.level}`]} ${activeId === heading.id ? styles.active : ""}`}
                onClick={() => handleClick(heading.id)}
              >
                {heading.text}
              </button>
            ))}
          </nav>
        ) : (
          <div className={styles.tocEmpty}>暂无目录</div>
        )}
      </div>
    </div>
  );
}
