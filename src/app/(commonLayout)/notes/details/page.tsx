import { Note, getNoteBySlug } from "@/lib/mdx";
import { notFound } from "next/navigation";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  FolderOutlined,
  TagOutlined,
  FileTextOutlined,
  CloudOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { getNoteContentApi } from "@/request/notes/note-api";
import Link from "next/link";

import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode, {
  LineElement,
  CharsElement,
} from "rehype-pretty-code";
import rehypeCopyCode from "@/lib/rehype-copy-code";
import CopyButtonHandler from "./components/CopyButtonHandler";
import LeftSidebar from "./components/LeftSidebar";
import RightSidebar from "./components/RightSidebar";
import MobileTOCWrapper from "./components/MobileTOCWrapper";
import MDXContent from "./components/MDXContent";
import styles from "./noteDetail.module.scss";
import "./code-themes.css";
import { DEFAULT_THEME } from "@/config/theme";

interface PageProps {
  params?: Promise<{ slug: string }>;
  searchParams?: Promise<{ path?: string }>;
  note?: Note;
  path?: string;
}

export default async function NotePage({
  params,
  searchParams,
  note,
  path,
}: PageProps) {
  let noteData = note;
  let notePath = path;

  if (!notePath && searchParams) {
    const { path: searchPath } = await searchParams;
    if (searchPath) {
      notePath = searchPath;
    }
  }

  if (!noteData && notePath) {
    const res = await getNoteContentApi(notePath);
    if (res.code === 200 && res.data && res.data.raw_url) {
      let content = "";
      try {
        const response = await fetch(res.data.raw_url);
        if (response.ok) {
          content = await response.text();
        }
      } catch (error) {
        console.error("Failed to fetch markdown content:", error);
        notFound();
      }

      const lines = content.split("\n");
      let title = res.data.name.replace(/\.md$/, "") || "未命名笔记";
      let bodyContent = content;

      if (lines.length > 0 && lines[0].startsWith("#")) {
        const firstLineTitle = lines[0].replace(/^#+\s*/, "").trim();
        if (firstLineTitle) {
          title = firstLineTitle;
          bodyContent = lines.slice(1).join("\n").trim();
        }
      }

      const pathParts = res.data.path.split("/");
      const category = pathParts[pathParts.length - 2] || "未分类";

      noteData = {
        slug: notePath,
        content: bodyContent,
        frontmatter: {
          title,
          date: res.data.modified || new Date().toISOString(),
          created: res.data.created,
          category,
          size: res.data.size,
          provider: res.data.provider,
        },
      };
    } else {
      notFound();
    }
  }

  if (!noteData && params) {
    const { slug } = await params;
    if (slug) {
      noteData = (await getNoteBySlug(slug)) ?? undefined;
    }
  }

  if (!noteData) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };


  return (
    <div className={styles.noteDetailContainer}>
      <CopyButtonHandler />
      <div className={styles.layoutContainer}>
        <LeftSidebar />
        <main className={styles.mainContent}>
          <div className={styles.contentWrapper}>
            <Link href="/notes" className={styles.mobileBackButton}>
              <ArrowLeftOutlined className={styles.mobileBackIcon} />
              返回笔记列表
            </Link>
            <MobileTOCWrapper />
            <article className={styles.article}>
              <header className={styles.articleHeader}>
                <h1 className={styles.articleTitle}>
                  {noteData.frontmatter.title}
                </h1>
                <div className={styles.headerMeta}>
                  <span className={styles.date}>
                    <CalendarOutlined />
                    {formatDate(noteData.frontmatter.date)}
                  </span>
                  {noteData.frontmatter.category && (
                    <span className={styles.category}>
                      <FolderOutlined />
                      {noteData.frontmatter.category}
                    </span>
                  )}
                  {noteData.frontmatter.size && (
                    <span className={styles.metaItem}>
                      <FileTextOutlined />
                      {formatFileSize(noteData.frontmatter.size)}
                    </span>
                  )}
                  {noteData.frontmatter.provider && (
                    <span className={styles.metaItem}>
                      <CloudOutlined />
                      {noteData.frontmatter.provider}
                    </span>
                  )}
                  {noteData.frontmatter.tags &&
                    noteData.frontmatter.tags.length > 0 && (
                      <div className={styles.tagsContainer}>
                        <span className={styles.tagsIcon}>
                          <TagOutlined />
                        </span>
                        {noteData.frontmatter.tags.map(
                          (tag: string, index: number) => (
                            <span key={index} className={styles.tag}>
                              {tag}
                            </span>
                          )
                        )}
                      </div>
                    )}
                </div>
              </header>

              <MDXContent>
                <div
                  className={`${styles.articleContent} prose prose-zinc dark:prose-invert prose-lg max-w-none`}
                >
                  <MDXRemote
                    source={noteData.content}
                    options={{
                      mdxOptions: {
                        remarkPlugins: [remarkGfm],
                        rehypePlugins: [
                          [
                            rehypePrettyCode,
                            {
                              theme: DEFAULT_THEME,
                              grid: false,
                              onVisitLine(node: LineElement) {
                                if (node.children.length === 0) {
                                  node.children = [
                                    { type: "text", value: " " },
                                  ];
                                }
                              },
                              onVisitHighlightedChars(node: CharsElement) {
                                node.properties.className = ["highlighted"];
                              },
                              onVisitHighlightedLine(node: LineElement) {
                                if (!node.properties.className) {
                                  node.properties.className = [];
                                }
                                node.properties.className.push(
                                  "line--highlighted"
                                );
                              },
                            },
                          ],
                          [rehypeCopyCode, { copyButtonText: "复制代码" }],
                        ],
                      },
                    }}
                  />
                </div>
              </MDXContent>

              <footer className={styles.articleFooter}>
                <div className={styles.footerContent}>
                  <div className={styles.footerIcon}>
                    <ClockCircleOutlined />
                  </div>
                  <div className={styles.footerText}>感谢阅读</div>
                </div>
              </footer>
            </article>
          </div>
        </main>
        <RightSidebar />
      </div>
    </div>
  );
}
