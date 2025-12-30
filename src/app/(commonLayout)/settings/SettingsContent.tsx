"use client";

import { useEffect, useState } from "react";
import { Select, Typography, Skeleton } from "antd";
import { BgColorsOutlined } from "@ant-design/icons";
import { useMarkdownStore } from "@/store/markdownStore";
import { THEMES, THEME_LABELS } from "@/config/theme";
import styles from "./settings.module.scss";

const { Title } = Typography;

export default function SettingsContent() {
  // 使用选择器模式，这是 Zustand 推荐的最佳实践，也能避免一些 lint 误报
  const theme = useMarkdownStore((state) => state.theme);
  const setTheme = useMarkdownStore((state) => state.setTheme);

  useEffect(() => {
    document.title = "设置 | Settings";
  }, []);


  const themeOptions = THEMES.map((t) => ({
    value: t,
    label: THEME_LABELS[t],
  }));


  return (
    <div className={styles.settingsContainer}>
      <Title level={1} className={styles.title}>
        设置
      </Title>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <BgColorsOutlined />
          外观设置
        </div>

        <div className={styles.settingItem}>
          <div className={styles.settingInfo}>
            <div className={styles.settingLabel}>代码主题</div>
            <div className={styles.settingDesc}>
              选择笔记中代码块的显示主题，支持多种浅色和深色主题
            </div>
          </div>
          <div className={styles.settingControl}>
            <Select
              value={theme}
              onChange={setTheme}
              options={themeOptions}
              style={{ width: "100%" }}
              placeholder="选择代码主题"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
