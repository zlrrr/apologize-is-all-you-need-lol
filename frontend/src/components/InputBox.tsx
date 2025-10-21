import { useState, KeyboardEvent, FormEvent } from 'react';

interface InputBoxProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export const InputBox: React.FC<InputBoxProps> = ({
  onSend,
  isLoading,
  placeholder = '说说你的感受...',
}) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 bg-white p-4">
      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
          disabled={isLoading}
          rows={1}
          className="
            flex-1 resize-none rounded-lg border border-gray-300 px-4 py-3
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            text-sm
          "
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="
            px-6 py-3 rounded-lg font-medium text-sm
            bg-blue-500 text-white
            hover:bg-blue-600 active:bg-blue-700
            disabled:bg-gray-300 disabled:cursor-not-allowed
            transition-colors duration-200
          "
        >
          {isLoading ? '发送中...' : '发送'}
        </button>
      </div>
    </form>
  );
};
