import { useState, useEffect, useRef } from 'react';
import { Message, ApologyStyle } from '../types';
import { MessageBubble } from './MessageBubble';
import { InputBox } from './InputBox';
import { SessionList, Session } from './SessionList';
import { ApologyCharacter } from './ApologyCharacter';
import { sendMessage as sendMessageApi } from '../services/api';
import {
  getSessions,
  getSession,
  saveSession,
  deleteSession as deleteStoredSession,
  getActiveSessionId,
  setActiveSessionId,
  clearActiveSessionId,
  toSessionListItem,
  generateSessionName,
  StoredSession,
} from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [style, setStyle] = useState<ApologyStyle>('gentle');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load sessions and active session on mount
  useEffect(() => {
    loadSessions();
    const activeId = getActiveSessionId();
    if (activeId) {
      loadSession(activeId);
    }
  }, []);

  // Save current session when messages change
  useEffect(() => {
    if (sessionId && messages.length > 0) {
      const stored = getSession(sessionId);
      const sessionName = stored?.name || generateSessionName(messages[0].content);

      const updatedSession: StoredSession = {
        id: sessionId,
        name: sessionName,
        messages,
        createdAt: stored?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      saveSession(updatedSession);
      loadSessions();
    }
  }, [messages, sessionId]);

  const loadSessions = () => {
    const stored = getSessions();
    const sessionList = stored.map(toSessionListItem);
    sessionList.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    setSessions(sessionList);
  };

  const loadSession = (sid: string) => {
    const stored = getSession(sid);
    if (stored) {
      setSessionId(sid);
      setMessages(stored.messages);
      setActiveSessionId(sid);
    }
  };

  const handleNewSession = () => {
    setSessionId(null);
    setMessages([]);
    setError(null);
    clearActiveSessionId();
  };

  const handleSelectSession = (sid: string) => {
    loadSession(sid);
  };

  const handleDeleteSession = (sid: string) => {
    deleteStoredSession(sid);
    loadSessions();

    // If deleting active session, clear it
    if (sid === sessionId) {
      handleNewSession();
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    setIsLoading(true);
    setError(null);

    // Create or use existing session ID
    const currentSessionId = sessionId || uuidv4();
    if (!sessionId) {
      setSessionId(currentSessionId);
      setActiveSessionId(currentSessionId);
    }

    // Add user message to UI immediately
    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Send message to API
      const response = await sendMessageApi({
        message: content,
        style,
        sessionId: currentSessionId,
      });

      // Add assistant message
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.reply,
        timestamp: response.timestamp,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
      console.error('Failed to send message:', err);

      // Remove user message on error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (sessionId) {
      if (confirm('确定要清空当前会话的历史记录吗？')) {
        handleNewSession();
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Continuously visible apology character */}
            <ApologyCharacter
              showContinuously={true}
              size={100}
              className="flex-shrink-0"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                道歉助手
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                我会真诚地理解和支持你
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Session list */}
            <SessionList
              sessions={sessions}
              activeSessionId={sessionId}
              onSelectSession={handleSelectSession}
              onNewSession={handleNewSession}
              onDeleteSession={handleDeleteSession}
            />

            {/* Style selector */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">风格:</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value as ApologyStyle)}
                className="px-3 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="gentle">温和</option>
                <option value="formal">正式</option>
                <option value="empathetic">共情</option>
              </select>
            </div>

            {/* Clear button */}
            {messages.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="px-4 py-1.5 text-sm rounded border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                清空历史
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p className="text-lg mb-2">👋 你好！</p>
              <p className="text-sm">说说你的感受，我会认真倾听和理解</p>
              {sessions.length > 0 && (
                <p className="text-xs mt-4 text-gray-400">
                  点击右上角"会话列表"查看历史会话
                </p>
              )}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <MessageBubble key={index} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4 items-end gap-3">
                <ApologyCharacter isApologizing={true} size={80} className="animate-gentle-pulse" />
                <div className="bg-gray-200 rounded-2xl rounded-bl-none px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="px-6 py-2 bg-red-50 border-t border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Input area */}
      <InputBox onSend={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};
