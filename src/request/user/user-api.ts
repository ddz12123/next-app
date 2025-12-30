import { get, post, put } from "@/utils/request";

// 获取图形验证码
export async function getCaptchaApi() {
  return await post("/captcha/generate", {
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
  return await post("/auth/login", data);
}

// 获取登录用户信息
export async function getUserInfoApi() {
  return await get("/user/info");
}

export interface UpdateUserInfoData {
  avatar?: string;
  nickname?: string;
  password?: string;
}

// 更新用户信息
export async function updateUserInfoApi(data: UpdateUserInfoData) {
  return await put("/user/update", data);
}
