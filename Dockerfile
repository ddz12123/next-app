FROM node:24-alpine

# 设置工作目录
WORKDIR /home/app/next-app

# 复制所有文件
COPY . .

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", "server.js"]