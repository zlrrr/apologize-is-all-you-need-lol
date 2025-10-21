import axios, { AxiosInstance } from 'axios';
import {
  ChatMessage,
  ApologyRequest,
  ApologyResponse,
  LLMConfig,
  LLMError,
  OpenAIChatRequest,
  OpenAIChatResponse,
  ApologyStyle,
} from '../types/index.js';
import { getSystemPrompt, detectEmotion } from '../prompts/apology.prompts.js';

export class LLMService {
  private client: AxiosInstance;
  private config: Required<LLMConfig>;

  constructor(config?: Partial<LLMConfig>) {
    // Default configuration
    this.config = {
      baseURL: config?.baseURL || process.env.LM_STUDIO_URL || 'http://127.0.0.1:1234',
      model: config?.model || process.env.LLM_MODEL_NAME || 'local-model',
      temperature: config?.temperature || parseFloat(process.env.LLM_TEMPERATURE || '0.7'),
      maxTokens: config?.maxTokens || parseInt(process.env.LLM_MAX_TOKENS || '500'),
      timeout: config?.timeout || 30000,
    };

    // Create axios instance for LM Studio API
    this.client = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Generate an apology response based on user message
   */
  async generateApology(params: ApologyRequest): Promise<ApologyResponse> {
    try {
      const { message, style = 'gentle', history = [] } = params;

      // Detect emotion from user message
      const detectedEmotion = params.emotion || detectEmotion(message);

      // Build messages array
      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: getSystemPrompt(style),
        },
        ...history,
        {
          role: 'user',
          content: message,
        },
      ];

      // Call LLM API
      const response = await this.chatCompletion({
        messages,
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens,
      });

      return {
        reply: response.choices[0].message.content,
        emotion: detectedEmotion,
        style,
        tokensUsed: response.usage.total_tokens,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Send a chat completion request to LM Studio
   */
  async chatCompletion(request: OpenAIChatRequest): Promise<OpenAIChatResponse> {
    try {
      const response = await this.client.post<OpenAIChatResponse>(
        '/v1/chat/completions',
        {
          model: this.config.model,
          ...request,
        }
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Check if LM Studio is available
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/v1/models', {
        timeout: 5000,
      });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get available models from LM Studio
   */
  async getModels(): Promise<any> {
    try {
      const response = await this.client.get('/v1/models');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle and transform errors
   */
  private handleError(error: unknown): LLMError {
    // If error is already an LLMError, return it directly
    if (error instanceof LLMError) {
      return error;
    }

    if (axios.isAxiosError(error)) {
      // Check for connection refused errors
      if (error.code === 'ECONNREFUSED' ||
          error.message?.includes('ECONNREFUSED') ||
          error.message?.includes('connect') && error.message?.includes('refused')) {
        return new LLMError(
          'Cannot connect to LM Studio. Please ensure LM Studio is running.',
          'CONNECTION_REFUSED',
          undefined,
          error
        );
      }

      // Check for response errors
      if (error.response) {
        return new LLMError(
          `LM Studio API error: ${error.response.statusText}`,
          'API_ERROR',
          error.response.status,
          error
        );
      }

      // Check for timeout errors
      if (error.code === 'ETIMEDOUT' ||
          error.code === 'ECONNABORTED' ||
          error.message?.includes('timeout')) {
        return new LLMError(
          'Request to LM Studio timed out',
          'TIMEOUT',
          undefined,
          error
        );
      }

      // Other network errors
      return new LLMError(
        `Network error: ${error.message}`,
        'NETWORK_ERROR',
        undefined,
        error
      );
    }

    if (error instanceof Error) {
      return new LLMError(
        error.message,
        'UNKNOWN_ERROR',
        undefined,
        error
      );
    }

    return new LLMError(
      'An unknown error occurred',
      'UNKNOWN_ERROR'
    );
  }

  /**
   * Update service configuration
   */
  updateConfig(config: Partial<LLMConfig>): void {
    this.config = { ...this.config, ...config };

    // Recreate axios instance if baseURL changed
    if (config.baseURL) {
      this.client = axios.create({
        baseURL: this.config.baseURL,
        timeout: this.config.timeout,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): Required<LLMConfig> {
    return { ...this.config };
  }
}

// Export a singleton instance
export const llmService = new LLMService();
