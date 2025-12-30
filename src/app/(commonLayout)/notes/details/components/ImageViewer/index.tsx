"use client";

import { useEffect } from "react";
import { Modal } from "antd";
import styles from "./index.module.scss";

interface ImageViewerProps {
  src: string;
  alt?: string;
  onClose: () => void;
}

export default function ImageViewer({
  src,
  alt = "图片",
  onClose,
}: ImageViewerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <Modal
      open={true}
      onCancel={onClose}
      footer={null}
      centered
      width="90%"
      style={{ maxWidth: "1200px" }}
      className={styles.imageModal}
      closable={true}
    >
      <div className={styles.imageContainer}>
        <img src={src} alt={alt} className={styles.image} />
      </div>
    </Modal>
  );
}
