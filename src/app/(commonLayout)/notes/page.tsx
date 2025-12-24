import { getAllNotes } from "@/lib/mdx";
import NotesList from "./NotesList";

export const metadata = {
  title: "笔记 | Notes",
  description: "这里记录了我的学习心得和技术分享",
};

export default async function NotesPage() {
  const notes = await getAllNotes();
  return <NotesList initialNotes={notes} />;
}
