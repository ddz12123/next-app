"use client";

import { useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import { AntdRegistry } from "@ant-design/nextjs-registry";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    const setRemBase = () => {
      const designWidth = 1920; // 1920 设计稿
      const clientWidth = document.documentElement.clientWidth;
      // 计算缩放比例：默认 16px，按屏幕宽度缩放，但最小不低于 10px
      const baseFontSize = Math.max(16 * (clientWidth / designWidth), 10);
      // 最终 html font-size = 计算值（≥10px，默认16px）
      document.documentElement.style.fontSize = `${baseFontSize}px`;
    };

    setRemBase(); // 初始化
    window.addEventListener("resize", setRemBase);
    return () => window.removeEventListener("resize", setRemBase);
  }, []);
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
