# API Documentation

Backend API for the Apologize Is All You Need application.

## Base URL

```
http://localhost:5000/api
```

## Endpoints

### Health Check

#### GET /health

Check if the API server is running.

**Response:**
```json
{
  "status": "ok",
  "message": "Backend server is running"
}
```

---

### Chat API

#### POST /chat/message

Send a message and receive an apology response.

**Request Body:**
```json
{
  "message": "今天工作太累了",
  "style": "gentle",
  "sessionId": "optional-session-id"
}
```

**Parameters:**
- `message` (string, required): User's message
- `style` (string, optional): Apology style - one of `gentle`, `formal`, `empathetic`. Default: `gentle`
- `sessionId` (string, optional): Session ID for conversation continuity. If not provided, a new session will be created.

**Response:**
```json
{
  "sessionId": "cb83af6f-c2ba-4f20-b51c-2bcd2e5041ff",
  "reply": "非常抱歉听到你今天这么辛苦...",
  "emotion": "tired",
  "style": "gentle",
  "tokensUsed": 116,
  "timestamp": "2025-10-21T11:38:26.162Z"
}
```

**Error Response:**
```json
{
  "error": "Validation Error",
  "message": "Message is required",
  "field": "message"
}
```

---

#### GET /chat/history

Get conversation history for a session.

**Query Parameters:**
- `sessionId` (string, required): Session ID

**Example:**
```
GET /chat/history?sessionId=cb83af6f-c2ba-4f20-b51c-2bcd2e5041ff
```

**Response:**
```json
{
  "sessionId": "cb83af6f-c2ba-4f20-b51c-2bcd2e5041ff",
  "messages": [
    {
      "role": "user",
      "content": "今天工作太累了"
    },
    {
      "role": "assistant",
      "content": "非常抱歉听到你今天这么辛苦..."
    }
  ],
  "messageCount": 2,
  "createdAt": "2025-10-21T11:38:26.162Z",
  "updatedAt": "2025-10-21T11:38:26.162Z"
}
```

---

#### DELETE /chat/history

Clear conversation history for a session.

**Query Parameters:**
- `sessionId` (string, required): Session ID

**Response:**
```json
{
  "sessionId": "cb83af6f-c2ba-4f20-b51c-2bcd2e5041ff",
  "message": "History cleared successfully"
}
```

---

#### DELETE /chat/session

Delete a session entirely.

**Query Parameters:**
- `sessionId` (string, required): Session ID

**Response:**
```json
{
  "sessionId": "cb83af6f-c2ba-4f20-b51c-2bcd2e5041ff",
  "message": "Session deleted successfully"
}
```

---

#### GET /chat/sessions

Get all session IDs (for debugging).

**Response:**
```json
{
  "sessions": [
    "cb83af6f-c2ba-4f20-b51c-2bcd2e5041ff",
    "8a7b9c2d-1e3f-4g5h-6i7j-8k9l0m1n2o3p"
  ],
  "count": 2
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request - Validation error |
| 404 | Not Found - Session not found |
| 500 | Internal Server Error |
| 502 | Bad Gateway - LLM API error |
| 503 | Service Unavailable - Cannot connect to LM Studio |
| 504 | Gateway Timeout - LLM request timeout |

## Apology Styles

### gentle (温和)
- Warm and caring tone
- Like a friend expressing concern
- Uses gentle, affectionate language

### formal (正式)
- Professional but warm tone
- Respectful and dignified
- Maintains appropriate distance

### empathetic (共情)
- Deep empathy and understanding
- Validates user's pain completely
- Strong emotional resonance

## Examples

### Example 1: Send a message with gentle style

```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "今天心情很不好",
    "style": "gentle"
  }'
```

### Example 2: Continue a conversation

```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "还是感觉很难受",
    "style": "empathetic",
    "sessionId": "your-session-id-here"
  }'
```

### Example 3: Get conversation history

```bash
curl http://localhost:5000/api/chat/history?sessionId=your-session-id-here
```
