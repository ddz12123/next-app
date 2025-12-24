"use client";

import { useMarkdownStore } from "@/store/markdownStore";
import { useEffect } from "react";

interface MDXContentProps {
  children: React.ReactNode;
}

export default function MDXContent({ children }: MDXContentProps) {
  const theme = useMarkdownStore((state) => state.theme);

  useEffect(() => {
    const codeWrappers = document.querySelectorAll(".code-block-wrapper");
    codeWrappers.forEach((wrapper) => {
      wrapper.setAttribute("data-theme", theme);
    });
  }, [theme]);

  return <>{children}</>;
}
