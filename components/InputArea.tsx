
import React, { useRef, useEffect } from 'react';
import { ArrowUp, Paperclip, Sparkles } from 'lucide-react';

interface InputAreaProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  isCentered?: boolean;
  onDiscover?: () => void; // New prop for discovery mode
}

const InputArea: React.FC<InputAreaProps> = ({ input, setInput, onSend, isLoading, onDiscover }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className={`relative bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-stone-200 transition-all duration-300 focus-within:shadow-[0_4px_20px_rgba(0,0,0,0.08)] focus-within:border-stone-300`}>
        
        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="اسأل عن الرحلات، الفنادق، الأسعار، أو خطط لرحلتك..."
          className="w-full bg-transparent border-none text-stone-800 placeholder-stone-400 text-lg px-6 py-5 focus:ring-0 resize-none min-h-[80px] max-h-[200px] rounded-3xl"
          rows={1}
          style={{ overflowY: input.length > 100 ? 'auto' : 'hidden' }}
        />

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-between px-4 pb-3">
          <div className="flex items-center gap-2">
            {/* Attachment Button */}
            <button className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full transition-colors" title="إرفاق ملف">
              <Paperclip className="w-5 h-5" />
            </button>
            
             {/* Discover Button (Replaces Thinking) */}
             <button 
               onClick={onDiscover}
               className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-stone-50 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 border border-stone-200 rounded-full text-xs font-medium text-stone-600 transition-colors"
               title="دع الذكاء الاصطناعي يختار لك وجهة"
             >
              <Sparkles className="w-3.5 h-3.5" />
              <span>اكتشف وجهتك</span>
            </button>
          </div>

          {/* Send Button */}
          <button
            onClick={onSend}
            disabled={isLoading || !input.trim()}
            className={`p-2.5 rounded-full transition-all duration-200 flex items-center justify-center transform
              ${input.trim() 
                ? 'bg-stone-900 text-white shadow-md hover:bg-black hover:scale-105' 
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }
            `}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-stone-400 border-t-white rounded-full animate-spin" />
            ) : (
              <ArrowUp className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputArea;
