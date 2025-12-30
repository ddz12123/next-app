// 根目录/proxy.ts（全局鉴权 Proxy）
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { TOKEN_KEY } from "@/utils/storage";

// 定义需要登录的受保护路由
const whiteList = ["/login", "/"];

export function proxy(request: NextRequest) {
  // console.log("request-->", request);
  const { pathname } = request.nextUrl;
  //console.log("pathname-->", pathname);

  // 1. 获取 Token（优先从 Cookie 获取，这是 SSR 和 Middleware 唯一可靠的来源）
  const token = request.cookies.get(TOKEN_KEY)?.value;

  // 2. 判断是否访问受保护路由
  const isWhiteList = whiteList.some((route) =>
    pathname.startsWith(route)
  );

  // 3. 鉴权逻辑
  if (!isWhiteList) {
    if (!token) {
      // 未登录 → 跳转登录页
      const baseUrl=process.env.NEXT_PUBLIC_BASE_PATH;
      const loginUrl = new URL(baseUrl+"/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 4. 已登录用户访问登录页 → 重定向到首页
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 5. 放行
  return NextResponse.next();
}

// 配置 Proxy 生效的路由范围
export const config = {
  matcher: [
    /*
     * 匹配所有路径，除了：
     * 1. /api (API 路由)
     * 2. /_next (Next.js 内部资源)
     * 3. /static (静态资源)
     * 4. 常见的静态文件 (favicon.ico, sitemap.xml, robots.txt 等)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
