"use client";

import { useMarkdownStore } from "@/store/markdownStore";
import { useEffect, useState } from "react";
import { BgColorsOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";
import { THEMES, THEME_LABELS, type MarkdownTheme } from "@/config/theme";

const themeOptions: { value: MarkdownTheme; label: string }[] = THEMES.map(
  (theme) => ({ value: theme, label: THEME_LABELS[theme] })
);

export default function ThemeToggle() {
  const { theme, setTheme } = useMarkdownStore();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const codeWrappers = document.querySelectorAll(".code-block-wrapper");
    codeWrappers.forEach((wrapper) => {
      wrapper.setAttribute("data-theme", theme);
    });
  }, [theme, mounted]);

  if (!mounted) {
    return null;
  }

  const selectedTheme = themeOptions.find((t) => t.value === theme);

  return (
    <div className={styles.themeSelector}>
      <button className={styles.themeButton} onClick={() => setIsOpen(!isOpen)}>
        <BgColorsOutlined className={styles.themeIcon} />
        <span className={styles.themeLabel}>
          {selectedTheme?.label || theme}
        </span>
        <svg
          className={`${styles.dropdownArrow} ${isOpen ? styles.open : ""}`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M2 4L6 8L10 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          {themeOptions.map((option) => (
            <button
              key={option.value}
              className={`${styles.dropdownItem} ${theme === option.value ? styles.active : ""}`}
              onClick={() => {
                setTheme(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
