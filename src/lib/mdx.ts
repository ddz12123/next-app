import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const NOTES_PATH = path.join(process.cwd(), 'src/app/(commonLayout)/notes/content');

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
}

export async function getAllNotes(): Promise<NoteListItem[]> {
  if (!fs.existsSync(NOTES_PATH)) {
    return [];
  }

  const files = fs.readdirSync(NOTES_PATH);

  const notes = files
    .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
    .map((file) => {
      const filePath = path.join(NOTES_PATH, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContent);

      return {
        ...data,
        slug: file.replace(/\.mdx?$/, ''),
      } as NoteFrontmatter & { slug: string };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return notes;
}

export async function getNoteBySlug(slug: string): Promise<Note | null> {
  const decodedSlug = decodeURIComponent(slug);
  const mdPath = path.join(NOTES_PATH, `${decodedSlug}.md`);
  const mdxPath = path.join(NOTES_PATH, `${decodedSlug}.mdx`);
  
  let filePath = '';
  if (fs.existsSync(mdPath)) {
    filePath = mdPath;
  } else if (fs.existsSync(mdxPath)) {
    filePath = mdxPath;
  } else {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);

  return {
    slug: decodedSlug,
    content,
    frontmatter: data as NoteFrontmatter,
  };
}
