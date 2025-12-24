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
    url: "http://47.119.182.242/hello-world.md",
  },
  {
    slug: "docker-guide",
    title: "docker开发指南",
    date: "2024-12-23",
    description: "深入了解 docker的核心概念和最佳实践",
    tags: ["Next.js", "docker", "前端"],
    category: "技术",
    url: "http://47.119.182.242/docker.md",
  },
];

export async function getAllNotes(): Promise<NoteListItem[]> {
  return mockNotes;
}

export async function getNoteBySlug(slug: string): Promise<Note | null> {
  const note = mockNotes.find((n) => n.slug === slug);
  if (!note) {
    return null;
  }

  let content = "";
  try {
    const response = await fetch(note.url);
    if (response.ok) {
      content = await response.text();
    }
  } catch (error) {
    console.error("Failed to fetch markdown content:", error);
  }

  return {
    slug: note.slug,
    content,
    frontmatter: {
      title: note.title,
      date: note.date,
      description: note.description,
      tags: note.tags,
      category: note.category,
    },
  };
}
