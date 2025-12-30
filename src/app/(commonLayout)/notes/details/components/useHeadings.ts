"use client";

import { useEffect, useState, useRef } from "react";

export interface Heading {
  id: string;
  text: string;
  level: number;
}

export function useHeadings() {
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

    queueMicrotask(() => setHeadings(extractedHeadings));

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

  const handleHeadingClick = (id: string) => {
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

  return { headings, activeId, handleHeadingClick };
}
