"use client";

import React, { useEffect } from "react";
import {
  Button,
  Card,
  Typography,
  theme,
  Row,
  Col,
  Select,
  ConfigProvider,
} from "antd";
import zhCN from "antd/locale/zh_CN";
import {
  PlusOutlined,
  PictureOutlined,
  FileTextOutlined,
  EditOutlined,
  SettingOutlined,
  BarChartOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/appStore";
import ReactECharts from "echarts-for-react";
import styles from "./work-space.module.scss";

const { Title, Text } = Typography;

type StatItem = {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  path: string;
  trend: string;
};

type QuickAction = {
  title: string;
  icon: React.ReactNode;
  color: string;
  path: string;
};

export default function WorkSpacePage() {
  const router = useRouter();
  const { appName } = useAppStore();
  const { token } = theme.useToken();

  useEffect(() => {
    document.title = "工作中心 | Workspace";
  }, []);

  const statistics: StatItem[] = [
    {
      title: "图片总数",
      value: 128,
      icon: <PictureOutlined />,
      color: "#1890ff",
      path: "/images",
      trend: "+12%",
    },
    {
      title: "笔记总数",
      value: 42,
      icon: <FileTextOutlined />,
      color: "#52c41a",
      path: "/notes",
      trend: "+8%",
    },
    {
      title: "博客文章",
      value: 15,
      icon: <EditOutlined />,
      color: "#722ed1",
      path: "/blog",
      trend: "+5%",
    },
    {
      title: "文件数量",
      value: 256,
      icon: <FolderOpenOutlined />,
      color: "#fa8c16",
      path: "/files",
      trend: "+15%",
    },
  ];

  const quickActions: QuickAction[] = [
    {
      title: "图库",
      icon: <PictureOutlined />,
      color: "#1890ff",
      path: "/images",
    },
    {
      title: "笔记",
      icon: <FileTextOutlined />,
      color: "#52c41a",
      path: "/notes",
    },
    {
      title: "博客",
      icon: <EditOutlined />,
      color: "#722ed1",
      path: "/blog",
    },
    {
      title: "设置",
      icon: <SettingOutlined />,
      color: "#fa8c16",
      path: "/settings",
    },
  ];

  const chartOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      axisLine: {
        lineStyle: {
          color: token.colorTextSecondary,
        },
      },
      axisLabel: {
        color: token.colorTextSecondary,
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        show: false,
      },
      axisLabel: {
        color: token.colorTextSecondary,
      },
      splitLine: {
        lineStyle: {
          color: token.colorBorderSecondary,
          type: "dashed",
        },
      },
    },
    series: [
      {
        name: "图片",
        type: "bar",
        data: [12, 18, 15, 22, 19, 25, 20],
        itemStyle: {
          color: "#1890ff",
          borderRadius: [4, 4, 0, 0],
        },
      },
      {
        name: "笔记",
        type: "bar",
        data: [8, 12, 10, 15, 13, 18, 14],
        itemStyle: {
          color: "#52c41a",
          borderRadius: [4, 4, 0, 0],
        },
      },
      {
        name: "博客",
        type: "bar",
        data: [3, 5, 4, 6, 5, 8, 6],
        itemStyle: {
          color: "#722ed1",
          borderRadius: [4, 4, 0, 0],
        },
      },
    ],
  };

  return (
    <div className={styles.workspaceContainer}>
      <div className={styles.headerSection}>
        <div className={styles.headerContent}>
          <div className={styles.headerText}>
            <Title level={2} className={styles.headerTitle}>
              欢迎回来！
            </Title>
            <Text className={styles.headerSubtitle}>
              欢迎回到 {appName}，开始您的高效创作之旅
            </Text>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            className={styles.createButton}
            onClick={() => router.push("/notes")}
          >
            创建内容
          </Button>
        </div>
      </div>

      <Row gutter={[16, 16]} className={styles.mainContent}>
        <Col xs={24} lg={16} xl={18} xxl={18}>
          <div className={styles.leftColumn}>
            <Row gutter={[16, 16]} className={styles.statsRow}>
              {statistics.map((stat, index) => (
                <Col xs={12} sm={6} md={6} key={index}>
                  <Card
                    className={styles.statCard}
                    hoverable
                    onClick={() => router.push(stat.path)}
                  >
                    <div className={styles.statHeader}>
                      <div
                        className={styles.statIcon}
                        style={{
                          backgroundColor: `${stat.color}15`,
                          color: stat.color,
                        }}
                      >
                        {stat.icon}
                      </div>
                      <span
                        className={styles.statTrend}
                        style={{ color: stat.color }}
                      >
                        {stat.trend}
                      </span>
                    </div>
                    <div className={styles.statContent}>
                      <Text className={styles.statLabel}>{stat.title}</Text>
                      <Title level={3} className={styles.statValue}>
                        {stat.value}
                      </Title>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>

            <Card
              className={styles.chartCard}
              title={
                <span className={styles.cardTitle}>
                  <BarChartOutlined /> 活动趋势
                </span>
              }
            >
              <ReactECharts
                option={chartOption}
                style={{ height: "300px" }}
                opts={{ renderer: "svg" }}
              />
            </Card>
          </div>
        </Col>

        <Col xs={24} lg={8} xl={5} xxl={5}>
          <div className={styles.rightColumn}>
            <Card
              className={styles.quickActionsCard}
              title={
                <span className={styles.cardTitle}>
                  <SettingOutlined /> 便捷入口
                </span>
              }
            >
              <Row gutter={[12, 12]}>
                {quickActions.map((action, index) => (
                  <Col xs={12} sm={12} md={12} key={index}>
                    <div
                      className={styles.quickActionItem}
                      onClick={() => router.push(action.path)}
                    >
                      <div
                        className={styles.quickActionIcon}
                        style={{ color: action.color }}
                      >
                        {action.icon}
                      </div>
                      <Text className={styles.quickActionText}>
                        {action.title}
                      </Text>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}
