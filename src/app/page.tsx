"use client";
import { useState, useEffect } from "react";
import clsx from "clsx";
import {
  Button,
  Card,
  Col,
  Row,
  Typography,
  Space,
  Divider,
  Affix,
} from "antd";
import {
  FileTextOutlined,
  EditOutlined,
  PictureOutlined,
  RobotOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  ArrowRightOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import { motion } from "motion/react";
import styles from "./home.module.scss";
import AppHeader from "@/components/Header";
import AppFooter from "@/components/Footer";
import { useAppStore } from "@/store/appStore";
import { useRouter } from "next/navigation";

const { Title, Paragraph, Text } = Typography;

export default function HomePage() {
  const router = useRouter();
  const { appName, version } = useAppStore();

  const features = [
    {
      icon: <PictureOutlined className={styles.featureIcon} />,
      title: "图库管理",
      description:
        "智能图片管理，支持瀑布流展示，便捷的预览、复制链接和下载功能",
      color: "#1890ff",
      path: "/images",
    },
    {
      icon: <FileTextOutlined className={styles.featureIcon} />,
      title: "笔记管理",
      description: "结构化笔记系统，支持 Markdown 编辑，AI 辅助整理与搜索",
      color: "#52c41a",
      path: "/notes",
    },
    {
      icon: <EditOutlined className={styles.featureIcon} />,
      title: "博客中心",
      description: "AI 辅助写作，智能生成内容，一键发布分享您的想法",
      color: "#722ed1",
      path: "/blog",
    },
  ];

  const advantages = [
    {
      icon: <RobotOutlined className={styles.advantageIcon} />,
      title: "AI 智能驱动",
      description: "基于先进 AI 模型，提供智能搜索、内容生成、自动分类等功能",
    },
    {
      icon: <ThunderboltOutlined className={styles.advantageIcon} />,
      title: "高效便捷",
      description: "简洁直观的界面设计，瀑布流展示、快速预览，提升工作效率",
    },
    {
      icon: <SafetyOutlined className={styles.advantageIcon} />,
      title: "安全可靠",
      description: "企业级数据安全保障，多重加密保护您的图片、笔记和博客内容",
    },
  ];

  return (
    <div className="position-relative">
      <Affix offsetTop={0}>
        <AppHeader />
      </Affix>
      <div className={clsx(styles.container, "flex flex-col")}>
        <section className={styles.heroSection}>
          <motion.div
            className={styles.heroContent}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className={styles.heroBadge}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <RobotOutlined className={styles.badgeIcon} />
              <Text className={styles.badgeText}>
                {appName} v{version}
              </Text>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Title level={1} className={styles.heroTitle}>
                智能知识库，让知识更有价值
              </Title>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Paragraph className={styles.heroDescription}>
                集图库管理、笔记记录、博客创作于一体，AI
                赋能，让您的知识管理更高效、更智能
              </Paragraph>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Space size="large" className={styles.heroActions}>
                <Button
                  type="primary"
                  size="large"
                  icon={<ArrowRightOutlined />}
                  onClick={() => router.push("/work-space")}
                >
                  立即开始
                </Button>
                <Button size="large" onClick={() => router.push("/images")}>
                  了解更多
                </Button>
              </Space>
            </motion.div>
          </motion.div>
          <motion.div
            className={styles.heroIllustration}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              className={styles.illustrationCard}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                  <RobotOutlined />
                </div>
                <div className={styles.cardTitle}>AI 知识库</div>
              </div>
              <div className={styles.cardContent}>
                <motion.div
                  className={styles.cardItem}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, margin: "-100px" }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  onClick={() => router.push("/images")}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    className={styles.itemIcon}
                    style={{ background: "#e6f7ff", color: "#1890ff" }}
                  >
                    <PictureOutlined />
                  </div>
                  <div className={styles.itemText}>图库</div>
                </motion.div>
                <motion.div
                  className={styles.cardItem}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, margin: "-100px" }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  onClick={() => router.push("/notes")}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    className={styles.itemIcon}
                    style={{ background: "#f6ffed", color: "#52c41a" }}
                  >
                    <FileTextOutlined />
                  </div>
                  <div className={styles.itemText}>笔记管理</div>
                </motion.div>
                <motion.div
                  className={styles.cardItem}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, margin: "-100px" }}
                  transition={{ duration: 0.4, delay: 0.7 }}
                  onClick={() => router.push("/blog")}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    className={styles.itemIcon}
                    style={{ background: "#f9f0ff", color: "#722ed1" }}
                  >
                    <EditOutlined />
                  </div>
                  <div className={styles.itemText}>博客中心</div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        <section className={styles.featuresSection}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <Title level={2} className={styles.sectionTitle}>
              核心功能
            </Title>
            <Paragraph className={styles.sectionDescription}>
              强大的功能模块，满足您的各种知识管理需求
            </Paragraph>
          </motion.div>
          <Row gutter={[24, 24]} className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={8} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    hoverable
                    className={styles.featureCard}
                    styles={{
                      body: { padding: "32px 24px" },
                    }}
                    onClick={() => router.push(feature.path)}
                  >
                    <div
                      className={styles.featureIconWrapper}
                      style={{ background: `${feature.color}15` }}
                    >
                      {feature.icon}
                    </div>
                    <Title level={4} className={styles.featureTitle}>
                      {feature.title}
                    </Title>
                    <Paragraph className={styles.featureDescription}>
                      {feature.description}
                    </Paragraph>
                    <Button
                      type="link"
                      className={styles.featureLink}
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(feature.path);
                      }}
                    >
                      了解更多 <ArrowRightOutlined />
                    </Button>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </section>

        <section className={styles.advantagesSection}>
          <div className={styles.advantagesContent}>
            <motion.div
              className={styles.advantagesLeft}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <Title level={2} className={styles.advantagesTitle}>
                为什么选择我们
              </Title>
              <Paragraph className={styles.advantagesDescription}>
                专为知识工作者打造，融合 AI
                技术，让知识管理变得前所未有的简单高效
              </Paragraph>
              <div className={styles.advantagesList}>
                {advantages.map((advantage, index) => (
                  <motion.div
                    key={index}
                    className={styles.advantageItem}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                  >
                    <div className={styles.advantageIconWrapper}>
                      {advantage.icon}
                    </div>
                    <div className={styles.advantageText}>
                      <Title level={5} className={styles.advantageItemTitle}>
                        {advantage.title}
                      </Title>
                      <Paragraph className={styles.advantageItemDescription}>
                        {advantage.description}
                      </Paragraph>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              className={styles.advantagesRight}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.div
                className={styles.statsCard}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>10W+</div>
                  <div className={styles.statLabel}>活跃用户</div>
                </div>
                <Divider className={styles.statDivider} />
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>100M+</div>
                  <div className={styles.statLabel}>文件存储</div>
                </div>
                <Divider className={styles.statDivider} />
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>99.9%</div>
                  <div className={styles.statLabel}>服务可用性</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <motion.div
            className={styles.ctaContent}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <Title level={2} className={styles.ctaTitle}>
              准备好开始了吗？
            </Title>
            <Paragraph className={styles.ctaDescription}>
              立即注册，体验 AI 驱动的知识管理新方式
            </Paragraph>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button
                type="primary"
                size="large"
                className={styles.ctaButton}
                onClick={() => router.push("/work-space")}
              >
                免费开始使用
              </Button>
            </motion.div>
          </motion.div>
        </section>
      </div>
      <AppFooter />
    </div>
  );
}
