# Quick Start Guide

Get the Apologize Is All You Need application running in 5 minutes!

## Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **LM Studio** (recommended) or any OpenAI-compatible LLM API

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/turtacn/apologize-is-all-you-need.git
cd apologize-is-all-you-need
```

### 2. Install Dependencies

```bash
# Install all dependencies (root + frontend + backend)
npm run install:all
```

Or install individually:

```bash
# Root dependencies
npm install

# Frontend dependencies
cd frontend && npm install && cd ..

# Backend dependencies
cd backend && npm install && cd ..
```

### 3. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your settings (optional, defaults work for local dev)
nano .env
```

**Default configuration:**
- LM Studio URL: `http://127.0.0.1:1234`
- Backend Port: `5000`
- Frontend Port: `3000`

### 4. Start LM Studio (Recommended)

1. Download and install [LM Studio](https://lmstudio.ai/)
2. Load a model (recommended: Llama 3.2 3B or larger)
3. Start the local server (default port: 1234)
4. Ensure the server is running at `http://127.0.0.1:1234`

**Alternative:** The application includes a mock LM Studio server for testing without a real LLM.

### 5. Start the Application

#### Option A: Start All Services (Recommended)

```bash
# Start both frontend and backend
npm run dev
```

#### Option B: Start Services Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

#### Option C: Use Mock LM Studio (For Testing)

```bash
# Terminal 1 - Mock LM Studio
cd backend
npx tsx src/mock-lm-studio.ts

# Terminal 2 - Backend
cd backend
npm run dev

# Terminal 3 - Frontend
cd frontend
npm run dev
```

### 6. Access the Application

Open your browser and navigate to:

```
http://localhost:3000
```

You should see the chat interface! 🎉

## First Steps

1. **Send your first message** - Type something like "今天很累" and press Enter
2. **Try different styles** - Use the style selector to switch between 温和/正式/共情
3. **Create multiple sessions** - Click "会话列表" to create and switch between conversations
4. **Clear history** - Use the "清空历史" button to start fresh

## Testing the API

You can test the backend API directly:

```bash
# Health check
curl http://localhost:5001/api/health

# Send a message
curl -X POST http://localhost:5001/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "测试消息", "style": "gentle"}'
```

## Troubleshooting

### Backend won't start

- **Check if port 5000 is already in use:**
  ```bash
  lsof -i :5000
  ```

- **Try a different port:**
  Edit `.env` and change `BACKEND_PORT=5000` to another port

### Frontend won't start

- **Check if port 3000 is already in use:**
  ```bash
  lsof -i :3000
  ```

- **Clear npm cache:**
  ```bash
  npm cache clean --force
  ```

### Cannot connect to LM Studio

- **Verify LM Studio is running:**
  ```bash
  curl http://127.0.0.1:1234/v1/models
  ```

- **Check LM Studio configuration:**
  - Ensure server is started in LM Studio
  - Check the port (default: 1234)
  - Verify CORS is enabled

- **Use Mock Server for testing:**
  ```bash
  cd backend
  npx tsx src/mock-lm-studio.ts
  ```

### Frontend can't connect to backend

- **Check CORS settings** in `backend/src/server.ts`
- **Verify backend is running** on port 5000
- **Check Vite proxy configuration** in `frontend/vite.config.ts`

## Next Steps

- Read the full [API Documentation](./API.md)
- Check out the [Architecture](./ARCHITECTURE.md)
- Learn about [Prompt Design](./PROMPT_DESIGN.md)
- Review [Contributing Guidelines](./CONTRIBUTING.md)

## Development Tips

### Hot Reload

Both frontend and backend support hot reload:
- Frontend: Vite automatically reloads on file changes
- Backend: tsx watch mode restarts on file changes

### Running Tests

```bash
# Backend tests
cd backend
npm run test

# Watch mode
npm run test:watch
```

### Building for Production

```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd backend
npm run build
```

## Need Help?

- Check [Troubleshooting Guide](./TROUBLESHOOTING.md)
- File an issue on [GitHub](https://github.com/turtacn/apologize-is-all-you-need/issues)
- Read the [FAQ](./FAQ.md)
