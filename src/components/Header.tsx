"use client";
import { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Space,
  Dropdown,
  Layout,
  Drawer,
  Divider,
} from "antd";
import {
  FolderOpenOutlined,
  FileTextOutlined,
  EditOutlined,
  RobotOutlined,
  UserOutlined,
  MenuOutlined,
  HomeOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import styles from "./Header.module.scss";
import clsx from "clsx";
import type { MenuProps } from "antd";
import { useAppStore } from "@/store/appStore";
import { useRouter, usePathname } from "next/navigation";

const { Text } = Typography;
const { Header } = Layout;

export default function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navItems, setNavItems] = useState([
    {
      key: "workspace",
      label: "工作中心",
      icon: <HomeOutlined />,
      path: "/work-space",
    },
    {
      key: "files",
      label: "文件中心",
      icon: <FolderOpenOutlined />,
      path: "/files",
    },
    {
      key: "notes",
      label: "笔记管理",
      icon: <FileTextOutlined />,
      path: "/notes",
    },
    { key: "blog", label: "写博客", icon: <EditOutlined />, path: "/blog" },
  ]);
  const [moreAppsItems, setMoreAppsItems] = useState<MenuProps["items"]>([
    { key: "calendar", label: "日历" },
    { key: "tasks", label: "任务管理" },
    { key: "mindmap", label: "思维导图" },
    { key: "whiteboard", label: "白板" },
  ]);
  const { appName } = useAppStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // TODO: 从接口获取导航数据
    // const fetchNavData = async () => {
    //   const res = await fetch('/api/nav');
    //   const data = await res.json();
    //   setNavItems(data.navItems);
    //   setMoreAppsItems(data.moreAppsItems);
    // };
    // fetchNavData();
  }, []);

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "个人中心",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "设置",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "退出登录",
      danger: true,
    },
  ];

  const itemClick = (path: string) => {
    //console.log("Navigating to:", path);
    router.push(path);
  };

  const isActive = (path: string) => {
    const active = pathname === path;
    //console.log(`Checking ${path} vs ${pathname}: ${active}`);
    return active;
  };

  const onLogin = () => {
    router.push("/login");
  };

  const onRegister = () => {
    router.push("/register");
  };

  return (
    <>
      <Header
        className={clsx(styles.header, isScrolled && styles.headerScrolled)}
      >
        <div className={styles.headerContent}>
          <div
            className={clsx(styles.logoSection, "cursor-pointer")}
            onClick={() => router.push("/")}
          >
            <div className={styles.logoIcon}>
              <RobotOutlined />
            </div>
            <Text className={styles.logoText}>{appName}</Text>
          </div>
          <div className={styles.navSection}>
            <Space size={4}>
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Button
                    key={item.key}
                    size="large"
                    type="text"
                    className={clsx(
                      styles.navLink,
                      active && styles.navLinkActive
                    )}
                    icon={item.icon}
                    onClick={() => itemClick(item.path)}
                  >
                    {item.label}
                  </Button>
                );
              })}
              <Dropdown
                menu={{ items: moreAppsItems }}
                placement="bottomLeft"
                trigger={["click"]}
              >
                <Button
                  type="text"
                  className={styles.navLink}
                  icon={<AppstoreOutlined />}
                >
                  更多应用
                </Button>
              </Dropdown>
            </Space>
          </div>
          <div className={styles.authSection}>
            <Button
              type="text"
              className={styles.loginButton}
              onClick={onLogin}
            >
              登录
            </Button>
            <Button
              type="primary"
              className={styles.registerButton}
              onClick={onRegister}
            >
              注册
            </Button>
            <Button
              type="text"
              className={clsx(styles.mobileMenuButton)}
              icon={<MenuOutlined />}
              onClick={() => setMobileMenuOpen(true)}
            />
          </div>
        </div>
      </Header>
      <Drawer
        title="导航菜单"
        placement="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        className={styles.mobileDrawer}
      >
        <div className={styles.mobileNavContent}>
          {navItems.map((item) => (
            <Button
              key={item.key}
              type="text"
              className={styles.mobileNavLink}
              icon={item.icon}
              block
            >
              {item.label}
            </Button>
          ))}
          <Divider />
          <Text className={styles.drawerSectionTitle}>更多应用</Text>
          {moreAppsItems?.map((item: any) => (
            <Button
              type="text"
              className={styles.mobileNavLink}
              block
              key={item.key}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </Drawer>
    </>
  );
}
