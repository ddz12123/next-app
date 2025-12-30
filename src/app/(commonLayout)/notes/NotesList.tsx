"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input, Select, Pagination, ConfigProvider, Space, Spin, Breadcrumb } from "antd";
import {
  SearchOutlined,
  FileTextOutlined,
  CalendarOutlined,
  ArrowRightOutlined,
  FolderOutlined,
  FileTextOutlined as FileOutlined,
  HomeOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Button, Tooltip, Radio } from "antd";
import styles from "./notes.module.scss";
import {
  getNoteDirApi,
  getNoteFileListApi,
} from "@/request/notes/note-api";

const { Search } = Input;

interface Note {
  created: string;
  modified: string;
  name: string;
  path: string;
  size: number;
  is_dir: boolean;
}

interface Directory {
  modified: string;
  name: string;
}

interface NotesListProps {
  initialNotes?: Note[];
}

export default function NotesList({ initialNotes }: NotesListProps) {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>(initialNotes || []);
  const [loading, setLoading] = useState(!initialNotes);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentSubPath, setCurrentSubPath] = useState<string[]>([]); // New state for subdirectories
  const [currentPage, setCurrentPage] = useState(1);
  const [directories, setDirectories] = useState<Directory[]>([]);
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const pageSize = 20;

  const getDirList = async () => {
    try {
      const res = await getNoteDirApi();
      if (res.code === 200 && res.data && res.data.length > 0) {
        setDirectories(res.data);
        // Only set default category if not already set (though logic below might override)
        if (!selectedCategory) {
            setSelectedCategory(res.data[0].name);
        }
      }
    } catch (error) {
      console.error("Failed to fetch directory list:", error);
    }
  };

  // Fetch notes based on category and current subpath
  const fetchNotes = async () => {
    if (!selectedCategory) return;
    try {
      setLoading(true);
      // Construct path: base + category + subpath
      const subPathString = currentSubPath.length > 0 ? `${currentSubPath.join("/")}/` : "";
      const fullPath = `/opt/openlist/data/notes/笔记/${selectedCategory}/${subPathString}`;

      const res = await getNoteFileListApi({
        path: fullPath,
        page: currentPage,
        per_page: pageSize,
      });
      if (res.code === 200 && res.data) {
        setNotes(res.data.content);
        setTotal(res.data.total);
      } else {
        setNotes([]);
        setTotal(0);
      }
    } catch (error) {
      console.error("Failed to fetch note list:", error);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const getNoteTitle = (name: string | undefined): string => {
    if (!name) return "未命名";
    // If it's a directory, return name as is
    // We don't have is_dir info here easily without passing the whole object or checking context, 
    // but usually we call this with note.name. 
    // Let's assume for now we might need to adjust logic if folders have extensions (unlikely).
    // But safely:
    const parts = name.split(".");
    return parts.length > 1 ? parts.slice(0, -1).join(".") : name;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  useEffect(() => {
    getDirList();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchNotes();
    }
  }, [currentPage, selectedCategory, currentSubPath]);

  const allCategories = useMemo(() => {
    return directories.map((dir) => dir.name).sort();
  }, [directories]);

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesSearch =
        searchText === "" ||
        note.name.toLowerCase().includes(searchText.toLowerCase());

      // Note: note.path filtering is tricky if we are in a subdir.
      // But fetchNotes already gets the correct list for the current directory.
      // So we mainly just need to filter by search text.
      // The previous logic filtered by selectedCategory in path, which is still valid but implicitly handled by API now.
      
      return matchesSearch;
    });
  }, [notes, searchText]);

  const displayNotes = searchText ? filteredNotes : notes;
  const displayTotal = searchText ? filteredNotes.length : total;

  const handleSearch = (value: string) => {
    setSearchText(value);
    if (value) {
      setCurrentPage(1);
    }
  };

  const handleCategoryChange = (value: string) => {
    if (value !== selectedCategory) {
        setSelectedCategory(value);
        setCurrentSubPath([]); // Reset subpath when category changes
        setCurrentPage(1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemClick = (note: Note) => {
    if (note.is_dir) {
        // Enter directory
        setCurrentSubPath([...currentSubPath, note.name]);
        setCurrentPage(1);
    } else {
        // Open note
        router.push(`/notes/details?path=${encodeURIComponent(note.path)}`);
    }
  };

  const handleBreadcrumbClick = (index: number) => {
      // index -1 means root (category)
      // index 0 means first subfolder, etc.
      if (index === -1) {
          setCurrentSubPath([]);
      } else {
          setCurrentSubPath(currentSubPath.slice(0, index + 1));
      }
      setCurrentPage(1);
  };

  const breadcrumbItems = useMemo(() => {
      const items = [
          {
              title: (
                <span 
                    onClick={() => handleBreadcrumbClick(-1)} 
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                    <HomeOutlined style={{ marginRight: 4 }} />
                    {selectedCategory}
                </span>
              ),
          }
      ];

      currentSubPath.forEach((path, index) => {
          items.push({
              title: (
                <span 
                    onClick={() => handleBreadcrumbClick(index)}
                    style={{ cursor: 'pointer' }}
                >
                    {path}
                </span>
              ),
          });
      });
      return items;
  }, [selectedCategory, currentSubPath]);


  return (
    <div className={styles.notesContainer}>
      <div className={styles.mainWrapper}>
        <header className={styles.header}>
          <h1 className={styles.title}>开发笔记</h1>
          <p className={styles.subtitle}>
            记录点滴成长，分享技术心得，探索编程世界的无限可能
          </p>
        </header>

        <div className={styles.searchSection}>
          <Space.Compact className={styles.searchCompact}>
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className={styles.categorySelect}
              size="large"
              options={allCategories.map((cat) => ({ value: cat, label: cat }))}
            />
            <Search
              placeholder="搜索笔记标题或内容..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={handleSearch}
              className={styles.searchInput}
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
                {directories.map((dir) => (
                  <a
                    key={dir.name}
                    className={`${styles.categoryItem} ${selectedCategory === dir.name ? styles.active : ""}`}
                    onClick={() => handleCategoryChange(dir.name)}
                  >
                    <span>{dir.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </aside>

          <main className={styles.mainContent}>
            <div className={styles.contentCard}>
              {/* Breadcrumb Navigation and View Mode Toggle */}
              <div className={styles.breadcrumbWrapper}>
                <div style={{ flex: 1 }}>
                  <Breadcrumb items={breadcrumbItems} />
                </div>
                <Radio.Group 
                  value={viewMode} 
                  onChange={(e) => setViewMode(e.target.value)}
                  size="small"
                  buttonStyle="solid"
                >
                  <Tooltip title="网格模式">
                    <Radio.Button value="grid">
                      <AppstoreOutlined />
                    </Radio.Button>
                  </Tooltip>
                  <Tooltip title="列表模式">
                    <Radio.Button value="list">
                      <UnorderedListOutlined />
                    </Radio.Button>
                  </Tooltip>
                </Radio.Group>
              </div>

              <div className={styles.scrollArea}>
                {loading ? (
                  <div className={styles.empty}>
                    <div className={styles.emptyIcon}>
                      <Spin size="large" />
                    </div>
                    <div className={styles.emptyTitle}>加载中...</div>
                  </div>
                ) : displayNotes.length === 0 ? (
                  <div className={styles.empty}>
                    <div className={styles.emptyIcon}>
                      <FileTextOutlined
                        style={{ fontSize: "48px", color: "#94a3b8" }}
                      />
                    </div>
                    <div className={styles.emptyTitle}>暂无内容</div>
                    <div className={styles.emptyDescription}>
                      {searchText !== ""
                        ? "没有找到匹配的内容，试试其他关键词或筛选条件"
                        : "该目录下暂无内容"}
                    </div>
                  </div>
                ) : (
                  <>
                    {/* 目录内容渲染 */}
                    {displayNotes.some((n) => n.is_dir) && (
                      <div className={`${viewMode === "grid" ? styles.cardGrid : styles.folderListSection} ${viewMode === "grid" ? styles.folderGrid : ""}`}>
                        {displayNotes
                          .filter((n) => n.is_dir)
                          .map((note, index) => (
                            <div
                              key={`folder-${index}`}
                              className={viewMode === "grid" ? styles.noteCard : styles.folderItem}
                              onClick={() => handleItemClick(note)}
                            >
                              {viewMode === "grid" ? (
                                <>
                                  <div className={styles.cardMain}>
                                    <div className={styles.cardHeader}>
                                      <div className={`${styles.cardIcon} ${styles.folderIcon}`}>
                                        <FolderOutlined />
                                      </div>
                                      <h3 className={styles.cardTitle}>{note.name}</h3>
                                    </div>
                                    <div className={styles.cardMeta}>
                                      <span className={styles.metaItem}>
                                        <CalendarOutlined />
                                        {new Date(note.modified).toLocaleDateString("zh-CN")}
                                      </span>
                                      <span className={styles.tag}>Directory</span>
                                    </div>
                                  </div>
                                  <div className={styles.cardAction}>
                                    <span>进入目录</span>
                                    <ArrowRightOutlined />
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className={styles.folderIcon}>
                                    <FolderOutlined />
                                  </div>
                                  <span className={styles.folderName}>{note.name}</span>
                                  <span className={styles.folderMeta}>
                                    {new Date(note.modified).toLocaleDateString("zh-CN")}
                                  </span>
                                  <ArrowRightOutlined className={styles.folderArrow} />
                                </>
                              )}
                            </div>
                          ))}
                      </div>
                    )}

                    {/* 文章内容渲染 */}
                    {displayNotes.some((n) => !n.is_dir) && (
                      <div className={`${styles.cardGrid} ${viewMode === "list" ? styles.listView : ""}`}>
                        {displayNotes
                          .filter((n) => !n.is_dir)
                          .map((note, index) => (
                            <div
                              key={`note-${index}`}
                              className={styles.noteCard}
                              onClick={() => handleItemClick(note)}
                            >
                              <div className={styles.cardMain}>
                                <div className={styles.cardHeader}>
                                  <div className={styles.cardIcon}>
                                    <FileTextOutlined />
                                  </div>
                                  <h3 className={styles.cardTitle}>
                                    {getNoteTitle(note.name)}
                                  </h3>
                                </div>
                                <div className={styles.cardMeta}>
                                  <span className={styles.metaItem}>
                                    <CalendarOutlined />
                                    {new Date(note.modified).toLocaleDateString(
                                      "zh-CN",
                                      viewMode === "grid" 
                                        ? { year: "numeric", month: "long", day: "numeric" }
                                        : { year: "numeric", month: "2-digit", day: "2-digit" }
                                    )}
                                  </span>
                                  <span className={styles.metaItem}>
                                    <FileOutlined />
                                    {formatFileSize(note.size)}
                                  </span>
                                  {viewMode === 'grid' && <span className={styles.tag}>Local</span>}
                                </div>
                              </div>
                              <div className={styles.cardAction}>
                                <span>查看详情</span>
                                <ArrowRightOutlined />
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className={styles.paginationWrapper}>
                <div style={{ color: "#64748b", fontSize: "14px" }}>
                  共 <span style={{ color: "#3b82f6", fontWeight: 600 }}>{displayTotal}</span> 项内容
                </div>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: "#3b82f6",
                    },
                  }}
                >
                  <Pagination
                    current={currentPage}
                    total={displayTotal}
                    pageSize={pageSize}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showQuickJumper
                    size="small"
                  />
                </ConfigProvider>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
