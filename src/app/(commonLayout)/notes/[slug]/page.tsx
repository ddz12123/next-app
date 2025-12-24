import { getNoteBySlug, getAllNotes } from "@/lib/mdx";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  TagsOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Affix } from "antd";

import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode, {
  LineElement,
  CharsElement,
} from "rehype-pretty-code";
import rehypeCopyCode from "@/lib/rehype-copy-code";
import ThemeToggle from "./ThemeToggle";
import CopyButtonHandler from "./CopyButtonHandler";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import MDXContent from "./MDXContent";
import styles from "./noteDetail.module.scss";
import "./code-themes.css";
import { DEFAULT_THEME } from "@/config/theme";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const notes = await getAllNotes();
  return notes.map((note) => ({
    slug: note.slug,
  }));
}

export default async function NotePage({ params }: PageProps) {
  const { slug } = await params;
  const note = await getNoteBySlug(slug);

  if (!note) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className={styles.noteDetailContainer}>
      <CopyButtonHandler />
      <div className={styles.layoutContainer}>
        <LeftSidebar />
        <main className={styles.mainContent}>
          <div className={styles.contentWrapper}>
            <article className={styles.article}>
              <header className={styles.articleHeader}>
                <div className={styles.headerMeta}>
                  <span className={styles.date}>
                    <CalendarOutlined />
                    {formatDate(note.frontmatter.date)}
                  </span>
                  {note.frontmatter.category && (
                    <span className={styles.category}>
                      {note.frontmatter.category}
                    </span>
                  )}
                </div>

                <h1 className={styles.articleTitle}>
                  {note.frontmatter.title}
                </h1>

                {note.frontmatter.tags && note.frontmatter.tags.length > 0 && (
                  <div className={styles.tagsContainer}>
                    <TagsOutlined className={styles.tagsIcon} />
                    {note.frontmatter.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </header>

              <MDXContent>
                <div
                  className={`${styles.articleContent} prose prose-zinc dark:prose-invert prose-lg max-w-none`}
                >
                  <MDXRemote
                    source={note.content}
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
        <Affix offsetTop={90}>
          <RightSidebar />
        </Affix>
      </div>
    </div>
  );
}
