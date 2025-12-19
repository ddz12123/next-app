"use client";
import { useEffect } from "react";
export default function HomePage() {
  useEffect(() => {
    document.title = "首页";
  }, []);
  return (
    <div className="flex flex-col">
      <div>home</div>
    </div>
  );
}
