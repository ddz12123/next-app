import { post } from "@/utils/request";

export interface UploadData {
  original_name: string;
  file_name: string;
  file_path: string;
  file_size: number;
  content_type: string;
  file_type: string;
  upload_time: string;
  md5_hash: string;
}

// 单文件上传
export async function uploadFileApi(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return await post<UploadData>("/upload/single", formData);
}
