import React from 'react';
import { ChatSessionArchive, ThemeMode } from '../types';
import {
  Archive,
  Play,
  Download,
  Trash2,
  X,
  Calendar,
  MessageSquare,
  Shield,
  Clock,
  Sparkles,
  PlusCircle,
} from 'lucide-react';
import { sound } from '../utils/sound';

interface ArchivesModalProps {
  isOpen: boolean;
  onClose: () => void;
  archives: ChatSessionArchive[];
  onLoadArchive: (archive: ChatSessionArchive) => void;
  onDeleteArchive: (id: string) => void;
  onClearAllArchives: () => void;
  onExportArchive: (archive: ChatSessionArchive) => void;
  onArchiveCurrentChat?: () => void;
  themeMode?: ThemeMode;
}

export const ArchivesModal: React.FC<ArchivesModalProps> = ({
  isOpen,
  onClose,
  archives,
  onLoadArchive,
  onDeleteArchive,
  onClearAllArchives,
  onExportArchive,
  onArchiveCurrentChat,
  themeMode = 'dark',
}) => {
  if (!isOpen) return null;
  const isWhite = themeMode === 'white';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] transition-all ${
          isWhite
            ? 'bg-white border border-slate-300 text-slate-800'
            : 'bg-slate-900 border border-indigo-500/40 text-slate-100'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-5 py-3.5 border-b pt-safe sm:pt-3.5 ${
            isWhite
              ? 'bg-slate-50 border-slate-200 text-slate-900'
              : 'bg-slate-950/80 border-indigo-500/20 text-slate-100'
          }`}
        >
          <div className="flex items-center gap-2.5 text-indigo-500">
            <Archive className="w-5 h-5" />
            <div>
              <h3
                className={`font-bold font-title tracking-wider text-sm sm:text-base ${
                  isWhite ? 'text-slate-900' : 'text-white'
                }`}
              >
                คลังบันทึกการผจญภัย (Chronicle Archives)
              </h3>
              <p
                className={`text-[11px] ${
                  isWhite ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                ทั้งหมด {archives.length} บันทึกประวัติศาสตร์
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onArchiveCurrentChat && (
              <button
                onClick={() => {
                  sound.playLevelUp();
                  onArchiveCurrentChat();
                }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 touch-manipulation shadow-sm ${
                  isWhite
                    ? 'bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700'
                    : 'bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-200'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5 text-indigo-500" />
                <span className="hidden sm:inline">บันทึกแชทปัจจุบัน</span>
                <span className="sm:hidden">บันทึกแชท</span>
              </button>
            )}

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
        </div>

        {/* Content list */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {archives.length === 0 ? (
            <div
              className={`p-8 text-center space-y-3 rounded-xl border ${
                isWhite
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-slate-950/40 border-slate-800'
              }`}
            >
              <Archive
                className={`w-10 h-10 mx-auto ${
                  isWhite ? 'text-slate-400' : 'text-slate-600'
                }`}
              />
              <p
                className={`text-sm font-medium ${
                  isWhite ? 'text-slate-700' : 'text-slate-300'
                }`}
              >
                ยังไม่มีประวัติแชทที่ถูกจัดเก็บ
              </p>
              <p
                className={`text-xs max-w-sm mx-auto ${
                  isWhite ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                เมื่อคุณกดปุ่ม "เริ่มใหม่ / รีเซ็ต" คุณสามารถเลือกบันทึกแชทปัจจุบันเก็บเข้าคลังนี้ หรือกดปุ่ม "บันทึกแชทปัจจุบัน" ด้านบนเพื่อจัดเก็บได้ทันที
              </p>
            </div>
          ) : (
            archives.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 sm:p-4 rounded-xl border transition space-y-2.5 ${
                  isWhite
                    ? 'bg-slate-50 hover:bg-white border-slate-200 shadow-sm hover:border-indigo-300'
                    : 'bg-slate-950/70 border-slate-800 hover:border-indigo-500/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-bold font-title truncate ${
                          isWhite ? 'text-slate-900' : 'text-white'
                        }`}
                      >
                        {item.name || 'ดวงวิญญาณ'}
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono border ${
                          isWhite
                            ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                            : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                        }`}
                      >
                        Lv.{item.characterState?.level || 1}
                      </span>
                    </div>
                    <p
                      className={`text-xs font-mono truncate mt-0.5 ${
                        isWhite ? 'text-slate-600' : 'text-slate-400'
                      }`}
                    >
                      🌐 {item.world || 'โลกต่างมิติ'}
                    </p>
                  </div>

                  <div
                    className={`flex items-center gap-1.5 text-[10px] font-mono shrink-0 ${
                      isWhite ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(item.updatedAt || item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div
                  className={`flex items-center justify-between text-[11px] border-t pt-2 ${
                    isWhite
                      ? 'text-slate-600 border-slate-200'
                      : 'text-slate-400 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-indigo-500" />
                      {item.messageCount || item.messages?.length || 0} ข้อความ
                    </span>
                  </div>

                  {/* Actions for this archive */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        sound.playClick();
                        onExportArchive(item);
                      }}
                      title="ส่งออก Markdown"
                      className={`px-2 py-1 rounded border transition flex items-center gap-1 text-[11px] ${
                        isWhite
                          ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
                          : 'bg-slate-900 active:bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                      }`}
                    >
                      <Download className="w-3 h-3" />
                      <span className="hidden sm:inline">ส่งออก</span>
                    </button>

                    <button
                      onClick={() => {
                        sound.playCombat();
                        if (confirm(`คุณต้องการลบประวัติของ "${item.name}" หรือไม่?`)) {
                          onDeleteArchive(item.id);
                        }
                      }}
                      title="ลบทิ้ง"
                      className={`p-1 rounded border transition ${
                        isWhite
                          ? 'bg-white hover:bg-rose-50 border-slate-300 text-slate-500 hover:text-rose-600'
                          : 'bg-slate-900 active:bg-slate-800 border-slate-700 text-slate-400 hover:text-rose-400'
                      }`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        sound.playLevelUp();
                        if (confirm(`ต้องการโหลดเรื่องราวของ "${item.name}" กลับมาเล่นต่อหรือไม่?`)) {
                          onLoadArchive(item);
                          onClose();
                        }
                      }}
                      className="px-2.5 py-1 rounded bg-gradient-to-r from-indigo-600 to-purple-600 active:from-indigo-700 active:to-purple-700 text-white font-medium transition flex items-center gap-1 text-[11px] shadow-sm"
                    >
                      <Play className="w-3 h-3" />
                      <span>เล่นต่อ</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          className={`px-5 py-3 border-t flex items-center justify-between pb-safe sm:pb-3 ${
            isWhite ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'
          }`}
        >
          {archives.length > 0 ? (
            <button
              onClick={() => {
                sound.playCombat();
                if (confirm('คุณแน่ใจหรือไม่ว่าต้องการล้างคลังประวัติแชททั้งหมด? ข้อมูลจะไม่สามารถกู้คืนได้')) {
                  onClearAllArchives();
                }
              }}
              className="text-xs text-rose-500 hover:text-rose-600 transition flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ล้างประวัติทั้งหมด</span>
            </button>
          ) : (
            <span />
          )}

          <button
            onClick={onClose}
            className={`px-4 py-1.5 rounded-lg text-xs transition ${
              isWhite
                ? 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
