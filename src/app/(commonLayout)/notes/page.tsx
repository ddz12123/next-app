import { getAllNotes, NoteListItem } from "@/lib/mdx";
import NotesList from "./NotesList";
import NoteDetail from "./details/page";

export const metadata = {
  title: "笔记 | Notes",
  description: "这里记录了我的学习心得和技术分享",
};

function transformToNote(item: NoteListItem) {
  return {
    created: item.date,
    modified: item.date,
    name: item.title,
    path: item.slug,
    size: 0,
    is_dir: false,
  };
}

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ path?: string }>;
}) {
  const params = await searchParams;

  if (params.path) {
    return <NoteDetail path={params.path} />;
  }

  const notes = await getAllNotes();
  const transformedNotes = notes.map(transformToNote);
  return <NotesList initialNotes={transformedNotes} />;
}
