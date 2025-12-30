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
  Avatar,
  message,
} from "antd";
import {
  PictureOutlined,
  FileTextOutlined,
  EditOutlined,
  RobotOutlined,
  UserOutlined,
  MenuOutlined,
  HomeOutlined,
  AppstoreOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import styles from "./Header.module.scss";
import clsx from "clsx";
import type { MenuProps } from "antd";
import { useAppStore } from "@/store/appStore";
import { useUserStore } from "@/store/userStore";
import { useRouter, usePathname } from "next/navigation";
import { getToken } from "@/utils/storage";

const { Text } = Typography;
const { Header } = Layout;

export default function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [activePath, setActivePath] = useState("");
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
      label: "图库",
      icon: <PictureOutlined />,
      path: "/images",
    },
    {
      key: "notes",
      label: "笔记管理",
      icon: <FileTextOutlined />,
      path: "/notes",
    },
    { key: "blog", label: "博客中心", icon: <EditOutlined />, path: "/blog" },
  ]);
  const [moreAppsItems, setMoreAppsItems] = useState<MenuProps["items"]>([
    { key: "whiteboard", label: "白板" },
    { key: "ittools", label: "IT Tools" },
  ]);
  const { appName } = useAppStore();
  const { userInfo, isLogin, fetchUserInfo, logout, checkLoginStatus } = useUserStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // 检查登录状态并同步用户信息
    checkLoginStatus();
  }, [checkLoginStatus, pathname]); // 路径变化时也检查一下，确保状态同步

  useEffect(() => {
    setActivePath(pathname);
  }, [pathname]);

  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'profile') {
      router.push('/user-center');
    } else if (key === 'logout') {
      logout();
      message.success('已退出登录');
      router.push('/login');
    }else if (key === 'settings') {
      router.push('/settings');
    }
  };

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
      icon: <LogoutOutlined />,
      label: "退出登录",
      danger: true,
    },
  ];

  const handleMoreAppsClick = ({ key }: { key: string }) => {
    if (key === "ittools") {
      window.open("http://47.119.182.242:8001", "_blank");
    } else if (key === "whiteboard") {
      window.open("http://47.119.182.242:8002", "_blank");
    }
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
                const isActive =
                  activePath === item.path ||
                  (item.path === "/notes" && activePath?.startsWith("/notes"));
                return (
                  <Button
                    key={item.key}
                    size="large"
                    type="text"
                    className={clsx(
                      styles.navLink,
                      isActive && styles.navLinkActive
                    )}
                    icon={item.icon}
                    onClick={() => router.push(item.path)}
                  >
                    {item.label}
                  </Button>
                );
              })}
              <Dropdown
                menu={{ items: moreAppsItems, onClick: handleMoreAppsClick }}
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
            {isLogin ? (
              <Dropdown
                menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
                placement="bottomRight"
                arrow
              >
                <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 8 }}>
                   <Avatar 
                     src={userInfo?.avatar || undefined} 
                     icon={!userInfo?.avatar && <UserOutlined />}
                     style={{ backgroundColor: userInfo?.avatar ? 'transparent' : '#1890ff' }}
                   />
                   <Text strong style={{ color: isScrolled ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.85)' }}>
                      {userInfo?.nickname || userInfo?.username || 'User'}
                   </Text>
                </div>
              </Dropdown>
            ) : (
              <>
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
              </>
            )}
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
          {isLogin && (
             <div style={{ marginBottom: 16, padding: '0 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar 
                    size="large"
                    src={userInfo?.avatar || undefined} 
                    icon={!userInfo?.avatar && <UserOutlined />}
                    style={{ backgroundColor: userInfo?.avatar ? 'transparent' : '#1890ff' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text strong>{userInfo?.nickname || userInfo?.username}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>{userInfo?.email}</Text>
                </div>
             </div>
          )}
          {navItems.map((item) => {
            const isActive =
              activePath === item.path ||
              (item.path === "/notes" && activePath?.startsWith("/notes"));
            return (
              <Button
                key={item.key}
                type="text"
                className={clsx(
                  styles.mobileNavLink,
                  isActive && styles.mobileNavLinkActive
                )}
                icon={item.icon}
                block
                onClick={() => router.push(item.path)}
              >
                {item.label}
              </Button>
            );
          })}
          <Divider />
          <Text className={styles.drawerSectionTitle}>更多应用</Text>
          {moreAppsItems?.map((item: any) => (
            <Button
              type="text"
              className={styles.mobileNavLink}
              block
              key={item.key}
              onClick={() => handleMoreAppsClick({ key: item.key })}
            >
              {item.label}
            </Button>
          ))}
           {isLogin && (
            <>
              <Divider />
              <Button
                type="text"
                className={styles.mobileNavLink}
                block
                danger
                icon={<LogoutOutlined />}
                onClick={() => {
                    logout();
                    message.success('已退出登录');
                    setMobileMenuOpen(false);
                    router.push('/login');
                }}
              >
                退出登录
              </Button>
            </>
          )}
          {!isLogin && (
             <>
                <Divider />
                 <Button type="primary" block onClick={onLogin} style={{ marginBottom: 12 }}>
                    登录
                 </Button>
                 <Button block onClick={onRegister}>
                    注册
                 </Button>
             </>
          )}
        </div>
      </Drawer>
    </>
  );
}
