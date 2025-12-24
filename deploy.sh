#!/bin/bash
# deploy.sh - 最简部署脚本

echo "🚀 开始部署..."

# 1. 停止并删除旧容器
echo "停止并删除旧容器..."
docker stop nextjs_app 2>/dev/null || true
docker rm nextjs_app 2>/dev/null || true

# 2. 删除旧镜像
echo "删除旧镜像..."
docker rmi nextjs_app 2>/dev/null || true

# 3. 重新构建和启动
echo "重新构建镜像..."
docker-compose build

echo "启动新容器..."
docker-compose up -d

# 4. 检查状态
sleep 3
if docker ps | grep -q nextjs_app; then
    echo "✅ 部署成功！"
    echo "访问地址: http://localhost:3000"
else
    echo "❌ 部署失败，查看日志:"
    docker-compose logs --tail=10
fi