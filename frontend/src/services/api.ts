import axios from 'axios';
import { SendMessageRequest, SendMessageResponse, HistoryResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

/**
 * Send a message and get apology response
 */
export async function sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
  try {
    const response = await api.post<SendMessageResponse>('/api/chat/message', request);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to send message');
    }
    throw error;
  }
}

/**
 * Get conversation history
 */
export async function getHistory(sessionId: string): Promise<HistoryResponse> {
  try {
    const response = await api.get<HistoryResponse>('/api/chat/history', {
      params: { sessionId },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to get history');
    }
    throw error;
  }
}

/**
 * Clear conversation history
 */
export async function clearHistory(sessionId: string): Promise<void> {
  try {
    await api.delete('/api/chat/history', {
      params: { sessionId },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to clear history');
    }
    throw error;
  }
}

/**
 * Delete a session
 */
export async function deleteSession(sessionId: string): Promise<void> {
  try {
    await api.delete('/api/chat/session', {
      params: { sessionId },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to delete session');
    }
    throw error;
  }
}
