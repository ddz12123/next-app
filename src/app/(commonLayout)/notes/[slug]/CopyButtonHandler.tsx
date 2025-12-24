"use client";

import { useEffect } from "react";

export default function CopyButtonHandler() {
  useEffect(() => {
    const handleCopy = (e: Event) => {
      const target = e.target as HTMLElement;
      const button = target.closest(".copy-button") as HTMLElement;

      if (button) {
        const code = button.getAttribute("data-code");
        if (code) {
          const originalHTML = button.innerHTML;
          button.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          `;

          navigator.clipboard.writeText(code).then(() => {
            setTimeout(() => {
              button.innerHTML = originalHTML;
            }, 2000);
          });
        }
      }
    };

    document.addEventListener("click", handleCopy);
    return () => document.removeEventListener("click", handleCopy);
  }, []);

  return null;
}
