import { post } from "@/utils/request";

interface NoteDirData {
  path?: string;
  page?: number;
  per_page?: number;
}

// 获取笔记目录
export async function getNoteDirApi() {
  return await post("/openlist/fs/dirs",{
    path: "/opt/openlist/data/notes/笔记/",
  });
}

// 获取图库目录
export async function getImageDirApi() {
  return await post("/openlist/fs/dirs", {
    path: "/opt/openlist/data/notes/图库/",
  });
}

// 获取笔记目录下的文件列表
export async function getNoteFileListApi(data: NoteDirData) {
  return await post("/openlist/fs/list",data);
}

// 获取笔记内容
export async function getNoteContentApi(path: string) {
  return await post("/openlist/fs/get",{
    path,
  });
}
