import { ChatMessage } from '../types/index.js';

// Session data structure
export interface Session {
  id: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Simple in-memory session management service
 * For MVP - can be replaced with database storage later
 */
export class SessionService {
  private sessions: Map<string, Session> = new Map();
  private readonly MAX_SESSIONS = 100; // Limit to prevent memory issues
  private readonly SESSION_TTL = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Get or create a session
   */
  getOrCreateSession(sessionId: string): Session {
    let session = this.sessions.get(sessionId);

    if (!session) {
      session = {
        id: sessionId,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.sessions.set(sessionId, session);

      // Clean up old sessions if we've hit the limit
      this.cleanupOldSessions();
    }

    return session;
  }

  /**
   * Add a message to a session
   */
  addMessage(sessionId: string, message: ChatMessage): Session {
    const session = this.getOrCreateSession(sessionId);
    session.messages.push(message);
    session.updatedAt = new Date();
    return session;
  }

  /**
   * Get session messages
   */
  getMessages(sessionId: string): ChatMessage[] {
    const session = this.sessions.get(sessionId);
    return session ? session.messages : [];
  }

  /**
   * Clear session history
   */
  clearSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.messages = [];
      session.updatedAt = new Date();
    }
  }

  /**
   * Delete a session
   */
  deleteSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  /**
   * Get all session IDs (for admin/debugging)
   */
  getAllSessionIds(): string[] {
    return Array.from(this.sessions.keys());
  }

  /**
   * Get session count
   */
  getSessionCount(): number {
    return this.sessions.size;
  }

  /**
   * Clean up old sessions to prevent memory issues
   */
  private cleanupOldSessions(): void {
    if (this.sessions.size <= this.MAX_SESSIONS) {
      return;
    }

    const now = Date.now();
    const sessionsToDelete: string[] = [];

    // Find sessions older than TTL
    for (const [id, session] of this.sessions.entries()) {
      const age = now - session.updatedAt.getTime();
      if (age > this.SESSION_TTL) {
        sessionsToDelete.push(id);
      }
    }

    // Delete old sessions
    sessionsToDelete.forEach(id => this.sessions.delete(id));

    // If still over limit, delete oldest sessions
    if (this.sessions.size > this.MAX_SESSIONS) {
      const sessions = Array.from(this.sessions.entries());
      sessions.sort((a, b) => a[1].updatedAt.getTime() - b[1].updatedAt.getTime());

      const toDelete = sessions.slice(0, this.sessions.size - this.MAX_SESSIONS);
      toDelete.forEach(([id]) => this.sessions.delete(id));
    }
  }

  /**
   * Get session info (for debugging)
   */
  getSessionInfo(sessionId: string): Session | undefined {
    return this.sessions.get(sessionId);
  }
}

// Export singleton instance
export const sessionService = new SessionService();
