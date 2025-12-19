import { axiosInstance, RequestConfig, CustomResponse } from "./axiosInstance";

// 统一的请求方法封装
class Request {
  // GET请求
  async get<T = never>(url: string, config?: RequestConfig): Promise<T> {
    const response = await axiosInstance.get<CustomResponse<T>>(url, config);
    return response.data.data;
  }

  // POST请求
  async post<T = never>(
    url: string,
    data?: never,
    config?: RequestConfig,
  ): Promise<T> {
    const response = await axiosInstance.post<CustomResponse<T>>(
      url,
      data,
      config,
    );
    return response.data.data;
  }

  // PUT请求
  async put<T = never>(
    url: string,
    data?: never,
    config?: RequestConfig,
  ): Promise<T> {
    const response = await axiosInstance.put<CustomResponse<T>>(
      url,
      data,
      config,
    );
    return response.data.data;
  }

  // PATCH请求
  async patch<T = never>(
    url: string,
    data?: never,
    config?: RequestConfig,
  ): Promise<T> {
    const response = await axiosInstance.patch<CustomResponse<T>>(
      url,
      data,
      config,
    );
    return response.data.data;
  }

  // DELETE请求
  async delete<T = never>(url: string, config?: RequestConfig): Promise<T> {
    const response = await axiosInstance.delete<CustomResponse<T>>(url, config);
    return response.data.data;
  }

  // 上传文件
  async upload<T = never>(
    url: string,
    file: File,
    config?: RequestConfig,
  ): Promise<T> {
    const formData = new FormData();
    formData.append("file", file);

    const uploadConfig: RequestConfig = {
      ...config,
      headers: {
        ...config?.headers,
        "Content-Type": "multipart/form-data",
      },
    };

    return this.post<T>(url, formData, uploadConfig);
  }

  // 下载文件
  async download(url: string, config?: RequestConfig): Promise<Blob> {
    const response = await axiosInstance.get<Blob>(url, {
      ...config,
      responseType: "blob",
    });
    return response.data;
  }

  // 设置baseURL
  setBaseURL(baseURL: string): void {
    axiosInstance.defaults.baseURL = baseURL;
  }

  // 设置默认headers
  setDefaultHeaders(headers: Record<string, string>): void {
    axiosInstance.defaults.headers.common = {
      ...axiosInstance.defaults.headers.common,
      ...headers,
    };
  }
}

// 导出实例
export const request = new Request();

// 导出所有方法
export const {
  get,
  post,
  put,
  patch,
  delete: deleteRequest,
  upload,
  download,
  setBaseURL,
  setDefaultHeaders,
} = request;
