import React from 'react';
import { Archive, Trash2, X, AlertTriangle, Sparkles, ArrowRight } from 'lucide-react';
import { sound } from '../utils/sound';
import { ThemeMode } from '../types';

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onArchiveAndReset: () => void;
  onDeleteAndReset: () => void;
  characterName: string;
  messageCount: number;
  themeMode?: ThemeMode;
}

export const ResetModal: React.FC<ResetModalProps> = ({
  isOpen,
  onClose,
  onArchiveAndReset,
  onDeleteAndReset,
  characterName,
  messageCount,
  themeMode = 'dark',
}) => {
  if (!isOpen) return null;
  const isWhite = themeMode === 'white';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all ${
          isWhite
            ? 'bg-white border border-slate-300 text-slate-800'
            : 'bg-slate-900 border border-indigo-500/40 text-slate-100'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-5 py-3.5 border-b ${
            isWhite
              ? 'bg-slate-50 border-slate-200 text-slate-900'
              : 'bg-slate-950/80 border-indigo-500/20'
          }`}
        >
          <div className="flex items-center gap-2.5 text-amber-500">
            <AlertTriangle className="w-5 h-5" />
            <h3
              className={`font-bold font-title tracking-wider text-sm sm:text-base ${
                isWhite ? 'text-slate-900' : 'text-white'
              }`}
            >
              เริ่มต้นเรื่องราวใหม่ (Reset Chronicle)
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition min-w-[32px] min-h-[32px] flex items-center justify-center touch-manipulation ${
              isWhite
                ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                : 'text-slate-400 hover:text-white active:bg-slate-800'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <p
            className={`text-xs sm:text-sm leading-relaxed ${
              isWhite ? 'text-slate-600' : 'text-slate-300'
            }`}
          >
            คุณกำลังจะรีเซ็ตการผจญภัยของ{' '}
            <strong className={isWhite ? 'text-indigo-700' : 'text-indigo-300'}>
              "{characterName}"
            </strong>{' '}
            (มีทั้งหมด{' '}
            <span
              className={`font-mono font-bold ${
                isWhite ? 'text-slate-900' : 'text-white'
              }`}
            >
              {messageCount}
            </span>{' '}
            ข้อความ)
            <br />
            คุณต้องการจัดการกับแชทปัจจุบันอย่างไร?
          </p>

          <div className="space-y-2.5 pt-1">
            {/* Option 1: Archive & Reset */}
            <button
              onClick={() => {
                sound.playLevelUp();
                onArchiveAndReset();
                onClose();
              }}
              className={`w-full p-3.5 rounded-xl border text-left transition flex items-center gap-3 group active:scale-[0.99] touch-manipulation ${
                isWhite
                  ? 'bg-indigo-50/90 hover:bg-indigo-100/90 border-indigo-200'
                  : 'bg-indigo-950/60 hover:bg-indigo-900/70 border-indigo-500/40'
              }`}
            >
              <div
                className={`p-2.5 rounded-lg border group-hover:scale-105 transition shrink-0 ${
                  isWhite
                    ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
                    : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                }`}
              >
                <Archive className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className={`text-xs sm:text-sm font-bold flex items-center justify-between ${
                    isWhite ? 'text-indigo-950' : 'text-white'
                  }`}
                >
                  <span>เก็บเข้าคลังประวัติ &amp; เริ่มใหม่</span>
                  <ArrowRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-1 transition" />
                </div>
                <p
                  className={`text-[11px] truncate ${
                    isWhite ? 'text-indigo-700' : 'text-indigo-300/80'
                  }`}
                >
                  บันทึกแชทนี้ไว้เปิดอ่านหรือโหลดเล่นต่อได้ตลอดเวลา
                </p>
              </div>
            </button>

            {/* Option 2: Delete & Reset */}
            <button
              onClick={() => {
                sound.playCombat();
                onDeleteAndReset();
                onClose();
              }}
              className={`w-full p-3.5 rounded-xl border text-left transition flex items-center gap-3 group active:scale-[0.99] touch-manipulation ${
                isWhite
                  ? 'bg-rose-50/90 hover:bg-rose-100/90 border-rose-200'
                  : 'bg-rose-950/40 hover:bg-rose-950/70 border-rose-500/30'
              }`}
            >
              <div
                className={`p-2.5 rounded-lg border group-hover:scale-105 transition shrink-0 ${
                  isWhite
                    ? 'bg-rose-100 text-rose-700 border-rose-300'
                    : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                }`}
              >
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className={`text-xs sm:text-sm font-bold flex items-center justify-between ${
                    isWhite ? 'text-rose-950' : 'text-rose-200'
                  }`}
                >
                  <span>ลบแชททิ้งถาวร &amp; เริ่มใหม่</span>
                  <ArrowRight className="w-4 h-4 text-rose-500 group-hover:translate-x-1 transition" />
                </div>
                <p
                  className={`text-[11px] truncate ${
                    isWhite ? 'text-rose-700' : 'text-rose-300/70'
                  }`}
                >
                  ล้างบทสนทนานี้ทิ้งทันทีโดยไม่เก็บประวัติ
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`px-5 py-3 border-t flex justify-end ${
            isWhite ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800'
          }`}
        >
          <button
            onClick={onClose}
            className={`px-4 py-1.5 text-xs rounded-lg transition ${
              isWhite
                ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ยกเลิก (เล่นต่อ)
          </button>
        </div>
      </div>
    </div>
  );
};
