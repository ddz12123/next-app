import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";

// 创建接口定义，方便类型检查
export interface RequestConfig extends AxiosRequestConfig {
  // 是否跳过token验证（默认false）
  skipAuth?: boolean;
  // 是否显示错误消息（默认true）
  showError?: boolean;
  // 是否显示成功消息（默认false）
  showSuccess?: boolean;
  // 自定义错误消息
  errorMessage?: string;
  // 自定义成功消息
  successMessage?: string;
}

export interface CustomResponse<T = never> {
  code: number;
  data: T;
  message: string;
}

const API_BASE_URL = "";

// 创建axios实例
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30秒超时
    headers: {
      "Content-Type": "application/json",
    },
  });

  // 请求拦截器
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // 类型断言为包含自定义属性的配置
      const requestConfig = config as InternalAxiosRequestConfig & {
        skipAuth?: boolean;
      };

      // 从请求配置中获取自定义设置
      const skipAuth = (config as unknown as RequestConfig).skipAuth;

      // 添加token（除非明确跳过）
      if (!skipAuth) {
        const token = "";
        if (token) {
          requestConfig.headers.Authorization = `Bearer ${token}`;
        }
      }

      // 添加请求时间戳（防止缓存）
      requestConfig.headers["X-Timestamp"] = Date.now();

      // 如果是文件上传，修改Content-Type
      if (config.data instanceof FormData) {
        requestConfig.headers["Content-Type"] = "multipart/form-data";
      }

      // 添加自定义请求头
      requestConfig.headers["X-Requested-With"] = "XMLHttpRequest";
      requestConfig.headers["X-Client"] = "web";

      return requestConfig;
    },
    (error: AxiosError) => {
      console.error("请求拦截器错误:", error);
      return Promise.reject(error);
    },
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // 处理文件下载等特殊响应
      if (response.config.responseType === "blob") {
        return response;
      }

      const data = response.data as CustomResponse;

      // 根据业务逻辑处理响应
      if (data && typeof data === "object") {
        // 如果业务返回了错误码（非200）
        if (data.code !== undefined && data.code !== 200) {
          // 处理token过期
          if (data.code === 401) {
            // 跳转到登录页
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
          }

          // 显示错误消息
          const requestConfig = response.config as RequestConfig;
          if (requestConfig.showError !== false) {
            showMessage(
              requestConfig.errorMessage || data.message || "请求失败",
              "error",
            );
          }

          return Promise.reject(new Error(data.message || "请求失败"));
        }

        // 显示成功消息
        const requestConfig = response.config as RequestConfig;
        if (requestConfig.showSuccess && data.message) {
          showMessage(requestConfig.successMessage || data.message, "success");
        }

        // 直接返回data数据
        return data;
      }

      return response.data;
    },
    (error: AxiosError) => {
      console.error("响应拦截器错误:", error);

      // 处理网络错误
      if (!error.response) {
        showMessage("网络连接失败，请检查网络设置", "error");
        return Promise.reject(error);
      }

      // 处理HTTP状态码错误
      const status = error.response?.status;
      const requestConfig = error.config as RequestConfig;

      switch (status) {
        case 400:
          showMessage(requestConfig.errorMessage || "请求参数错误", "error");
          break;
        case 401:
          if (typeof window !== "undefined") {
            window.location.href = "/login";
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
    },
  );

  return instance;
};

// 消息提示函数（可根据UI库调整）
const showMessage = (
  message: string,
  type: "success" | "error" | "warning" | "info",
) => {
  if (typeof window !== "undefined") {
    // 这里可以使用你项目中的UI组件，如Antd的message、Toast等
    console.log(`${type}: ${message}`);

    // 示例：使用浏览器的alert
    // if (type === 'error') {
    //   alert(message);
    // }

    // 或者使用第三方通知库
    // import { toast } from 'react-hot-toast';
    // toast[type](message);
  }
};

// 导出创建的实例
export const axiosInstance = createAxiosInstance();
