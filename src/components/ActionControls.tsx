import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Dices,
  Sparkles,
  Volume2,
  VolumeX,
  Save,
  RotateCcw,
  Download,
  MessageSquare,
  Swords,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { sound } from '../utils/sound';

interface ActionControlsProps {
  onSendMessage: (text: string) => void;
  onOpenDice: () => void;
  onOpenSetup: () => void;
  onUndo: () => void;
  onSave: () => void;
  onLoad: () => void;
  onExport: () => void;
  onReset: () => void;
  disabled: boolean;
  canUndo: boolean;
}

export const ActionControls: React.FC<ActionControlsProps> = ({
  onSendMessage,
  onOpenDice,
  onOpenSetup,
  onUndo,
  onSave,
  onLoad,
  onExport,
  onReset,
  disabled,
  canUndo,
}) => {
  const [input, setInput] = useState('');
  const [isSoundOn, setIsSoundOn] = useState(sound.enabled);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim() || disabled) return;
    sound.playClick();
    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const insertPrefix = (prefix: string, suffix: string = '') => {
    sound.playClick();
    setInput((prev) => {
      if (!prev) return `${prefix}${suffix}`;
      return `${prev} ${prefix}${suffix}`;
    });
    textareaRef.current?.focus();
  };

  const handleToggleSound = () => {
    const nextState = sound.toggle();
    setIsSoundOn(nextState);
  };

  return (
    <div className="w-full bg-slate-950/95 border-t border-indigo-500/20 backdrop-blur-xl px-2 sm:px-4 pt-2.5 pb-safe text-slate-200">
      <div className="max-w-5xl mx-auto space-y-2">
        {/* Quick RP Action Chips & Utilities (Horizontally scrollable with touch momentum) */}
        <div className="flex items-center justify-between gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar touch-pan-x">
          <div className="flex items-center gap-1.5 flex-nowrap shrink-0">
            <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">คีย์ลัด:</span>

            <button
              type="button"
              disabled={disabled}
              onClick={() => insertPrefix('พูดว่า: "', '"')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 active:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1 text-[11px] whitespace-nowrap min-h-[32px] touch-manipulation"
            >
              <MessageSquare className="w-3 h-3 text-sky-400" />
              <span>"บทพูด"</span>
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={() => insertPrefix('*', '*')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 active:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1 text-[11px] whitespace-nowrap min-h-[32px] touch-manipulation"
            >
              <Swords className="w-3 h-3 text-rose-400" />
              <span>*การกระทำ*</span>
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={() => insertPrefix('[ตรวจสอบ: ', ']')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 active:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1 text-[11px] whitespace-nowrap min-h-[32px] touch-manipulation"
            >
              <Eye className="w-3 h-3 text-purple-400" />
              <span>[ตรวจดู]</span>
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={onOpenDice}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-950 active:bg-indigo-900 border border-indigo-500/40 text-indigo-200 hover:text-white transition flex items-center gap-1 text-[11px] whitespace-nowrap min-h-[32px] touch-manipulation"
            >
              <Dices className="w-3.5 h-3.5 text-indigo-400" />
              <span>ทอยเต๋า</span>
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={onOpenSetup}
              className="px-2.5 py-1.5 rounded-lg bg-purple-950 active:bg-purple-900 border border-purple-500/40 text-purple-200 hover:text-white transition flex items-center gap-1 text-[11px] whitespace-nowrap min-h-[32px] touch-manipulation"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>จุติใหม่</span>
            </button>
          </div>

          {/* Quick Toolbar Tools */}
          <div className="flex items-center gap-1 flex-nowrap ml-auto shrink-0">
            <button
              type="button"
              onClick={handleToggleSound}
              title={isSoundOn ? 'ปิดเสียงเอฟเฟกต์' : 'เปิดเสียงเอฟเฟกต์'}
              className="p-1.5 sm:p-2 rounded-lg bg-slate-900 active:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition min-w-[32px] min-h-[32px] flex items-center justify-center touch-manipulation"
            >
              {isSoundOn ? (
                <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
              )}
            </button>

            {canUndo && (
              <button
                type="button"
                disabled={disabled}
                onClick={onUndo}
                title="ย้อนเทิร์นล่าสุด (Undo)"
                className="p-1.5 sm:p-2 rounded-lg bg-slate-900 active:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition disabled:opacity-50 min-w-[32px] min-h-[32px] flex items-center justify-center touch-manipulation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={onSave}
              title="บันทึกเกม (Save)"
              className="p-1.5 sm:p-2 rounded-lg bg-slate-900 active:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition min-w-[32px] min-h-[32px] flex items-center justify-center touch-manipulation"
            >
              <Save className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onExport}
              title="ส่งออกบันทึกการเดินทาง (Export Chronicle)"
              className="p-1.5 sm:p-2 rounded-lg bg-slate-900 active:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition min-w-[32px] min-h-[32px] flex items-center justify-center touch-manipulation hidden sm:flex"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Input Bar with iOS Zoom Prevention (text-base on mobile, text-sm on sm+) */}
        <div className="relative flex items-end gap-1.5 sm:gap-2 bg-slate-900/90 rounded-2xl border border-indigo-500/30 p-1.5 sm:p-2 shadow-inner focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-400/50 transition">
          <textarea
            ref={textareaRef}
            rows={1}
            disabled={disabled}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              disabled
                ? 'Game Master กำลังประมวลผลเรื่องราว...'
                : 'พิมพ์การกระทำหรือคำพูดของคุณ...'
            }
            className="flex-1 bg-transparent px-2.5 sm:px-3 py-1.5 sm:py-2 text-base sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none max-h-32 overflow-y-auto leading-relaxed"
          />

          <button
            type="button"
            disabled={disabled || !input.trim()}
            onClick={handleSend}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 active:from-indigo-700 active:to-purple-700 text-white shadow-md shadow-indigo-600/30 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shrink-0 touch-manipulation"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
