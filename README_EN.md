# Apologize Is All You Need

> An AI-powered apology application - Providing unlimited emotional support and sincere apologies

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)

[English](./README.md) | [中文](./README_CN.md)

---

## 📸 Screenshots

<table>
  <tr>
    <td><img src="docs/images/screenshot-chat.png" alt="Chat Interface" width="400"/></td>
    <td><img src="docs/images/screenshot-sessions.png" alt="Session Management" width="400"/></td>
  </tr>
  <tr>
    <td align="center"><b>Chat Interface</b></td>
    <td align="center"><b>Session Management</b></td>
  </tr>
  <tr>
    <td><img src="docs/images/screenshot-styles.png" alt="Apology Styles" width="400"/></td>
    <td><img src="docs/images/screenshot-mobile.png" alt="Mobile View" width="400"/></td>
  </tr>
  <tr>
    <td align="center"><b>Three Apology Styles</b></td>
    <td align="center"><b>Mobile Responsive</b></td>
  </tr>
</table>

> 📝 **Note**: To add screenshots, run the app and take screenshots, then save them to `docs/images/` folder.

---

## 🎯 Project Status

✅ **MVP Complete** - All core features implemented

Current Version: v0.1.0

## ✨ Features

- ✅ **Local LLM Integration** - Supports LM Studio (OpenAI-compatible API)
- ✅ **Real-time Chat Interface** - Responsive chat UI with animations
- ✅ **Multiple Apology Styles** - Gentle / Formal / Empathetic
- ✅ **Multi-Session Management** - Create, switch, and delete sessions
- ✅ **Session Persistence** - Auto-save with localStorage
- ✅ **Emotion Detection** - Automatically detect user emotions
- ✅ **Complete Error Handling** - User-friendly error messages
- ✅ **Mock Server** - Test without real LLM
- ✅ **Cute Apology Animation** - Japanese-style bowing character

## 🚀 Quick Start

### Method 1: One-Command Start (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/turtacn/apologize-is-all-you-need.git
cd apologize-is-all-you-need

# 2. Run startup script
./scripts/start.sh
```

The startup script will automatically:
- Check Node.js version
- Install dependencies (if needed)
- Create .env file
- Detect LM Studio
- Start all services

### Method 2: Manual Start

```bash
# 1. Install dependencies
npm run install:all

# 2. Configure environment (optional)
cp .env.example .env

# 3. Start the application
npm run dev

# 4. Access the app
# Frontend: http://localhost:3000
# Backend: http://localhost:5001
```

For detailed instructions, see [Quick Start Guide](./docs/QUICK_START.md)

## 💻 Requirements

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **LM Studio** (optional, can use Mock server)

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Hooks + localStorage
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js + Express.js
- **Language**: TypeScript
- **LLM**: LM Studio API (OpenAI-compatible)
- **Session Storage**: In-memory (100 sessions, 24h TTL)
- **Testing**: Vitest (14 unit tests)

## 📁 Project Structure

```
apologize-is-all-you-need/
├── frontend/                    # React frontend
│   ├── src/
│   │   ├── components/         # UI components
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── InputBox.tsx
│   │   │   └── SessionList.tsx
│   │   ├── services/           # API services
│   │   ├── utils/              # Utility functions
│   │   └── types/              # TypeScript types
│   └── package.json
│
├── backend/                     # Express backend
│   ├── src/
│   │   ├── services/           # Business logic
│   │   │   ├── llm.service.ts
│   │   │   └── session.service.ts
│   │   ├── routes/             # API routes
│   │   ├── middleware/         # Middleware
│   │   ├── prompts/            # Prompt templates
│   │   └── types/              # TypeScript types
│   ├── tests/                  # Unit tests
│   └── package.json
│
├── docs/                        # Documentation
│   ├── API.md                  # API documentation
│   ├── QUICK_START.md          # Quick start guide
│   └── SERVICE_MANAGEMENT.md   # Service management
│
├── scripts/                     # Utility scripts
│   ├── start.sh                # Start script
│   ├── stop.sh                 # Stop script
│   └── restart.sh              # Restart script
│
├── .env.example                # Environment variables template
├── package.json                # Root configuration
└── README.md                   # This file
```

## 📚 API Documentation

### Main Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat/message` | POST | Send message and get apology |
| `/api/chat/history` | GET | Get session history |
| `/api/chat/sessions` | GET | Get all sessions |
| `/api/health` | GET | Health check |

Full API documentation: [docs/API.md](./docs/API.md)

## 🎨 Apology Styles

### Gentle
Warm and caring, like a friend expressing concern, using gentle and affectionate language.

### Formal
Professional yet warm, respectful and dignified, maintaining appropriate distance.

### Empathetic
Deep empathy and understanding, fully validates user's feelings, strong emotional resonance.

## 🧪 Testing

### Run Tests

```bash
# Backend tests
cd backend
npm run test

# Watch mode
npm run test:watch
```

### Build for Production

```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd backend
npm run build
```

## 📊 Test Results

| Test Type | Status | Details |
|-----------|--------|---------|
| Backend Unit Tests | ✅ 14/14 | All LLMService tests passing |
| API Integration | ✅ | All endpoints working |
| Frontend-Backend | ✅ | Communication normal |

## ✅ MVP Completion

- [x] Phase 0: Project Initialization
- [x] Phase 1: Backend API Development
- [x] Phase 2: Frontend Interface
- [x] Phase 3: Feature Enhancements
- [x] Phase 4: Testing & Optimization
- [x] Phase 5: Documentation & Deployment

Detailed development plan: [PLAN.md](./PLAN.md)

## 🔧 Service Management

### Stop All Services

```bash
./scripts/stop.sh
```

### Restart All Services

```bash
./scripts/restart.sh
```

For detailed service management, see [Service Management Guide](./docs/SERVICE_MANAGEMENT.md)

## 🐛 Troubleshooting

### Cannot Connect to LM Studio

Use the Mock server for testing:

```bash
cd backend
npx tsx src/mock-lm-studio.ts
```

### Port Already in Use

Stop all services first:

```bash
./scripts/stop.sh
```

Or manually kill processes:

```bash
lsof -ti:3000 | xargs kill -9  # Frontend
lsof -ti:5000 | xargs kill -9  # Backend
lsof -ti:1234 | xargs kill -9  # LM Studio
```

More troubleshooting tips: [Quick Start Guide](./docs/QUICK_START.md)

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to [LM Studio](https://lmstudio.ai/) for providing local LLM runtime
- Thanks to [Anthropic](https://www.anthropic.com/) for Claude's development assistance

## 📞 Contact

- Project Homepage: https://github.com/turtacn/apologize-is-all-you-need
- Issue Tracker: https://github.com/turtacn/apologize-is-all-you-need/issues

---

**Enjoy using the app!** 🎉

If this project helps you, please give it a ⭐️ Star!
