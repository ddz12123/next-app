// 定义 Token 键名（统一维护，避免硬编码）
export const TOKEN_KEY = "auth_token";

/**
 * 存储 Token 到 localStorage（仅客户端）
 * @param token 要存储的 Token 字符串
 */
export const setToken = (token: string) => {
  if (isClient) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

/**
 * 从 localStorage 获取 Token（仅客户端）
 * @returns Token 字符串 | null
 */
export const getToken = (): string | null => {
  if (isClient) {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

/**
 * 清除 localStorage 中的 Token（仅客户端）
 */
export const removeToken = () => {
  if (isClient) {
    localStorage.removeItem(TOKEN_KEY);
  }
};

// 客户端环境判断（复用）
export const isClient = typeof window !== "undefined";
