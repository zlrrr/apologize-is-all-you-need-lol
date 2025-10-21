import express from 'express';

// Mock LM Studio server for testing
const app = express();
const PORT = 1234;

app.use(express.json());

// Mock models endpoint
app.get('/v1/models', (req, res) => {
  res.json({
    object: 'list',
    data: [
      {
        id: 'mock-model-v1',
        object: 'model',
        created: Date.now(),
        owned_by: 'mock-lm-studio',
      },
    ],
  });
});

// Mock chat completions endpoint
app.post('/v1/chat/completions', (req, res) => {
  const { messages, temperature, max_tokens } = req.body;

  // Get the last user message
  const userMessage = messages.find((m: any) => m.role === 'user')?.content || '';
  const systemMessage = messages.find((m: any) => m.role === 'system')?.content || '';

  // Generate a simple mock response based on the system prompt
  let assistantReply = '';

  if (systemMessage.includes('道歉专家') || systemMessage.includes('apology')) {
    // Apology-style response for Chinese input
    if (userMessage.includes('累') || userMessage.includes('烦')) {
      assistantReply = `非常抱歉听到你今天这么辛苦。工作压力大确实会让人感到疲惫和烦躁，这种感受完全可以理解。

你的感受是完全正常和合理的。每个人都有承受压力的极限，感到累和烦躁说明你已经付出了很多努力。

请允许我向你表达深深的理解和支持。你并不孤单，这样的感受很多人都经历过。希望你能好好休息一下，给自己一些放松的时间。`;
    } else {
      assistantReply = '非常抱歉给您带来了困扰。我完全理解您的感受，这确实让人感到不舒服。请允许我真诚地向您道歉，并表达我的理解和支持。';
    }
  } else {
    // Simple default response
    assistantReply = 'Hi there!';
  }

  // Mock response structure matching OpenAI API
  const response = {
    id: 'chatcmpl-mock-' + Date.now(),
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model: 'mock-model-v1',
    choices: [
      {
        index: 0,
        message: {
          role: 'assistant',
          content: assistantReply,
        },
        finish_reason: 'stop',
      },
    ],
    usage: {
      prompt_tokens: messages.reduce((sum: number, m: any) => sum + m.content.length / 4, 0),
      completion_tokens: Math.ceil(assistantReply.length / 4),
      total_tokens: 0,
    },
  };

  response.usage.total_tokens = response.usage.prompt_tokens + response.usage.completion_tokens;

  // Simulate some processing time
  setTimeout(() => {
    res.json(response);
  }, 100);
});

app.listen(PORT, () => {
  console.log(`🎭 Mock LM Studio server running on http://localhost:${PORT}`);
  console.log(`📝 This is a mock server for testing purposes`);
  console.log(`🔧 Replace with real LM Studio in production`);
});
