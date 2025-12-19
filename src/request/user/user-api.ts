import { post } from "@/src/utils/request";

// 获取图形验证码
export async function getCaptchaApi() {
  return await post("/gin/api/captcha/generate", {
    captcha_type: "math",
    width: 240,
    height: 40,
  });
}

export interface LoginData {
  captcha_id: string;
  captcha_value: string;
  password: string;
  username: string;
}

// 登录
export async function loginApi(data: LoginData) {
  return await post("/gin/api/v1/auth/login", data);
}
