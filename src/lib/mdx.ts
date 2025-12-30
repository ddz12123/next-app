

export interface NoteFrontmatter {
  title: string;
  date: string;
  description?: string;
  tags?: string[];
  category?: string;
  [key: string]: any;
}

export interface Note {
  slug: string;
  content: string;
  frontmatter: NoteFrontmatter;
}

export interface NoteListItem extends NoteFrontmatter {
  slug: string;
  url: string;
}

const mockNotes: NoteListItem[] = [
  {
    slug: "hello-world",
    title: "Hello World",
    date: "2024-12-24",
    description: "这是我的第一篇笔记",
    tags: ["示例", "入门"],
    category: "技术",
    url: "http://47.119.182.242:8000/d/opt/openlist/data/notes/%E7%AC%94%E8%AE%B0/%E5%B7%A5%E5%85%B7/%E5%9B%BE%E5%BA%8A.md?sign=3qJ85m9TvrdejPVa_oTZBsF1Qn1NOGDimzHI3q-Mx_g=:0",
  },
  {
    slug: "docker-guide",
    title: "docker开发指南",
    date: "2024-12-23",
    description: "深入了解 docker的核心概念和最佳实践",
    tags: ["Next.js", "docker", "前端"],
    category: "技术",
    url: "http://47.119.182.242:8000/d/opt/openlist/data/notes/%E7%AC%94%E8%AE%B0/%E5%B7%A5%E5%85%B7/%E5%B8%B8%E7%94%A8%E7%BD%91%E7%AB%99.md?sign=iEUptByPvubbSMAbrUkohY7PNYsI6e-WC1QDpOHWGMo=:0d",
  },
];

export async function getAllNotes(): Promise<NoteListItem[]> {
  return mockNotes;
}

export async function getNoteBySlug(url: string): Promise<Note | null> {
  let content = "";
  try {
    const response = await fetch(url);
    if (response.ok) {
      content = await response.text();
    }
  } catch (error) {
    console.error("Failed to fetch markdown content:", error);
    return null;
  }

  const lines = content.split('\n');
  let title = "未命名笔记";
  let bodyContent = content;

  if (lines.length > 0 && lines[0].startsWith('#')) {
    title = lines[0].replace(/^#+\s*/, '').trim();
    bodyContent = lines.slice(1).join('\n').trim();
  }

  return {
    slug: url,
    content: bodyContent,
    frontmatter: {
      title,
      date: new Date().toISOString(),
    },
  };
}
