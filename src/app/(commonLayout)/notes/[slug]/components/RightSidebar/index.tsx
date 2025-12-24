"use client";

import { useEffect, useState, useRef } from "react";
import { MenuOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function RightSidebar() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    const headingElements = article.querySelectorAll("h1, h2, h3, h4, h5, h6");
    const extractedHeadings: Heading[] = [];

    headingElements.forEach((heading, index) => {
      const stableId = `heading-${index}`;
      heading.id = stableId;
      extractedHeadings.push({
        id: stableId,
        text: heading.textContent || "",
        level: parseInt(heading.tagName.substring(1)),
      });
    });

    setHeadings(extractedHeadings);

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observerOptions = {
      root: null,
      rootMargin: "-10% 0px -80% 0px",
      threshold: 0,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    }, observerOptions);

    headingElements.forEach((heading) => {
      observerRef.current?.observe(heading);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      setActiveId(id);
    }
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
