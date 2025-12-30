import axios from "axios";
import type { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { message as antdMessage } from "antd";
import { getToken, removeToken, TOKEN_KEY } from "@/utils/storage";

const isServer = typeof window === "undefined";

const FULL_API_BASE_URL = process.env.NEXT_PUBLIC_GIN_API_BASE_URL
  ? `${process.env.NEXT_PUBLIC_GIN_API_BASE_URL}/api`
  : "http://localhost:3001/api";
const PROXY_API_URL = "/api";
const baseURL = isServer ? FULL_API_BASE_URL : PROXY_API_URL;

const showMessage = (
  message: string,
  type: "success" | "error" | "warning" | "info",
) => {
  if (typeof window !== "undefined") {
    console.log(`${type}: ${message}`);
    if (type === "error") {
      antdMessage.error(message);
    }
  }
};

const getAuthHeaders = async () => {
  const headers: Record<string, string> = {};
  let token: string | null = null;

  if (isServer) {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      token = cookieStore.get(TOKEN_KEY)?.value || null;
    } catch (e) {
      console.log("Failed to get cookies in SSR:", e);
    }
  } else {
    token = getToken();
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export interface RequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
  showError?: boolean;
  showSuccess?: boolean;
  errorMessage?: string;
  successMessage?: string;
}

export interface CustomResponse<T = never> {
  code: number;
  data: T;
  msg: string;
}

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "X-Client": "web",
  },
});

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const skipAuth = (config as unknown as RequestConfig).skipAuth;

    if (!skipAuth) {
      const authHeaders = await getAuthHeaders();
      Object.assign(config.headers, authHeaders);
    }

    config.headers["X-Timestamp"] = Date.now();

    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }

    return config;
  },
  (error) => {
    console.log("请求拦截器错误:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.config.responseType === "blob") {
      return response;
    }

    const data = response.data as CustomResponse;

    if (data && typeof data === "object") {
      if (data.code !== undefined && data.code !== 200) {
        if (data.code === 401 && typeof window !== "undefined") {
          removeToken();
          window.location.href = "/hub/login";
        }

        const requestConfig = response.config as RequestConfig;
        if (requestConfig.showError !== false) {
          showMessage(
            requestConfig.errorMessage || data.msg || "请求失败",
            "error"
          );
        }
        return Promise.reject(data.msg || "请求失败");
      }

      const requestConfig = response.config as RequestConfig;
      if (requestConfig.showSuccess && data.msg) {
        showMessage(requestConfig.successMessage || data.msg, "success");
      }

      return data;
    }

    return response.data;
  },
  (error) => {
    console.log("响应拦截器错误:", error);

    if (!error.response) {
      showMessage("网络连接失败，请检查网络设置", "error");
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const requestConfig = error.config as RequestConfig;

    switch (status) {
      case 400:
        showMessage(requestConfig.errorMessage || "请求参数错误", "error");
        break;
      case 401:
        if (typeof window !== "undefined") {
          removeToken();
          window.location.href = "/hub/login";
        }
        showMessage("登录已过期，请重新登录", "error");
        break;
      case 403:
        showMessage("没有访问权限", "error");
        break;
      case 404:
        showMessage("请求的资源不存在", "error");
        break;
      case 500:
        showMessage("服务器内部错误", "error");
        break;
      case 502:
      case 503:
      case 504:
        showMessage("服务器暂时不可用", "error");
        break;
      default:
        if (requestConfig.showError !== false) {
          showMessage(requestConfig.errorMessage || "请求失败", "error");
        }
    }

    return Promise.reject(error);
  }
);

class Request {
  get<T = any>(url: string, config?: RequestConfig): Promise<CustomResponse<T>> {
    return axiosInstance.get<T, CustomResponse<T>>(url, config);
  }

  post<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<CustomResponse<T>> {
    return axiosInstance.post<T, CustomResponse<T>>(url, data, config);
  }

  put<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<CustomResponse<T>> {
    return axiosInstance.put<T, CustomResponse<T>>(url, data, config);
  }

  patch<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<CustomResponse<T>> {
    return axiosInstance.patch<T, CustomResponse<T>>(url, data, config);
  }

  delete<T = any>(
    url: string,
    config?: RequestConfig
  ): Promise<CustomResponse<T>> {
    return axiosInstance.delete<T, CustomResponse<T>>(url, config);
  }

  upload<T = any>(
    url: string,
    file: File,
    config?: RequestConfig
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

  download(url: string, config?: RequestConfig): Promise<CustomResponse<Blob>> {
    return axiosInstance.get<Blob, CustomResponse<Blob>>(url, {
      ...config,
      responseType: "blob",
    });
  }

  setBaseURL(baseURL: string): void {
    axiosInstance.defaults.baseURL = baseURL;
  }

  setDefaultHeaders(headers: Record<string, string>): void {
    axiosInstance.defaults.headers.common = {
      ...axiosInstance.defaults.headers.common,
      ...headers,
    };
  }
}

export const request = new Request();

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
