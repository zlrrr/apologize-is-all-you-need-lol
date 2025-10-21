import { useState } from 'react';

export interface Session {
  id: string;
  name: string;
  lastMessage?: string;
  updatedAt: Date;
  messageCount: number;
}

interface SessionListProps {
  sessions: Session[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
  onDeleteSession: (sessionId: string) => void;
}

export const SessionList: React.FC<SessionListProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 1000 / 60 / 60);

    if (hours < 1) return '刚刚';
    if (hours < 24) return `${hours}小时前`;
    if (hours < 48) return '昨天';
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="relative">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-1.5 text-sm rounded border border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        会话列表
        {sessions.length > 0 && (
          <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
            {sessions.length}
          </span>
        )}
      </button>

      {/* Session list panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-25 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">会话列表</h3>
              <button
                onClick={() => {
                  onNewSession();
                  setIsOpen(false);
                }}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
              >
                新建会话
              </button>
            </div>

            {/* Session list */}
            <div className="overflow-y-auto flex-1">
              {sessions.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p className="text-sm">暂无会话</p>
                  <p className="text-xs mt-1">点击上方按钮创建新会话</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className={`
                        p-4 cursor-pointer hover:bg-gray-50 transition-colors
                        ${activeSessionId === session.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}
                      `}
                      onClick={() => {
                        onSelectSession(session.id);
                        setIsOpen(false);
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-800 text-sm truncate">
                            {session.name}
                          </h4>
                          {session.lastMessage && (
                            <p className="text-xs text-gray-500 mt-1 truncate">
                              {session.lastMessage}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                            <span>{formatDate(session.updatedAt)}</span>
                            <span>•</span>
                            <span>{session.messageCount} 条消息</span>
                          </div>
                        </div>

                        {/* Delete button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('确定要删除这个会话吗？')) {
                              onDeleteSession(session.id);
                            }
                          }}
                          className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
