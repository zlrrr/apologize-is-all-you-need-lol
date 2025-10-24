# 服务管理指南

## 服务说明

应用包含3个服务：
- **Mock LM Studio** (端口 1234) - 模拟LLM服务器
- **后端服务器** (端口 5000) - Express API服务器
- **前端服务器** (端口 3000) - Vite开发服务器

## 快速命令

### 启动所有服务

```bash
# 方式1：使用启动脚本（推荐）
./scripts/start.sh

# 方式2：使用npm命令
npm run dev
```

### 停止所有服务

```bash
# 使用停止脚本
./scripts/stop.sh

# 或手动停止
pkill -9 -f "vite"
pkill -9 -f "tsx"

# 或按端口停止
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9
lsof -ti:1234 | xargs kill -9
```

### 重启所有服务

```bash
# 使用重启脚本（推荐）
./scripts/restart.sh

# 或手动重启
./scripts/stop.sh
sleep 2
./scripts/start.sh
```

## 详细操作

### 1. 检查服务状态

```bash
# 检查所有端口
lsof -ti:3000,5000,1234

# 或详细查看
netstat -tlnp | grep -E ":(3000|5000|1234)"

# 或使用脚本
ps aux | grep -E "(vite|tsx)" | grep -v grep
```

### 2. 查看服务日志

```bash
# 查看后端日志
tail -f /tmp/backend.log

# 查看前端日志
tail -f /tmp/frontend.log

# 查看Mock LM Studio日志
tail -f /tmp/mock-lm.log
```

### 3. 单独启动/停止服务

#### 启动Mock LM Studio
```bash
cd backend
npx tsx src/mock-lm-studio.ts > /tmp/mock-lm.log 2>&1 &
```

#### 启动后端
```bash
cd backend
npm run dev
# 或后台运行
npm run dev > /tmp/backend.log 2>&1 &
```

#### 启动前端
```bash
cd frontend
npm run dev
# 或后台运行
npm run dev > /tmp/frontend.log 2>&1 &
```

#### 停止特定服务
```bash
# 停止前端 (3000端口)
lsof -ti:3000 | xargs kill -9

# 停止后端 (5000端口)
lsof -ti:5000 | xargs kill -9

# 停止Mock LM Studio (1234端口)
lsof -ti:1234 | xargs kill -9
```

### 4. 健康检查

```bash
# 检查后端
curl http://localhost:5001/api/health

# 检查Mock LM Studio
curl http://localhost:1234/v1/models

# 检查前端
curl http://localhost:3000
```

## 常见问题

### Q: 端口被占用怎么办？

**A:** 使用停止脚本清理所有端口：
```bash
./scripts/stop.sh
```

或手动清理特定端口：
```bash
# 查找占用端口的进程
lsof -ti:3000

# 强制停止
lsof -ti:3000 | xargs kill -9
```

### Q: 服务启动失败？

**A:** 按以下步骤排查：

1. **检查端口是否被占用**
   ```bash
   lsof -ti:3000,5000,1234
   ```

2. **检查依赖是否安装**
   ```bash
   npm run install:all
   ```

3. **检查Node版本**
   ```bash
   node -v  # 应该 >= 18
   ```

4. **查看错误日志**
   ```bash
   tail -100 /tmp/backend.log
   tail -100 /tmp/frontend.log
   ```

### Q: 修改代码后不生效？

**A:** 开发服务器支持热重载，但有时需要手动重启：
```bash
./scripts/restart.sh
```

### Q: 如何在生产环境运行？

**A:** 先构建，然后使用生产模式：
```bash
# 构建
npm run build

# 运行
cd frontend/dist && python -m http.server 3000 &
cd backend && npm start
```

## 开发技巧

### 1. 使用真实的LM Studio

如果你有真实的LM Studio：

```bash
# 1. 启动LM Studio并加载模型
# 2. 确保API服务器运行在 http://127.0.0.1:1234
# 3. 不要启动Mock服务器，直接启动后端和前端
cd backend && npm run dev &
cd frontend && npm run dev
```

### 2. 并行开发

在不同终端窗口中运行各个服务，方便查看日志：

**终端1 - Mock LM Studio:**
```bash
cd backend
npx tsx src/mock-lm-studio.ts
```

**终端2 - 后端:**
```bash
cd backend
npm run dev
```

**终端3 - 前端:**
```bash
cd frontend
npm run dev
```

### 3. 快速测试

```bash
# 快速测试API
curl -X POST http://localhost:5001/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "测试消息", "style": "gentle"}'
```

## 脚本参考

项目提供了以下脚本：

| 脚本 | 功能 | 用法 |
|------|------|------|
| `scripts/start.sh` | 启动所有服务 | `./scripts/start.sh` |
| `scripts/stop.sh` | 停止所有服务 | `./scripts/stop.sh` |
| `scripts/restart.sh` | 重启所有服务 | `./scripts/restart.sh` |
| `scripts/test-lm-studio.sh` | 测试LM Studio | `./scripts/test-lm-studio.sh` |

## 故障排除清单

遇到问题时，按顺序检查：

- [ ] 运行 `./scripts/stop.sh` 清理所有进程
- [ ] 检查端口是否释放：`lsof -ti:3000,5000,1234`
- [ ] 检查依赖：`ls node_modules frontend/node_modules backend/node_modules`
- [ ] 检查Node版本：`node -v`
- [ ] 重新安装依赖：`npm run install:all`
- [ ] 清理缓存：`rm -rf node_modules */node_modules package-lock.json */package-lock.json`
- [ ] 重启服务：`./scripts/restart.sh`

如果问题仍然存在，请查看日志文件：
```bash
cat /tmp/backend.log
cat /tmp/frontend.log
cat /tmp/mock-lm.log
```
