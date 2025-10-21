import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { LLMService } from '../src/services/llm.service.js';
import { ApologyStyle, LLMError } from '../src/types/index.js';
import axios from 'axios';

// Test with mock LM Studio server
const TEST_LM_STUDIO_URL = 'http://127.0.0.1:1234';

describe('LLMService', () => {
  let llmService: LLMService;
  let mockServerAvailable = false;

  beforeAll(async () => {
    llmService = new LLMService({
      baseURL: TEST_LM_STUDIO_URL,
      temperature: 0.7,
      maxTokens: 300,
      timeout: 10000,
    });

    // Check if mock server is available
    try {
      await axios.get(`${TEST_LM_STUDIO_URL}/v1/models`, { timeout: 2000 });
      mockServerAvailable = true;
    } catch (error) {
      console.warn('Mock LM Studio server not available, some tests will be skipped');
      mockServerAvailable = false;
    }
  });

  describe('Configuration', () => {
    it('should create service with default config', () => {
      const service = new LLMService();
      const config = service.getConfig();

      expect(config).toBeDefined();
      expect(config.baseURL).toBeDefined();
      expect(config.temperature).toBeGreaterThan(0);
      expect(config.maxTokens).toBeGreaterThan(0);
    });

    it('should create service with custom config', () => {
      const customConfig = {
        baseURL: 'http://custom-url:1234',
        temperature: 0.5,
        maxTokens: 200,
      };

      const service = new LLMService(customConfig);
      const config = service.getConfig();

      expect(config.baseURL).toBe(customConfig.baseURL);
      expect(config.temperature).toBe(customConfig.temperature);
      expect(config.maxTokens).toBe(customConfig.maxTokens);
    });

    it('should update config', () => {
      const service = new LLMService();
      service.updateConfig({ temperature: 0.9 });

      const config = service.getConfig();
      expect(config.temperature).toBe(0.9);
    });
  });

  describe('Health Check', () => {
    it('should check server availability', async () => {
      const isAvailable = await llmService.healthCheck();

      if (mockServerAvailable) {
        expect(isAvailable).toBe(true);
      } else {
        expect(isAvailable).toBe(false);
      }
    });

    it('should get available models', async () => {
      if (!mockServerAvailable) {
        console.log('Skipping: Mock server not available');
        return;
      }

      const models = await llmService.getModels();
      expect(models).toBeDefined();
      expect(models.data).toBeDefined();
    });
  });

  describe('Chat Completion', () => {
    it('should send basic chat completion request', async () => {
      if (!mockServerAvailable) {
        console.log('Skipping: Mock server not available');
        return;
      }

      const response = await llmService.chatCompletion({
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'Hello!' },
        ],
        temperature: 0.7,
        max_tokens: 50,
      });

      expect(response).toBeDefined();
      expect(response.choices).toBeDefined();
      expect(response.choices.length).toBeGreaterThan(0);
      expect(response.choices[0].message.content).toBeDefined();
    });
  });

  describe('Apology Generation', () => {
    it('should generate gentle apology', async () => {
      if (!mockServerAvailable) {
        console.log('Skipping: Mock server not available');
        return;
      }

      const result = await llmService.generateApology({
        message: '今天很累',
        style: 'gentle',
      });

      expect(result).toBeDefined();
      expect(result.reply).toBeDefined();
      expect(result.style).toBe('gentle');
      expect(result.emotion).toBeDefined();
      expect(typeof result.reply).toBe('string');
      expect(result.reply.length).toBeGreaterThan(0);
    });

    it('should generate formal apology', async () => {
      if (!mockServerAvailable) {
        console.log('Skipping: Mock server not available');
        return;
      }

      const result = await llmService.generateApology({
        message: '项目进展不顺利',
        style: 'formal',
      });

      expect(result).toBeDefined();
      expect(result.style).toBe('formal');
      expect(result.reply).toBeDefined();
    });

    it('should generate empathetic apology', async () => {
      if (!mockServerAvailable) {
        console.log('Skipping: Mock server not available');
        return;
      }

      const result = await llmService.generateApology({
        message: '感觉很沮丧',
        style: 'empathetic',
      });

      expect(result).toBeDefined();
      expect(result.style).toBe('empathetic');
      expect(result.reply).toBeDefined();
    });

    it('should detect emotion from message', async () => {
      if (!mockServerAvailable) {
        console.log('Skipping: Mock server not available');
        return;
      }

      const result = await llmService.generateApology({
        message: '今天工作太累了，感觉很烦躁',
      });

      expect(result.emotion).toBeDefined();
      // Should detect either 'tired' or 'annoyed'
      expect(['tired', 'annoyed', 'neutral']).toContain(result.emotion);
    });

    it('should include conversation history', async () => {
      if (!mockServerAvailable) {
        console.log('Skipping: Mock server not available');
        return;
      }

      const history = [
        { role: 'user' as const, content: '我今天心情不好' },
        { role: 'assistant' as const, content: '非常抱歉听到这个消息...' },
      ];

      const result = await llmService.generateApology({
        message: '还是觉得很难受',
        history,
      });

      expect(result).toBeDefined();
      expect(result.reply).toBeDefined();
    });

    it('should return token usage', async () => {
      if (!mockServerAvailable) {
        console.log('Skipping: Mock server not available');
        return;
      }

      const result = await llmService.generateApology({
        message: '测试消息',
      });

      expect(result.tokensUsed).toBeDefined();
      expect(result.tokensUsed).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle connection refused error', async () => {
      const service = new LLMService({
        baseURL: 'http://localhost:9999', // Non-existent server
        timeout: 2000,
      });

      await expect(
        service.generateApology({ message: 'test' })
      ).rejects.toThrow(LLMError);

      try {
        await service.generateApology({ message: 'test' });
      } catch (error) {
        expect(error).toBeInstanceOf(LLMError);
        expect((error as LLMError).code).toBe('CONNECTION_REFUSED');
      }
    });

    it('should handle timeout error', async () => {
      if (!mockServerAvailable) {
        console.log('Skipping: Mock server not available');
        return;
      }

      const service = new LLMService({
        baseURL: TEST_LM_STUDIO_URL,
        timeout: 1, // Very short timeout
      });

      await expect(
        service.generateApology({ message: 'test' })
      ).rejects.toThrow(LLMError);
    });
  });
});
