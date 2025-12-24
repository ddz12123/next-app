"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Input, Select, Pagination, Empty, ConfigProvider, Space } from "antd";
import {
  SearchOutlined,
  FileTextOutlined,
  CalendarOutlined,
  ArrowRightOutlined,
  TagsOutlined,
  FolderOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import styles from "./notes.module.scss";

const { Search } = Input;

interface Note {
  slug: string;
  title: string;
  description?: string;
  date: string;
  tags?: string[];
  category?: string;
}

interface NotesListProps {
  notes: Note[];
}

export default function NotesList({ notes }: NotesListProps) {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    notes.forEach((note) => {
      if (note.category) {
        categories.add(note.category);
      }
    });
    return Array.from(categories).sort();
  }, [notes]);

  const allTags = useMemo(() => {
    const tags = new Map<string, number>();
    notes.forEach((note) => {
      if (note.tags) {
        note.tags.forEach((tag) => {
          tags.set(tag, (tags.get(tag) || 0) + 1);
        });
      }
    });
    return Array.from(tags.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);
  }, [notes]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    notes.forEach((note) => {
      if (note.category) {
        counts.set(note.category, (counts.get(note.category) || 0) + 1);
      }
    });
    return counts;
  }, [notes]);

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesSearch =
        searchText === "" ||
        note.title.toLowerCase().includes(searchText.toLowerCase()) ||
        (note.description &&
          note.description.toLowerCase().includes(searchText.toLowerCase()));

      const matchesCategory =
        selectedCategory === "all" || note.category === selectedCategory;

      const matchesTag =
        selectedTag === "" || (note.tags && note.tags.includes(selectedTag));

      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [notes, searchText, selectedCategory, selectedTag]);

  const paginatedNotes = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredNotes.slice(startIndex, startIndex + pageSize);
  }, [filteredNotes, currentPage]);

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSelectedTag("");
    setCurrentPage(1);
  };

  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag("");
    } else {
      setSelectedTag(tag);
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles.notesContainer}>
      <div
        style={{ maxWidth: "1400px", margin: "0 auto", padding: "64px 20px" }}
      >
        <header className={styles.header}>
          <h1 className={styles.title}>开发笔记</h1>
          <p className={styles.subtitle}>
            记录点滴成长，分享技术心得，探索编程世界的无限可能
          </p>
        </header>

        <div className={styles.searchSection}>
          <Space.Compact style={{ width: "100%", maxWidth: "800px" }}>
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              style={{ minWidth: 140 }}
              size="large"
              options={[
                { value: "all", label: "全部分类" },
                ...allCategories.map((cat) => ({ value: cat, label: cat })),
              ]}
            />
            <Search
              placeholder="搜索笔记标题或内容..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={handleSearch}
              style={{ flex: 1 }}
            />
          </Space.Compact>
        </div>

        <div className={styles.contentLayout}>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarSection}>
              <div className={styles.sidebarTitle}>
                <FolderOutlined />
                分类目录
              </div>
              <div className={styles.categoryList}>
                <a
                  className={`${styles.categoryItem} ${selectedCategory === "all" ? styles.active : ""}`}
                  onClick={() => handleCategoryChange("all")}
                >
                  <span>全部</span>
                  <span className={styles.count}>{notes.length}</span>
                </a>
                {allCategories.map((category) => (
                  <a
                    key={category}
                    className={`${styles.categoryItem} ${selectedCategory === category ? styles.active : ""}`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    <span>{category}</span>
                    <span className={styles.count}>
                      {categoryCounts.get(category) || 0}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div className={styles.sidebarSection}>
              <div className={styles.sidebarTitle}>
                <TagsOutlined />
                热门标签
              </div>
              <div className={styles.tagCloud}>
                {allTags.map(([tag, count]) => (
                  <span
                    key={tag}
                    className={`${styles.tagCloudItem} ${selectedTag === tag ? styles.active : ""}`}
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag} ({count})
                  </span>
                ))}
              </div>
            </div>
          </aside>

          <main className={styles.mainContent}>
            <div className={styles.cardGrid}>
              {paginatedNotes.length === 0 ? (
                <div className={styles.empty}>
                  <div className={styles.emptyIcon}>
                    <FileTextOutlined
                      style={{ fontSize: "48px", color: "#94a3b8" }}
                    />
                  </div>
                  <div className={styles.emptyTitle}>暂无笔记</div>
                  <div className={styles.emptyDescription}>
                    {searchText !== "" ||
                    selectedCategory !== "all" ||
                    selectedTag !== ""
                      ? "没有找到匹配的笔记，试试其他关键词或筛选条件"
                      : "精彩内容正在准备中，敬请期待..."}
                  </div>
                </div>
              ) : (
                paginatedNotes.map((note) => (
                  <Link
                    key={note.slug}
                    href={`/notes/${note.slug}`}
                    className={styles.noteCard}
                  >
                    <div className={styles.glow} />
                    <div className={styles.cardContent}>
                      <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>{note.title}</h2>
                      </div>

                      {note.description && (
                        <p className={styles.cardDescription}>
                          {note.description}
                        </p>
                      )}

                      <div className={styles.cardMeta}>
                        <span className={styles.date}>
                          <CalendarOutlined />
                          {new Date(note.date).toLocaleDateString("zh-CN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span className={styles.readMore}>
                          阅读更多 <ArrowRightOutlined />
                        </span>
                      </div>

                      {note.tags && note.tags.length > 0 && (
                        <div className={styles.tags}>
                          {note.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className={styles.tag}>
                              {tag}
                            </span>
                          ))}
                          {note.tags.length > 3 && (
                            <span className={styles.moreTags}>
                              +{note.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                ))
              )}
            </div>

            {filteredNotes.length > pageSize && (
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: "#3b82f6",
                  },
                }}
              >
                <div className={styles.pagination}>
                  <Pagination
                    current={currentPage}
                    total={filteredNotes.length}
                    pageSize={pageSize}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total) => `共 ${total} 篇`}
                  />
                </div>
              </ConfigProvider>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
