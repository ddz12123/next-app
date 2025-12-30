"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { getImageDirApi, getNoteFileListApi } from "@/request/notes/note-api";
import { Spin, message, Empty, Modal, Button, Masonry } from "antd";
import {
  FolderFilled,
  CalendarOutlined,
  ZoomInOutlined,
  CopyOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import styles from "./images.module.scss";
import dayjs from "dayjs";

interface DirItem {
  name: string;
  modified: string;
}

interface ImageItem {
  name: string;
  path: string;
  modified: string;
  size: number;
  thumb: string;
  sign: string;
}

export default function GalleryPage() {
  const [dirs, setDirs] = useState<DirItem[]>([]);
  const [currentDir, setCurrentDir] = useState<string>("");
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<ImageItem | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const pageSize = 20;

  useEffect(() => {
    document.title = "图库 | Gallery";
  }, []);

  const formatDate = (date: string) => {
    return dayjs(date).format("YYYY-MM-DD");
  };

  const getImageUrl = (path: string, sign: string) => {
    const baseUrl = "http://47.119.182.242:8000/p";
    const encodedPath = path
      .split("/")
      .map((segment) => encodeURIComponent(segment))
      .join("/");
    return `${baseUrl}${encodedPath}${sign ? `?sign=${sign}` : ""}`;
  };

  const fetchDirs = async () => {
    setLoading(true);
    try {
      const res: any = await getImageDirApi();
      if (res.code === 200) {
        setDirs(res.data);
      }
    } catch (error) {
      message.error("获取目录失败");
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async (
    dirName: string,
    currentPage: number,
    append = false
  ) => {
    if (!dirName) return;
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    try {
      const res: any = await getNoteFileListApi({
        path: `/opt/openlist/data/notes/图库/${dirName}/`,
        page: currentPage,
        per_page: pageSize,
      });
      if (res.code === 200) {
        const content = res.data.content || [];
        const newImages = content.filter((item: any) => !item.is_dir);

        if (append) {
          setImages((prev) => [...prev, ...newImages]);
        } else {
          setImages(newImages);
        }

        setHasMore(newImages.length >= pageSize);
        setPage(currentPage);
      }
    } catch (error) {
      message.error("获取图片列表失败");
    } finally {
      if (append) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  };

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore && currentDir) {
      fetchImages(currentDir, page + 1, true);
    }
  }, [loadingMore, hasMore, currentDir, page]);

  useEffect(() => {
    fetchDirs();
  }, []);

  const handleEnterDir = (dirName: string) => {
    setCurrentDir(dirName);
    setPage(1);
    setHasMore(true);
    setImages([]);
    fetchImages(dirName, 1);
  };

  const handleBackToDirs = () => {
    setCurrentDir("");
    setImages([]);
    setPage(1);
    setHasMore(true);
  };

  const handlePreview = async (item: ImageItem) => {
    setPreviewImage(item);
    const url = getImageUrl(item.path, item.sign);
    setPreviewUrl(url);
    setPreviewVisible(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(previewUrl)
      .then(() => {
        message.success("链接已复制到剪贴板");
      })
      .catch(() => {
        message.error("复制失败");
      });
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = previewUrl;
    link.download = previewImage?.name || "image";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainWrapper}>
        {currentDir && (
          <div className={styles.breadcrumb}>
            <span className={styles.crumbLink} onClick={handleBackToDirs}>
              图库首页
            </span>
            <span className={styles.crumbSeparator}>/</span>
            <span className={styles.crumbCurrent}>{currentDir}</span>
          </div>
        )}

        <div className={styles.content}>
          {loading ? (
            <div className={styles.loading}>
              <Spin size="large" />
              <div>加载中...</div>
            </div>
          ) : !currentDir ? (
            <>
              <div className={styles.sectionHeader}>
                <div className={styles.title}>
                  <FolderFilled />
                  全部分类
                  <span className={styles.count}>{dirs.length} 个</span>
                </div>
              </div>
              <div className={styles.dirGrid}>
                {dirs.map((dir) => (
                  <div
                    key={dir.name}
                    className={styles.dirCard}
                    onClick={() => handleEnterDir(dir.name)}
                  >
                    <div className={styles.dirIcon}>
                      <FolderFilled />
                    </div>
                    <div className={styles.dirName}>{dir.name}</div>
                    <div className={styles.dirDate}>
                      <CalendarOutlined style={{ marginRight: 4 }} />
                      {formatDate(dir.modified)}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : images.length > 0 ? (
            <div className={styles.masonryGrid}>
              <div className={styles.sectionHeader}>
                <div className={styles.title}>
                  <FolderFilled />
                  {currentDir}
                  <span className={styles.count}>{images.length} 张</span>
                </div>
              </div>
              <Masonry
                columns={{ xs: 2, sm: 3, md: 4, lg: 5 }}
                gutter={12}
                items={images.map((img, index) => ({
                  key: img.path || index,
                  data: img,
                }))}
                itemRender={({ data: img }) => (
                  <div
                    className={styles.imageItem}
                    onClick={() => handlePreview(img)}
                  >
                    <img
                      src={getImageUrl(img.path, img.sign)}
                      alt={img.name}
                      loading="lazy"
                    />
                  </div>
                )}
              />
              {hasMore && (
                <div className={styles.loadMoreWrapper}>
                  <Button
                    type="primary"
                    loading={loadingMore}
                    onClick={loadMore}
                    className={styles.loadMoreBtn}
                  >
                    加载更多
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.empty}>
              <Empty description="该目录下没有图片" />
            </div>
          )}
        </div>
      </div>

      <Modal
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        closable
        width="700px"
        className={styles.previewModal}
      >
        <div className={styles.previewWrapper}>
          <img
            src={previewUrl}
            alt={previewImage?.name}
            className={styles.previewImage}
          />
          <div className={styles.previewActions}>
            <Button
              className={styles.previewActionBtn}
              icon={<CopyOutlined />}
              onClick={handleCopyLink}
            >
              复制链接
            </Button>
            <Button
              className={styles.previewActionBtn}
              icon={<DownloadOutlined />}
              onClick={handleDownload}
            >
              下载
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
