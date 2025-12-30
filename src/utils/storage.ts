// 定义 Token 键名（统一维护，避免硬编码）
export const TOKEN_KEY = "auth_token";

/**
 * 存储 Token（仅使用 Cookie，支持 SSR）
 * @param token 要存储的 Token 字符串
 */
export const setToken = (token: string) => {
  if (isClient) {
    // 设置 Cookie，path=/ 确保全站可用，SameSite=Lax 是现代浏览器推荐的默认值
    // 这里使用 document.cookie 可以在客户端直接设置，而不需要通过 API 路由中转
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  }
};

/**
 * 获取 Token
 * @returns Token 字符串 | null
 */
export const getToken = (): string | null => {
  if (isClient) {
    const match = document.cookie.match(new RegExp('(^| )' + TOKEN_KEY + '=([^;]+)'));
    if (match) return match[2];
  }
  return null;
};

/**
 * 清除 Token
 */
export const removeToken = () => {
  if (isClient) {
    document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
};

// 客户端环境判断
export const isClient = typeof window !== "undefined";
