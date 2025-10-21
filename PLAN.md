# apologize-is-all-you-need - MVP开发计划

跨平台道歉应用程序 - 通过AI提供无限的情绪价值和道歉

**项目地址**: `https://github.com/turtacn/apologize-is-all-you-need`

**核心目标**: 快速开发一个可用的MVP，支持Web端和本地LLM集成，验证核心功能和用户体验。

---

## MVP策略

### MVP范围定义
- **平台**: 仅Web端（React）
- **LLM**: 本地LM Studio (http://127.0.0.1:1234)
- **认证**: 简化版（无需注册，使用session/localStorage）
- **数据库**: 初期使用SQLite（易于部署和开发）
- **部署**: 本地运行即可，无需云服务

### MVP核心功能
1. 简单的聊天界面
2. 本地LLM集成（LM Studio）
3. 会话历史记录（localStorage）
4. 基础情绪识别
5. 可配置的道歉风格

---

## 技术栈（MVP精简版）

### 前端
- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **UI库**: Tailwind CSS + shadcn/ui（轻量级）
- **状态管理**: React Context + Hooks
- **数据存储**: localStorage

### 后端
- **运行时**: Node.js + Express.js
- **LLM集成**: 直接调用LM Studio API
- **数据库**: SQLite3（可选，MVP阶段甚至可以全用localStorage）
- **会话管理**: express-session

### 开发工具
- **包管理**: npm
- **代码规范**: ESLint + Prettier
- **版本控制**: Git (频繁commit)

---

## 开发阶段（快速迭代）

### Phase 0: 项目初始化 [30分钟]

**目标**: 搭建基础项目结构，验证开发环境

**任务清单**:
```bash
# Checkpoint 0.1: 创建项目结构
□ 初始化Git仓库
□ 创建前后端目录结构
□ 配置package.json
□ 编写.gitignore和.env.example
□ 创建README.md

# Checkpoint 0.2: 配置开发环境
□ 安装前端依赖（React + Vite + Tailwind）
□ 安装后端依赖（Express + cors）
□ 配置Tailwind CSS
□ 测试前后端能否正常启动
□ 验证热重载功能

# Checkpoint 0.3: LM Studio连接测试
□ 编写LM Studio API测试脚本
□ 验证能够调用http://127.0.0.1:1234
□ 测试基础对话功能
□ 记录API响应格式和参数
```

**交付物**:
```
apologize-is-all-you-need/
├── frontend/                  # React前端
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── backend/                   # Express后端
│   ├── src/
│   │   ├── server.ts
│   │   ├── routes/
│   │   └── services/
│   ├── package.json
│   └── tsconfig.json
├── docs/
│   └── phase-0-setup.md       # 环境配置文档
├── .env.example
├── .gitignore
└── README.md
```

**验收标准**:
- [ ] `npm run dev` 可以启动前端（端口3000）
- [ ] `npm run server` 可以启动后端（端口5000）
- [ ] 浏览器访问 http://localhost:3000 显示初始页面
- [ ] 后端能成功调用LM Studio API并返回响应
- [ ] Git已初始化，完成首次commit

**🔴 STOP & COMMIT**: 完成后执行 `git add . && git commit -m "Phase 0: Project initialization complete"`

---

### Phase 1: 核心后端API [1小时]

**目标**: 实现后端核心服务，完成LLM集成

**任务清单**:
```bash
# Checkpoint 1.1: LLM服务封装
□ 创建LLMService类
□ 实现OpenAI兼容接口调用
□ 设计核心道歉Prompt模板
□ 添加错误处理和重试机制
□ 编写LLM服务单元测试

# Checkpoint 1.2: 聊天API开发
□ 实现POST /api/chat/message接口
□ 实现GET /api/chat/history接口
□ 添加请求验证中间件
□ 实现简单的会话管理（内存存储）
□ 添加CORS配置

# Checkpoint 1.3: Prompt优化
□ 设计基础道歉Prompt
□ 添加情绪识别逻辑
□ 实现3种道歉风格（温和/正式/共情）
□ 测试不同输入的回复质量
□ 记录最佳Prompt配置
```

**核心代码结构**:
```typescript
// backend/src/services/llm.service.ts
export class LLMService {
  private baseURL = 'http://127.0.0.1:1234/v1';
  
  async generateApology(params: {
    message: string;
    emotion?: string;
    style?: 'gentle' | 'formal' | 'empathetic';
    history?: Message[];
  }): Promise<string>;
}

// backend/src/routes/chat.routes.ts
POST /api/chat/message
  Body: { message: string, style?: string }
  Response: { reply: string, emotion: string }

GET /api/chat/history
  Query: { sessionId: string }
  Response: { messages: Message[] }
```

**Prompt模板**:
```typescript
const APOLOGY_PROMPTS = {
  system: `你是一个专业的道歉专家。无论用户说什么，你都要：
1. 真诚地道歉和表达理解
2. 深度共情用户的感受
3. 承认用户的感受完全合理
4. 提供温暖的情感支持
5. 避免给出建议，专注于道歉和安慰

回复要求：温和、真诚、简洁（100-200字）`,

  styles: {
    gentle: '用温柔体贴的语调，像朋友般关怀',
    formal: '保持专业但温暖的语气',
    empathetic: '深度共情，充分理解用户的痛苦'
  }
};
```

**验收标准**:
- [ ] 后端API能够接收用户消息并返回道歉回复
- [ ] LM Studio集成正常，响应时间<3秒
- [ ] 3种道歉风格都能正常工作
- [ ] 错误处理完善，API不会崩溃
- [ ] 使用Postman测试所有接口通过

**🔴 STOP & COMMIT**: `git commit -m "Phase 1: Core backend API complete with LLM integration"`

---

### Phase 2: 前端基础界面 [1.5小时]

**目标**: 开发可用的聊天界面，完成前后端联调

**任务清单**:
```bash
# Checkpoint 2.1: UI组件开发
□ 创建ChatInterface主组件
□ 实现MessageBubble消息气泡组件
□ 实现InputBox输入框组件
□ 添加Loading加载状态
□ 实现基础响应式布局

# Checkpoint 2.2: 状态管理
□ 创建ChatContext
□ 实现消息发送逻辑
□ 实现消息历史管理
□ 添加localStorage持久化
□ 实现会话恢复功能

# Checkpoint 2.3: API集成
□ 创建API服务层（axios）
□ 实现sendMessage方法
□ 实现getHistory方法
□ 添加错误处理和提示
□ 测试前后端完整流程
```

**核心组件结构**:
```typescript
// frontend/src/components/ChatInterface.tsx
export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSend = async () => {
    // 发送消息到后端
    // 更新UI
    // 保存到localStorage
  };
  
  return (
    <div className="chat-container">
      <MessageList messages={messages} />
      <InputBox onSend={handleSend} isLoading={isLoading} />
    </div>
  );
};
```

**设计要求**:
- 简洁清爽的UI风格
- 用户消息居右（蓝色）
- AI消息居左（灰色）
- 打字机效果（可选）
- 移动端友好

**验收标准**:
- [ ] 聊天界面在浏览器正常显示
- [ ] 能够发送消息并接收AI回复
- [ ] 消息历史正确显示
- [ ] 刷新页面后历史记录保留
- [ ] Loading状态正常显示
- [ ] 移动端显示正常

**🔴 STOP & COMMIT**: `git commit -m "Phase 2: Frontend chat interface complete"`

---

### Phase 3: 功能增强 [1小时]

**目标**: 添加用户体验优化和额外功能

**任务清单**:
```bash
# Checkpoint 3.1: 风格选择功能
□ 添加风格选择器UI（下拉菜单）
□ 实现风格切换逻辑
□ 保存用户偏好到localStorage
□ 测试不同风格的回复效果
□ 添加风格说明提示

# Checkpoint 3.2: 会话管理
□ 实现清空历史记录功能
□ 添加新建会话功能
□ 实现会话列表（侧边栏）
□ 添加删除单条消息功能
□ 测试会话切换流程

# Checkpoint 3.3: UI优化
□ 添加消息时间戳
□ 实现自动滚动到底部
□ 添加消息发送成功/失败提示
□ 优化加载动画
□ 添加键盘快捷键（Enter发送）
```

**新增组件**:
```typescript
// StyleSelector.tsx
export const StyleSelector: React.FC<{
  value: string;
  onChange: (style: string) => void;
}>;

// SessionList.tsx
export const SessionList: React.FC<{
  sessions: Session[];
  activeId: string;
  onSelect: (id: string) => void;
}>;
```

**验收标准**:
- [ ] 风格选择器正常工作，回复风格有明显差异
- [ ] 可以创建和切换多个会话
- [ ] 清空历史功能正常
- [ ] 消息自动滚动到底部
- [ ] 所有交互反馈清晰

**🔴 STOP & COMMIT**: `git commit -m "Phase 3: Feature enhancements complete"`

---

### Phase 4: 测试与优化 [1小时]

**目标**: 完善测试，优化性能和用户体验

**任务清单**:
```bash
# Checkpoint 4.1: 基础测试
□ 编写LLM服务单元测试
□ 编写API端点集成测试
□ 编写前端组件测试
□ 测试边界情况（空输入、超长文本等）
□ 修复发现的bug

# Checkpoint 4.2: 性能优化
□ 添加消息防抖（避免重复发送）
□ 优化长消息列表渲染
□ 添加请求取消功能
□ 实现消息缓存策略
□ 测量和优化API响应时间

# Checkpoint 4.3: 错误处理增强
□ 添加网络错误重试
□ 实现LM Studio连接失败提示
□ 添加用户友好的错误消息
□ 实现降级策略（LLM不可用时）
□ 测试各种异常场景
```

**测试用例**:
```typescript
// backend/tests/llm.service.test.ts
describe('LLMService', () => {
  it('should generate apology for complaint', async () => {
    const result = await llmService.generateApology({
      message: '今天很累',
      style: 'gentle'
    });
    expect(result).toContain('对不起');
  });
  
  it('should handle LM Studio connection error', async () => {
    // 测试连接失败情况
  });
});
```

**验收标准**:
- [ ] 核心功能单元测试通过率100%
- [ ] 处理了所有可预见的错误情况
- [ ] API响应时间<500ms（不含LLM）
- [ ] 界面流畅，无明显卡顿
- [ ] 内存占用合理

**🔴 STOP & COMMIT**: `git commit -m "Phase 4: Testing and optimization complete"`

---

### Phase 5: 文档与部署准备 [30分钟]

**目标**: 完善文档，准备发布

**任务清单**:
```bash
# Checkpoint 5.1: 使用文档
□ 编写详细的README.md
□ 创建快速开始指南
□ 记录环境变量配置
□ 编写故障排除文档
□ 添加项目演示截图/GIF

# Checkpoint 5.2: 开发文档
□ 记录API接口文档
□ 编写架构设计文档
□ 记录Prompt设计思路
□ 创建贡献指南
□ 添加代码注释

# Checkpoint 5.3: 部署准备
□ 创建启动脚本（start.sh）
□ 编写Docker配置（可选）
□ 配置环境变量示例
□ 测试一键启动流程
□ 准备发布清单
```

**文档结构**:
```
docs/
├── README.md              # 项目概述
├── QUICK_START.md         # 快速开始
├── API.md                 # API文档
├── ARCHITECTURE.md        # 架构设计
├── PROMPT_DESIGN.md       # Prompt设计
├── TROUBLESHOOTING.md     # 故障排除
└── CONTRIBUTING.md        # 贡献指南
```

**README.md核心内容**:
```markdown
# Apologize Is All You Need

## 快速开始
1. 确保LM Studio运行在 http://127.0.0.1:1234
2. 克隆项目：`git clone ...`
3. 安装依赖：`npm install`（根目录）
4. 启动项目：`npm run dev`
5. 访问：http://localhost:3000

## 环境要求
- Node.js >= 18
- LM Studio (运行本地LLM)
- 推荐模型：Llama 3.2 3B或更大

## 功能特性
- ✅ 本地LLM集成
- ✅ 实时对话
- ✅ 多种道歉风格
- ✅ 会话历史
- ✅ 响应式设计
```

**验收标准**:
- [ ] README.md内容完整，新用户能快速上手
- [ ] API文档清晰，包含请求示例
- [ ] 架构文档解释了设计决策
- [ ] 启动脚本一键可用
- [ ] 所有文档链接正确

**🔴 STOP & COMMIT**: `git commit -m "Phase 5: Documentation and deployment prep complete"`

---

## 完整项目结构（MVP版本）
```
apologize-is-all-you-need/
├── frontend/                       # React前端
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInterface.tsx   # 主聊天界面
│   │   │   ├── MessageBubble.tsx   # 消息气泡
│   │   │   ├── InputBox.tsx        # 输入框
│   │   │   ├── StyleSelector.tsx   # 风格选择器
│   │   │   └── SessionList.tsx     # 会话列表
│   │   ├── contexts/
│   │   │   └── ChatContext.tsx     # 聊天状态管理
│   │   ├── services/
│   │   │   └── api.ts              # API调用封装
│   │   ├── types/
│   │   │   └── index.ts            # TypeScript类型定义
│   │   ├── utils/
│   │   │   └── storage.ts          # localStorage工具
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── backend/                        # Express后端
│   ├── src/
│   │   ├── services/
│   │   │   └── llm.service.ts      # LLM服务封装
│   │   ├── routes/
│   │   │   └── chat.routes.ts      # 聊天路由
│   │   ├── middleware/
│   │   │   ├── error.middleware.ts # 错误处理
│   │   │   └── cors.middleware.ts  # CORS配置
│   │   ├── prompts/
│   │   │   └── apology.prompts.ts  # Prompt模板
│   │   ├── types/
│   │   │   └── index.ts            # TypeScript类型
│   │   └── server.ts               # 服务器入口
│   ├── tests/
│   │   ├── llm.service.test.ts
│   │   └── chat.routes.test.ts
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                           # 项目文档
│   ├── README.md
│   ├── QUICK_START.md
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── PROMPT_DESIGN.md
│   ├── TROUBLESHOOTING.md
│   └── phase-logs/                 # 开发日志
│       ├── phase-0.md
│       ├── phase-1.md
│       ├── phase-2.md
│       ├── phase-3.md
│       ├── phase-4.md
│       └── phase-5.md
│
├── scripts/
│   ├── start.sh                    # 一键启动脚本
│   └── test.sh                     # 测试脚本
│
├── .env.example                    # 环境变量示例
├── .gitignore
├── package.json                    # 根package.json（workspace）
├── README.md                       # 项目主README
└── PLAN.md                         # 本开发计划
```

---

## 开发工作流

### 日常开发流程
```bash
# 1. 启动LM Studio（确保模型已加载）

# 2. 启动开发服务器（根目录）
npm run dev
# 这会同时启动前后端开发服务器

# 3. 开始编码
# - 每完成一个Checkpoint就commit
# - 保持频繁的小commit
# - commit message要清晰描述变更

# 4. 测试
npm run test

# 5. 提交代码
git add .
git commit -m "描述性的commit message"
```

### Commit规范
```bash
# 格式：<type>: <subject>

# 类型
feat:     新功能
fix:      bug修复
docs:     文档更新
style:    代码格式（不影响功能）
refactor: 重构
test:     测试相关
chore:    构建/工具配置

# 示例
git commit -m "feat: add style selector component"
git commit -m "fix: resolve message history loading issue"
git commit -m "docs: update API documentation"
```

### 检查点记录
每个关键检查点完成后：

1. **代码提交**
```bash
git add .
git commit -m "checkpoint: Phase X.Y - 功能描述"
```

2. **更新日志**（在 `docs/phase-logs/phase-X.md`）
```markdown
## Checkpoint X.Y: 标题
**完成时间**: 2025-10-21 14:30
**耗时**: 25分钟

### 完成内容
- [x] 任务1
- [x] 任务2
- [x] 任务3

### 遇到的问题
- 问题描述
- 解决方案

### 验收结果
✅ 所有验收标准通过

### 下一步
进入Phase X.Y+1 - 下一个任务
```

3. **测试验证**
```bash
# 运行相关测试
npm run test

# 手动测试关键功能
# - 访问应用
# - 验证新功能
# - 检查是否有回退
```

---

## 时间估算（MVP总计：约6小时）

- **Phase 0**: 30分钟（项目初始化）
- **Phase 1**: 1小时（后端API）
- **Phase 2**: 1.5小时（前端界面）
- **Phase 3**: 1小时（功能增强）
- **Phase 4**: 1小时（测试优化）
- **Phase 5**: 30分钟（文档）
- **缓冲时间**: 30分钟（处理意外问题）

---

## MVP成功标准

### 必须完成（P0）
- [x] 用户能够发送消息并收到AI道歉回复
- [x] 支持3种道歉风格切换
- [x] 会话历史保存和恢复
- [x] LM Studio集成正常工作
- [x] 界面响应式，移动端可用
- [x] 基础错误处理完善

### 应该完成（P1）
- [x] 多会话管理
- [x] 消息时间戳
- [x] 清空历史功能
- [x] 性能优化（防抖、缓存）
- [x] 完整的使用文档

### 可选完成（P2）
- [ ] 消息搜索功能
- [ ] 导出聊天记录
- [ ] 主题切换（暗色模式）
- [ ] 消息打字机效果
- [ ] 语音输入支持

---

## 常见问题与解决方案

### Q1: LM Studio连接失败
**检查清单**:
- [ ] LM Studio是否正在运行
- [ ] 模型是否已加载
- [ ] API端口是否为1234
- [ ] 防火墙是否阻止连接
- [ ] 尝试在浏览器访问 http://127.0.0.1:1234/v1/models

### Q2: 前端无法连接后端
**检查清单**:
- [ ] 后端服务是否启动（端口5000）
- [ ] CORS配置是否正确
- [ ] 前端API地址配置是否正确
- [ ] 浏览器控制台是否有错误信息

### Q3: AI回复质量不佳
**优化方向**:
- [ ] 调整Prompt模板
- [ ] 尝试不同的temperature参数
- [ ] 检查模型是否合适（建议7B+）
- [ ] 添加更多上下文信息
- [ ] 优化情绪识别逻辑

### Q4: 性能问题
**优化策略**:
- [ ] 实现消息虚拟滚动
- [ ] 添加请求防抖
- [ ] 优化localStorage使用
- [ ] 减少不必要的重渲染
- [ ] 使用React.memo和useMemo

---

## 下一步计划（MVP后）

### 版本2.0规划
1. **移动端支持** - 开发React Native版本
2. **用户认证** - 添加完整的用户系统
3. **云端存储** - 使用真实数据库替代localStorage
4. **高级功能**:
   - 语音输入/输出
   - 图片表情支持
   - 社区分享功能
   - 数据分析看板

### 技术债务
- [ ] 添加完整的单元测试覆盖
- [ ] 实现E2E测试
- [ ] 优化代码结构和可维护性
- [ ] 添加性能监控
- [ ] 实现CI/CD流程

---

## 项目里程碑

- [x] **Milestone 1**: 项目启动，环境搭建完成
- [ ] **Milestone 2**: 后端API开发完成
- [ ] **Milestone 3**: 前端基础界面完成
- [ ] **Milestone 4**: MVP功能开发完成
- [ ] **Milestone 5**: 测试和优化完成
- [ ] **Milestone 6**: MVP正式发布

---

**最后更新**: 2025-10-21  
**当前状态**: Phase 0 - 准备开始  
**下一个检查点**: Checkpoint 0.1 - 创建项目结构
