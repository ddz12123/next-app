"use client";
import clsx from "clsx";
import styles from "./login.module.scss";
import type { FormProps } from "antd";
import { Button, Form, Input, Space } from "antd";
import Image from "next/image";
import {
  LockOutlined,
  UserOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import {
  getCaptchaApi,
  loginApi,
  type LoginData,
} from "@/request/user/user-api";
import { useRouter } from "next/navigation";
import { setToken } from "@/utils/storage";

type FieldType = {
  username?: string;
  password?: string;
  captcha?: string;
};

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function LoginPage() {
  const [captcha, setCaptcha] = useState("");
  const [captchaId, setCaptchaId] = useState("");

  const router = useRouter();

  const getCaptchaHandler = () => {
    getCaptchaApi().then((res) => {
      if (res.code == 200) {
        setCaptcha(res.data.captcha_base64);
        setCaptchaId(res.data.captcha_id);
      }
    });
  };

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values, captchaId);
    const params = {
      captcha_id: captchaId,
      captcha_value: values.captcha,
      username: values.username,
      password: values.password,
    };
    loginApi(params as LoginData).then(async (res) => {
      if (res.code == 200) {
        setToken(res.data.token);
        await fetch("/api/set-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: res.data.token }),
        });
        router.push("/");
      }
    });
  };

  useEffect(() => {
    getCaptchaHandler();
  }, []);
  return (
    <div
      className={clsx(
        "flex flex-col justify-center items-center",
        styles.loginContainer
      )}
    >
      <div className={clsx(styles.loginBox, "flex", "flex-col")}>
        <div className={clsx(styles.leftSection)}>
          <Image
            src="/hub/next-public/images/login/login-box-img.png"
            alt="logo"
            width="360"
            height="360"
          />
        </div>
        <div className={clsx(styles.rightSection)}>
          <div className={clsx(styles.loginFormContent)}>
            <div className={clsx(styles.loginTitle)}>Welcome</div>
            <Form
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              autoComplete="off"
              size={"large"}
              className={clsx("w-9/10")}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: "清先输入用户名" }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="请输入用户名"
                  allowClear
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: "请输入密码" }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="请输入密码"
                  allowClear
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>
              <Form.Item
                name="captcha"
                rules={[{ required: true, message: "请输入验证码" }]}
              >
                <div className={clsx("flex", "flex-row")}>
                  <Input placeholder="请输入验证码" />
                  {captcha ? (
                    <Image
                      src={captcha}
                      alt="captcha"
                      width="120"
                      height="40"
                      style={{ width: "7.5rem" }}
                      className={clsx("ml-2", "cursor-pointer")}
                      onClick={getCaptchaHandler}
                    />
                  ) : null}
                </div>
              </Form.Item>
              <Form.Item>
                <Button block color="default" variant="solid" htmlType="submit">
                  登录
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
