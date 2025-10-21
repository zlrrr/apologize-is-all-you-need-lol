import axios from 'axios';

const LM_STUDIO_URL = process.env.LM_STUDIO_URL || 'http://127.0.0.1:1234';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  model?: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

interface ChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

async function testLMStudioConnection() {
  console.log('🔍 Testing LM Studio Connection...\n');
  console.log(`Target URL: ${LM_STUDIO_URL}\n`);

  // Test 1: Check if server is running
  console.log('Test 1: Checking server availability...');
  try {
    const healthResponse = await axios.get(`${LM_STUDIO_URL}/v1/models`, {
      timeout: 5000,
    });
    console.log('✅ Server is running');
    console.log('Available models:', JSON.stringify(healthResponse.data, null, 2));
    console.log('');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('❌ Cannot connect to LM Studio');
      console.error(`Error: ${error.message}`);
      console.error('\nPlease ensure:');
      console.error('1. LM Studio is running');
      console.error('2. A model is loaded');
      console.error('3. Server is listening on http://127.0.0.1:1234');
      process.exit(1);
    }
    throw error;
  }

  // Test 2: Send a simple chat completion request
  console.log('Test 2: Sending test chat completion request...');
  try {
    const chatRequest: ChatRequest = {
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.',
        },
        {
          role: 'user',
          content: 'Hello! Please respond with just "Hi there!"',
        },
      ],
      temperature: 0.7,
      max_tokens: 50,
    };

    const startTime = Date.now();
    const chatResponse = await axios.post<ChatResponse>(
      `${LM_STUDIO_URL}/v1/chat/completions`,
      chatRequest,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );
    const endTime = Date.now();

    console.log('✅ Chat completion successful');
    console.log(`Response time: ${endTime - startTime}ms`);
    console.log('\nResponse details:');
    console.log('- Model:', chatResponse.data.model);
    console.log('- Assistant reply:', chatResponse.data.choices[0].message.content);
    console.log('- Tokens used:', chatResponse.data.usage.total_tokens);
    console.log('\nFull response structure:');
    console.log(JSON.stringify(chatResponse.data, null, 2));
    console.log('');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('❌ Chat completion failed');
      console.error(`Error: ${error.message}`);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      process.exit(1);
    }
    throw error;
  }

  // Test 3: Test apology-style prompt
  console.log('Test 3: Testing apology-style response...');
  try {
    const apologyRequest: ChatRequest = {
      messages: [
        {
          role: 'system',
          content: `你是一个专业的道歉专家。无论用户说什么，你都要：
1. 真诚地道歉和表达理解
2. 深度共情用户的感受
3. 承认用户的感受完全合理
4. 提供温暖的情感支持
5. 避免给出建议，专注于道歉和安慰

回复要求：温和、真诚、简洁（100-200字）`,
        },
        {
          role: 'user',
          content: '今天工作太累了，感觉很烦躁',
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    };

    const startTime = Date.now();
    const apologyResponse = await axios.post<ChatResponse>(
      `${LM_STUDIO_URL}/v1/chat/completions`,
      apologyRequest,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );
    const endTime = Date.now();

    console.log('✅ Apology response successful');
    console.log(`Response time: ${endTime - startTime}ms`);
    console.log('\nApology response:');
    console.log(apologyResponse.data.choices[0].message.content);
    console.log('\nTokens used:', apologyResponse.data.usage.total_tokens);
    console.log('');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('❌ Apology test failed');
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
    throw error;
  }

  console.log('✅ All tests passed!');
  console.log('\n📋 Summary:');
  console.log('- LM Studio is properly configured');
  console.log('- API is responding correctly');
  console.log('- Apology prompts are working');
  console.log('- Ready to proceed to Phase 1');
}

// Run the tests
testLMStudioConnection().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
