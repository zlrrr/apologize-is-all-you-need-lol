import { Message } from '../types';
import { Session } from '../components/SessionList';

const SESSIONS_KEY = 'apology_sessions';
const ACTIVE_SESSION_KEY = 'apology_active_session';

export interface StoredSession {
  id: string;
  name: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Get all sessions from localStorage
 */
export function getSessions(): StoredSession[] {
  try {
    const data = localStorage.getItem(SESSIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get sessions:', error);
    return [];
  }
}

/**
 * Save sessions to localStorage
 */
export function saveSessions(sessions: StoredSession[]): void {
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Failed to save sessions:', error);
  }
}

/**
 * Get a specific session by ID
 */
export function getSession(sessionId: string): StoredSession | null {
  const sessions = getSessions();
  return sessions.find(s => s.id === sessionId) || null;
}

/**
 * Save or update a session
 */
export function saveSession(session: StoredSession): void {
  const sessions = getSessions();
  const index = sessions.findIndex(s => s.id === session.id);

  if (index >= 0) {
    sessions[index] = session;
  } else {
    sessions.push(session);
  }

  saveSessions(sessions);
}

/**
 * Delete a session
 */
export function deleteSession(sessionId: string): void {
  const sessions = getSessions();
  const filtered = sessions.filter(s => s.id !== sessionId);
  saveSessions(filtered);
}

/**
 * Get active session ID
 */
export function getActiveSessionId(): string | null {
  return localStorage.getItem(ACTIVE_SESSION_KEY);
}

/**
 * Set active session ID
 */
export function setActiveSessionId(sessionId: string): void {
  localStorage.setItem(ACTIVE_SESSION_KEY, sessionId);
}

/**
 * Clear active session ID
 */
export function clearActiveSessionId(): void {
  localStorage.removeItem(ACTIVE_SESSION_KEY);
}

/**
 * Convert stored session to session list item
 */
export function toSessionListItem(stored: StoredSession): Session {
  const lastMessage = stored.messages.length > 0
    ? stored.messages[stored.messages.length - 1].content
    : undefined;

  return {
    id: stored.id,
    name: stored.name,
    lastMessage: lastMessage?.substring(0, 50) + (lastMessage && lastMessage.length > 50 ? '...' : ''),
    updatedAt: new Date(stored.updatedAt),
    messageCount: stored.messages.length,
  };
}

/**
 * Generate session name from first message
 */
export function generateSessionName(firstMessage: string): string {
  const maxLength = 30;
  if (firstMessage.length <= maxLength) {
    return firstMessage;
  }
  return firstMessage.substring(0, maxLength) + '...';
}
