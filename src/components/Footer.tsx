"use client";
import { Layout, Typography, Space } from "antd";
import { useAppStore } from "@/store/appStore";
import styles from "./Footer.module.scss";

const { Footer } = Layout;
const { Text, Link } = Typography;

export default function AppFooter() {
  const { appName, version, showBeian, beianNumber, icpLicense, policeBeianNumber } =
    useAppStore();

  return (
    <Footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.copyright}>
          <Text className={styles.copyrightText}>
            © {new Date().getFullYear()} {appName}. All rights reserved.
          </Text>
          <Text className={styles.versionText}>v{version}</Text>
        </div>

        {showBeian && (
          <div className={styles.beianInfo}>
            <Space size={16} className={styles.beianLinks}>
              {icpLicense && (
                <Link
                  href={`https://beian.miit.gov.cn/#/queryDetail/${icpLicense}`}
                  target="_blank"
                  className={styles.beianLink}
                >
                  粤ICP备{icpLicense}号
                </Link>
              )}
              {policeBeianNumber && (
                <Link
                  href={`https://www.beian.gov.cn/portal/registerSystemInfo?recordcode=${policeBeianNumber}`}
                  target="_blank"
                  className={styles.beianLink}
                >
                  粤公网安备{policeBeianNumber}号
                </Link>
              )}
              {!icpLicense && beianNumber && (
                <Text className={styles.beianText}>粤ICP备{beianNumber}号</Text>
              )}
            </Space>
          </div>
        )}
      </div>
    </Footer>
  );
}
