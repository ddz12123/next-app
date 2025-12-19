// postcss.config.mjs
import postcssPxtorem from "postcss-pxtorem"; // ESM 格式需导入

const config = {
  plugins: {
    // Tailwind 插件（保留原有配置）
    "@tailwindcss/postcss": {},
    // 配置 postcss-pxtorem
    "postcss-pxtorem": {
      rootValue: 16, // 核心：1rem = 16px（按你的基准值设置）
      propList: ["*", "!--tw-*"], // 转换所有属性 + 排除 Tailwind 变量
      selectorBlackList: [], // 无需忽略的选择器（可自定义，如 ['ignore-']）
      replace: true, // 直接替换 px 为 rem，不保留原 px
      mediaQuery: false, // 不处理媒体查询中的 px（可选，按需开启）
      minPixelValue: 10, // 小于 10px 的 px 不转换（避免过小数值）
      exclude: /node_modules/i, // 忽略第三方库（如 antd、element 等）
    },
  },
};

export default config;
