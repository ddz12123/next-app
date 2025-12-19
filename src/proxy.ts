// 根目录/proxy.ts（全局鉴权 Proxy）
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { TOKEN_KEY } from "@/src/utils/storage";

// 定义需要登录的受保护路由
const protectedRoutes = ["/dashboard", "/profile", "/settings"];

export function proxy(request: NextRequest) {
  // 1. 获取 Token（从 Cookie）
  const token = request.cookies.get(TOKEN_KEY)?.value;

  // 2. 判断是否访问受保护路由
  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  // 3. 未登录 → 跳转登录页
  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname); // 携带原地址
    return NextResponse.redirect(loginUrl);
  }

  // 4. 放行合法请求
  return NextResponse.next();
}

// 配置 Proxy 生效的路由范围（仅拦截业务路由，排除静态资源）
export const config = {
  matcher: [
    // 排除 API、静态资源、favicon 等，仅拦截页面路由
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
