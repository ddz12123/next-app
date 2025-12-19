import { axiosInstance, RequestConfig, CustomResponse } from "./axiosInstance";

// 统一的请求方法封装
class Request {
  // GET请求
  get<T = any>(
    url: string,
    config?: RequestConfig,
  ): Promise<CustomResponse<T>> {
    return axiosInstance.get<T, CustomResponse<T>>(url, config);
  }

  // POST请求
  post<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<CustomResponse<T>> {
    return axiosInstance.post<T, CustomResponse<T>>(url, data, config);
  }

  // PUT请求
  put<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<CustomResponse<T>> {
    return axiosInstance.put<T, CustomResponse<T>>(url, data, config);
  }

  // PATCH请求
  patch<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<CustomResponse<T>> {
    return axiosInstance.patch<T, CustomResponse<T>>(url, data, config);
  }

  // DELETE请求
  delete<T = any>(
    url: string,
    config?: RequestConfig,
  ): Promise<CustomResponse<T>> {
    return axiosInstance.delete<T, CustomResponse<T>>(url, config);
  }

  // 上传文件
  upload<T = any>(
    url: string,
    file: File,
    config?: RequestConfig,
  ): Promise<CustomResponse<T>> {
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
  download(url: string, config?: RequestConfig): Promise<CustomResponse<Blob>> {
    return axiosInstance.get<Blob, CustomResponse<Blob>>(url, {
      ...config,
      responseType: "blob",
    });
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
