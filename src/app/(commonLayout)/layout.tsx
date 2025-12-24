"use client";

import { useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import styles from "./layout.module.scss";
import AppHeader from "@/components/Header";
import { Affix } from "antd";

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
      const designWidth = 1920;
      const clientWidth = document.documentElement.clientWidth;
      const baseFontSize = Math.max(16 * (clientWidth / designWidth), 12);
      document.documentElement.style.fontSize = `${baseFontSize}px`;
    };

    setRemBase();
    window.addEventListener("resize", setRemBase);
    return () => window.removeEventListener("resize", setRemBase);
  }, []);

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} antialiased ${styles.container}`}
    >
      <Affix offsetTop={0}>
        <AppHeader />
      </Affix>
      {children}
    </div>
  );
}
