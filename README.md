# Apologize Is All You Need

> 一个由AI驱动的跨平台道歉应用 - 提供无限的情绪价值和真诚的道歉

## 项目状态

🚧 **正在开发中** - MVP阶段

当前进度：Phase 0.1 - 项目结构创建

## 快速开始

### 环境要求

- Node.js >= 18
- LM Studio (运行本地LLM)
- 推荐模型：Llama 3.2 3B或更大

### 安装步骤

```bash
# 1. 克隆项目
git clone https://github.com/turtacn/apologize-is-all-you-need.git
cd apologize-is-all-you-need

# 2. 安装依赖
npm run install:all

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，确保 LM Studio 地址正确

# 4. 启动 LM Studio
# 确保 LM Studio 运行在 http://127.0.0.1:1234

# 5. 启动开发服务器
npm run dev

# 6. 访问应用
# 前端: http://localhost:3000
# 后端: http://localhost:5000
```

## 功能特性（计划中）

- ✅ 本地LLM集成（LM Studio）
- ⏳ 实时对话界面
- ⏳ 多种道歉风格（温和/正式/共情）
- ⏳ 会话历史记录
- ⏳ 响应式设计
- ⏳ 情绪识别

## 技术栈

### 前端
- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- React Context + Hooks
- localStorage

### 后端
- Node.js + Express.js
- TypeScript
- LM Studio API集成
- SQLite3（计划）
- express-session

## 项目结构

```
apologize-is-all-you-need/
├── frontend/          # React前端
├── backend/           # Express后端
├── docs/              # 项目文档
├── scripts/           # 工具脚本
└── PLAN.md            # 开发计划
```

## 开发计划

详细的开发计划请查看 [PLAN.md](./PLAN.md)

## 贡献

欢迎贡献！请查看贡献指南（待完善）

## 许可证

MIT License - 详见 [LICENSE](./LICENSE)

## 联系方式

项目地址: https://github.com/turtacn/apologize-is-all-you-need
