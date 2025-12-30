"use client";

import { useMarkdownStore } from "@/store/markdownStore";
import { useEffect, useRef, useState } from "react";
import ImageViewer from "../ImageViewer";

interface MDXContentProps {
  children: React.ReactNode;
}

export default function MDXContent({ children }: MDXContentProps) {
  const theme = useMarkdownStore((state) => state.theme);
  const [viewerImage, setViewerImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const codeWrappers = document.querySelectorAll(".code-block-wrapper");
    codeWrappers.forEach((wrapper) => {
      wrapper.setAttribute("data-theme", theme);
    });
  }, [theme]);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const handleImageClick = (e: MouseEvent) => {
      const target = e.target as HTMLImageElement;
      if (target.tagName === "IMG") {
        e.preventDefault();
        e.stopPropagation();
        setViewerImage({ src: target.src, alt: target.alt || "图片" });
      }
    };

    content.addEventListener("click", handleImageClick, true);
    return () => content.removeEventListener("click", handleImageClick, true);
  }, []);

  const closeViewer = () => {
    setViewerImage(null);
  };

  return (
    <>
      <div ref={contentRef}>{children}</div>
      {viewerImage && (
        <ImageViewer
          src={viewerImage.src}
          alt={viewerImage.alt}
          onClose={closeViewer}
        />
      )}
    </>
  );
}
