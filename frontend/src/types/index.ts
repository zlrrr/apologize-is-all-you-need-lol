// Chat message types
export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

// Apology style types
export type ApologyStyle = 'gentle' | 'formal' | 'empathetic';

// API request types
export interface SendMessageRequest {
  message: string;
  style?: ApologyStyle;
  sessionId?: string;
}

// API response types
export interface SendMessageResponse {
  sessionId: string;
  reply: string;
  emotion?: string;
  style: ApologyStyle;
  tokensUsed?: number;
  timestamp: string;
}

export interface HistoryResponse {
  sessionId: string;
  messages: Message[];
  messageCount: number;
  createdAt?: string;
  updatedAt?: string;
}

// UI state types
export interface ChatState {
  messages: Message[];
  sessionId: string | null;
  isLoading: boolean;
  error: string | null;
  style: ApologyStyle;
}
