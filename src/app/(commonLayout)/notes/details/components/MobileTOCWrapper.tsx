"use client";

import MobileTOC from "./MobileTOC";
import { useHeadings } from "./useHeadings";

export default function MobileTOCWrapper() {
  const { headings, activeId, handleHeadingClick } = useHeadings();

  return <MobileTOC headings={headings} activeId={activeId} onHeadingClick={handleHeadingClick} />;
}
