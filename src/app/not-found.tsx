"use client";
import { Button, Typography, Space } from "antd";
import { HomeOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { motion } from "motion/react";
import styles from "./not-found.module.scss";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

export default function NotFound() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className={styles.code}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          4
          <span className={styles.zero}>0</span>
          4
        </motion.div>
        <motion.div
          className={styles.message}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Title level={3} className={styles.title}>
            页面走丢了
          </Title>
          <Text className={styles.description}>
            抱歉，您访问的页面不存在或已被移除
          </Text>
        </motion.div>
        <motion.div
          className={styles.actions}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Space size={16}>
            <Button
              type="primary"
              size="large"
              icon={<HomeOutlined />}
              onClick={handleGoHome}
              className={styles.primaryButton}
            >
              返回首页
            </Button>
            <Button
              size="large"
              icon={<ArrowLeftOutlined />}
              onClick={() => router.back()}
              className={styles.secondaryButton}
            >
              返回上一页
            </Button>
          </Space>
        </motion.div>
      </motion.div>
      <div className={styles.background}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.blob3} />
      </div>
    </div>
  );
}
