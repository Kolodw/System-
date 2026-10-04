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
  Archive,
  Sun,
  Moon,
  Sliders,
} from 'lucide-react';
import { sound } from '../utils/sound';
import { ThemeMode } from '../types';

interface ActionControlsProps {
  onSendMessage: (text: string) => void;
  onOpenDice: () => void;
  onOpenSetup: () => void;
  onUndo: () => void;
  onSave: () => void;
  onLoad: () => void;
  onExport: () => void;
  onReset: () => void;
  onOpenArchives?: () => void;
  onToggleTheme?: () => void;
  onOpenHub?: () => void;
  archivesCount?: number;
  themeMode?: ThemeMode;
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
  onOpenArchives,
  onToggleTheme,
  onOpenHub,
  archivesCount = 0,
  themeMode = 'dark',
  disabled,
  canUndo,
}) => {
  const isWhite = themeMode === 'white';
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
    <div
      className={`w-full border-t backdrop-blur-xl px-2 sm:px-4 pt-2.5 pb-safe transition-colors ${
        isWhite
          ? 'bg-white/95 border-slate-200 text-slate-800'
          : 'bg-slate-950/95 border-indigo-500/20 text-slate-200'
      }`}
    >
      <div className="max-w-5xl mx-auto space-y-2">
        {/* Quick RP Action Chips & Utilities (Horizontally scrollable with touch momentum) */}
        <div className="flex items-center justify-between gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar touch-pan-x">
          <div className="flex items-center gap-1.5 flex-nowrap shrink-0">
            <span
              className={`text-[11px] font-mono hidden sm:inline ${
                isWhite ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              คีย์ลัด:
            </span>

            <button
              type="button"
              disabled={disabled}
              onClick={() => insertPrefix('พูดว่า: "', '"')}
              className={`px-2.5 py-1.5 rounded-lg border transition flex items-center gap-1 text-[11px] whitespace-nowrap min-h-[32px] touch-manipulation ${
                isWhite
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                  : 'bg-slate-800/80 active:bg-slate-700 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3 h-3 text-sky-500" />
              <span>"บทพูด"</span>
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={() => insertPrefix('*', '*')}
              className={`px-2.5 py-1.5 rounded-lg border transition flex items-center gap-1 text-[11px] whitespace-nowrap min-h-[32px] touch-manipulation ${
                isWhite
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                  : 'bg-slate-800/80 active:bg-slate-700 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <Swords className="w-3 h-3 text-rose-500" />
              <span>*การกระทำ*</span>
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={() => insertPrefix('[ตรวจสอบ: ', ']')}
              className={`px-2.5 py-1.5 rounded-lg border transition flex items-center gap-1 text-[11px] whitespace-nowrap min-h-[32px] touch-manipulation ${
                isWhite
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                  : 'bg-slate-800/80 active:bg-slate-700 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <Eye className="w-3 h-3 text-purple-500" />
              <span>[ตรวจดู]</span>
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={onOpenDice}
              className={`px-2.5 py-1.5 rounded-lg border transition flex items-center gap-1 text-[11px] whitespace-nowrap min-h-[32px] touch-manipulation ${
                isWhite
                  ? 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700'
                  : 'bg-indigo-950 active:bg-indigo-900 border-indigo-500/40 text-indigo-200 hover:text-white'
              }`}
            >
              <Dices className="w-3.5 h-3.5 text-indigo-500" />
              <span>ทอยเต๋า</span>
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={onOpenSetup}
              className={`px-2.5 py-1.5 rounded-lg border transition flex items-center gap-1 text-[11px] whitespace-nowrap min-h-[32px] touch-manipulation ${
                isWhite
                  ? 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700'
                  : 'bg-purple-950 active:bg-purple-900 border-purple-500/40 text-purple-200 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span>จุติใหม่</span>
            </button>
          </div>

          {/* Quick Toolbar Tools */}
          <div className="flex items-center gap-1 flex-nowrap ml-auto shrink-0">
            {/* System Select Hub Button */}
            {onOpenHub && (
              <button
                type="button"
                onClick={onOpenHub}
                title="เปิดหน้าต่างเลือกระบบ (Select Hub)"
                className="px-2 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition flex items-center gap-1 shadow-sm select-card-glow min-h-[32px] touch-manipulation border border-indigo-400/30 active:scale-95"
              >
                <Sliders className="w-3 h-3 animate-pulse" />
                <span className="text-[10px] hidden xs:inline">เลือกระบบ</span>
              </button>
            )}

            {/* Theme Toggle Button */}
            {onToggleTheme && (
              <button
                type="button"
                onClick={onToggleTheme}
                title={isWhite ? 'เปลี่ยนเป็นธีมมืด (สีดำ)' : 'เปลี่ยนเป็นธีมสว่าง (สีขาว)'}
                className={`p-1.5 sm:p-2 rounded-lg border transition min-w-[32px] min-h-[32px] flex items-center justify-center touch-manipulation ${
                  isWhite
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-amber-600'
                    : 'bg-slate-900 active:bg-slate-800 border-slate-700 text-amber-400 hover:text-amber-300'
                }`}
              >
                {isWhite ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              </button>
            )}

            {/* Archives Modal Button */}
            {onOpenArchives && (
              <button
                type="button"
                onClick={onOpenArchives}
                title="คลังประวัติการผจญภัย (Archives)"
                className={`relative p-1.5 sm:p-2 rounded-lg border transition min-w-[32px] min-h-[32px] flex items-center justify-center touch-manipulation ${
                  isWhite
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-indigo-600'
                    : 'bg-slate-900 active:bg-slate-800 border-slate-700 text-indigo-400 hover:text-indigo-300'
                }`}
              >
                <Archive className="w-3.5 h-3.5" />
                {archivesCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 text-[9px] font-bold text-white flex items-center justify-center">
                    {archivesCount > 9 ? '9+' : archivesCount}
                  </span>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={handleToggleSound}
              title={isSoundOn ? 'ปิดเสียงเอฟเฟกต์' : 'เปิดเสียงเอฟเฟกต์'}
              className={`p-1.5 sm:p-2 rounded-lg border transition min-w-[32px] min-h-[32px] flex items-center justify-center touch-manipulation ${
                isWhite
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-600'
                  : 'bg-slate-900 active:bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {isSoundOn ? (
                <Volume2 className="w-3.5 h-3.5 text-indigo-500" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            {canUndo && (
              <button
                type="button"
                disabled={disabled}
                onClick={onUndo}
                title="ย้อนเทิร์นล่าสุด (Undo)"
                className={`p-1.5 sm:p-2 rounded-lg border transition disabled:opacity-50 min-w-[32px] min-h-[32px] flex items-center justify-center touch-manipulation ${
                  isWhite
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-600'
                    : 'bg-slate-900 active:bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={onSave}
              title="บันทึกเซฟด่วน (Save)"
              className={`p-1.5 sm:p-2 rounded-lg border transition min-w-[32px] min-h-[32px] flex items-center justify-center touch-manipulation ${
                isWhite
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-600'
                  : 'bg-slate-900 active:bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <Save className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onReset}
              title="รีเซ็ต / เริ่มเรื่องใหม่"
              className={`p-1.5 sm:p-2 rounded-lg border transition min-w-[32px] min-h-[32px] flex items-center justify-center touch-manipulation ${
                isWhite
                  ? 'bg-slate-100 hover:bg-rose-50 border-slate-300 text-slate-600 hover:text-rose-600'
                  : 'bg-slate-900 active:bg-slate-800 border-slate-700 text-slate-400 hover:text-rose-400'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Input Bar with iOS Zoom Prevention (text-base on mobile, text-sm on sm+) */}
        <div
          className={`relative flex items-end gap-1.5 sm:gap-2 rounded-2xl border p-1.5 sm:p-2 shadow-sm transition ${
            isWhite
              ? 'bg-slate-100/90 border-slate-300 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-400/40'
              : 'bg-slate-900/90 border-indigo-500/30 focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-400/50 shadow-inner'
          }`}
        >
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
            className={`flex-1 bg-transparent px-2.5 sm:px-3 py-1.5 sm:py-2 text-base sm:text-sm focus:outline-none resize-none max-h-32 overflow-y-auto leading-relaxed ${
              isWhite
                ? 'text-slate-900 placeholder-slate-400'
                : 'text-slate-100 placeholder-slate-500'
            }`}
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
