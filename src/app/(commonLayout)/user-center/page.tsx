"use client";

import { useEffect, useState } from "react";
import { Card, Avatar, Descriptions, Tag, Button, Spin, message, Modal, Form, Input, Upload } from "antd";
import { UserOutlined, EditOutlined, PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { useUserStore } from "@/store/userStore";
import styles from "./user-center.module.scss";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { getToken } from "@/utils/storage";
import { updateUserInfoApi, UpdateUserInfoData } from "@/request/user/user-api";
import { uploadFileApi } from "@/request/upload/upload-api";
import type { RcFile } from "antd/es/upload/interface";

export default function UserCenterPage() {
  const { userInfo, fetchUserInfo } = useUserStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  
  // Avatar Upload State
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  useEffect(() => {
    document.title = "用户中心 | User Center";
  }, []);

  useEffect(() => {
    const init = async () => {
        const token = getToken();
        if (!token) {
            message.warning("请先登录");
            router.push('/login');
            return;
        }
        
        if (!userInfo) {
            await fetchUserInfo();
        }
        setLoading(false);
    };
    init();
  }, [fetchUserInfo, router, userInfo]);

  // Sync userInfo to form when modal opens
  useEffect(() => {
    if (isModalOpen && userInfo) {
        form.setFieldsValue({
            nickname: userInfo.nickname,
            // password is not set back
        });
        setImageUrl(userInfo.avatar);
    }
  }, [isModalOpen, userInfo, form]);

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setAvatarLoading(false);
  };

  const handleOk = async () => {
    try {
        const values = await form.validateFields();
        setConfirmLoading(true);
        
        const updateData: UpdateUserInfoData = {
            nickname: values.nickname,
            avatar: imageUrl,
        };
        
        if (values.password) {
            updateData.password = values.password;
        }

        await updateUserInfoApi(updateData);
        message.success("更新成功");
        await fetchUserInfo();
        setIsModalOpen(false);
    } catch (error) {
        console.error(error);
    } finally {
        setConfirmLoading(false);
    }
  };

  const customUploadRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;
    try {
        setAvatarLoading(true);
        const res = await uploadFileApi(file as File);
        
        if (res.code === 200) {
            const filePath = res.data.file_path;
            
            setImageUrl(filePath);
            onSuccess(res.data);
            message.success("头像上传成功");
        } else {
            onError(new Error(res.msg || "上传失败"));
            message.error(res.msg || "上传失败");
        }
    } catch (err: any) {
        onError(err);
        message.error("上传出错");
    } finally {
        setAvatarLoading(false);
    }
  };

  const beforeUpload = (file: RcFile) => {
    const isImage = /^image\/(jpeg|png|gif|webp|bmp)$/.test(file.type);
    if (!isImage) {
      message.error('只能上传 JPG/PNG/GIF/WEBP/BMP 格式的图片!');
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('图片大小不能超过 10MB!');
    }
    return isImage && isLt10M;
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {avatarLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  if (loading) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <Spin size="large" />
        </div>
    );
  }

  if (!userInfo) {
      return null; // 或者显示错误页
  }

  return (
    <div className={styles.container}>
      <Card variant="borderless">
        <div className={styles.profileHeader}>
          <div className={styles.avatarWrapper}>
            <Avatar 
                size={100} 
                src={userInfo.avatar || undefined} 
                icon={!userInfo.avatar && <UserOutlined />} 
                style={{ backgroundColor: userInfo.avatar ? 'transparent' : '#1890ff' }}
            />
          </div>
          <div className={styles.userInfo}>
            <h1>
              {userInfo.nickname || userInfo.username}
              <Tag color={userInfo.role === "admin" ? "red" : "blue"} className={styles.roleTag}>
                {userInfo.role === "admin" ? "管理员" : "普通用户"}
              </Tag>
            </h1>
            <p style={{ color: '#8c8c8c' }}>{userInfo.email}</p>
            <div style={{ marginTop: 16 }}>
                 <Button type="primary" icon={<EditOutlined />} onClick={handleEditClick}>编辑资料</Button>
            </div>
          </div>
        </div>
        
        <Descriptions title="详细信息" bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }} className={styles.detailCard}>
          <Descriptions.Item label="用户ID">{userInfo.id}</Descriptions.Item>
          <Descriptions.Item label="用户名">{userInfo.username}</Descriptions.Item>
          <Descriptions.Item label="昵称">{userInfo.nickname}</Descriptions.Item>
          <Descriptions.Item label="邮箱">{userInfo.email}</Descriptions.Item>
          <Descriptions.Item label="账号状态">
            <Tag color={userInfo.status === 1 ? "success" : "error"}>
                {userInfo.status === 1 ? "正常" : "禁用"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="注册时间">
            {dayjs(userInfo.created_at).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
           <Descriptions.Item label="最后更新">
            {dayjs(userInfo.updated_at).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Modal
        title="编辑资料"
        open={isModalOpen}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form
            form={form}
            layout="vertical"
            initialValues={{ 
                nickname: userInfo.nickname,
            }}
        >
            <Form.Item label="头像">
                <Upload
                    name="avatar"
                    listType="picture-circle"
                    className="avatar-uploader"
                    showUploadList={false}
                    customRequest={customUploadRequest}
                    beforeUpload={beforeUpload}
                    accept="image/jpeg,image/png,image/gif,image/webp,image/bmp"
                >
                    {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%', borderRadius: '50%' }} /> : uploadButton}
                </Upload>
            </Form.Item>
            <Form.Item
                name="nickname"
                label="昵称"
                rules={[{ required: true, message: '请输入昵称' }]}
            >
                <Input placeholder="请输入昵称" />
            </Form.Item>
            <Form.Item
                name="password"
                label="新密码"
                tooltip="如果不修改密码请留空"
            >
                <Input.Password placeholder="请输入新密码（可选）" />
            </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
