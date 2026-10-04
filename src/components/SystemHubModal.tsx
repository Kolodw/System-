import React from 'react';
import {
  Sparkles,
  User,
  Shield,
  Archive,
  Dices,
  RotateCcw,
  HelpCircle,
  Sun,
  Moon,
  X,
  Volume2,
  VolumeX,
  Heart,
  Zap,
  Activity,
  Compass,
  ArrowRight,
  Sliders,
} from 'lucide-react';
import { CharacterState, ThemeMode } from '../types';
import { sound } from '../utils/sound';

interface SystemHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  characterState: CharacterState;
  archivesCount: number;
  themeMode: ThemeMode;
  onToggleTheme: () => void;
  onOpenStatus: () => void;
  onOpenReincarnate: () => void;
  onOpenArchives: () => void;
  onOpenDice: () => void;
  onOpenHelp: () => void;
  onOpenReset: () => void;
}

export const SystemHubModal: React.FC<SystemHubModalProps> = ({
  isOpen,
  onClose,
  characterState,
  archivesCount,
  themeMode,
  onToggleTheme,
  onOpenStatus,
  onOpenReincarnate,
  onOpenArchives,
  onOpenDice,
  onOpenHelp,
  onOpenReset,
}) => {
  if (!isOpen) return null;

  const isWhite = themeMode === 'white';
  const isSoundOn = sound.enabled;

  const triggerHaptic = () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(20);
      }
    } catch {
      // Ignore
    }
  };

  const handleAction = (callback: () => void, soundFn?: () => void) => {
    triggerHaptic();
    if (soundFn) {
      soundFn();
    } else {
      sound.playSelect();
    }
    onClose();
    // Allow animation to complete smoothly
    setTimeout(() => {
      callback();
    }, 80);
  };

  const hpPercent = Math.max(
    0,
    Math.min(100, (characterState.hp / (characterState.maxHp || 100)) * 100)
  );
  const mpPercent = Math.max(
    0,
    Math.min(100, (characterState.mp / (characterState.maxMp || 50)) * 100)
  );

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          sound.playClose();
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-fadeIn"
      style={{
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <div
        className={`relative w-full max-w-2xl rounded-2xl border shadow-2xl flex flex-col max-h-[92vh] overflow-hidden transition-all animate-scaleIn ${
          isWhite
            ? 'bg-white/95 border-slate-300 text-slate-800 shadow-slate-400/40'
            : 'bg-slate-950/95 border-indigo-500/40 text-slate-100 shadow-indigo-950/60 ring-1 ring-indigo-500/20'
        }`}
      >
        {/* Holographic Header */}
        <div
          className={`flex items-center justify-between px-5 py-4 border-b ${
            isWhite
              ? 'bg-slate-50/90 border-slate-200'
              : 'bg-slate-900/90 border-indigo-500/30'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/30 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-indigo-400">
                <Sliders className="w-5 h-5 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  className={`text-sm sm:text-base font-bold font-title tracking-wider ${
                    isWhite ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  SYSTEM COMMAND HUB
                </h2>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    isWhite
                      ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                      : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                  }`}
                >
                  หน้าต่างคำสั่ง
                </span>
              </div>
              <p
                className={`text-[11px] font-mono ${
                  isWhite ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                เลือกเมนูคำสั่งและจัดการฟังก์ชันของ The System
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClose();
              onClose();
            }}
            className={`p-2 rounded-xl transition min-w-[36px] min-h-[36px] flex items-center justify-center ${
              isWhite
                ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80 active:scale-95'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Active Character Mini Card */}
          <div
            onClick={() => handleAction(onOpenStatus, () => sound.playLevelUp())}
            className={`p-3.5 rounded-xl border select-card-glow cursor-pointer transition ${
              isWhite
                ? 'bg-slate-50 hover:bg-indigo-50/50 border-slate-200'
                : 'bg-slate-900/80 hover:bg-slate-900 border-indigo-500/30 hover:border-indigo-400/50'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-bold font-title ${
                        isWhite ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      {characterState.name || 'ดวงวิญญาณแห่งความว่างเปล่า'}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                        isWhite
                          ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                          : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                      }`}
                    >
                      Lv.{characterState.level || 1}
                    </span>
                  </div>
                  <p
                    className={`text-[11px] font-mono ${
                      isWhite ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    {characterState.title || 'ผู้จุติใหม่'} • 🌐 {characterState.world || 'ห้องสีขาวว่างเปล่า'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-indigo-500 font-medium">
                <span>เปิดดูสถานะ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Quick HP & MP preview */}
            <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-slate-700/20 text-[11px] font-mono">
              <div className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <div className="w-full bg-slate-800/40 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-rose-500 h-full transition-all"
                    style={{ width: `${hpPercent}%` }}
                  />
                </div>
                <span className="text-[10px] shrink-0 font-bold">{characterState.hp}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                <div className="w-full bg-slate-800/40 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-sky-500 h-full transition-all"
                    style={{ width: `${mpPercent}%` }}
                  />
                </div>
                <span className="text-[10px] shrink-0 font-bold">{characterState.mp}</span>
              </div>
            </div>
          </div>

          {/* Grid of Main System Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1. Status Sheet */}
            <button
              onClick={() => handleAction(onOpenStatus, () => sound.playLevelUp())}
              className={`p-4 rounded-xl border text-left flex items-start gap-3.5 select-card-glow transition touch-manipulation ${
                isWhite
                  ? 'bg-slate-50 hover:bg-indigo-50/60 border-slate-200'
                  : 'bg-slate-900/70 hover:bg-slate-900 border-indigo-500/20 hover:border-indigo-500/50'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 shrink-0 mt-0.5">
                <Activity className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm">หน้าต่างสถานะตัวละคร</h3>
                  <span className="text-[10px] font-mono text-indigo-400">STATUS</span>
                </div>
                <p className="text-xs opacity-75 mt-1 leading-relaxed">
                  ดูค่าพลังกาย HP/MP, สกิล, ข้อมูลสถิติ และช่องสัมภาระ
                </p>
              </div>
            </button>

            {/* 2. Reincarnate Protocol */}
            <button
              onClick={() => handleAction(onOpenReincarnate, () => sound.playLevelUp())}
              className={`p-4 rounded-xl border text-left flex items-start gap-3.5 select-card-glow transition touch-manipulation ${
                isWhite
                  ? 'bg-purple-50/50 hover:bg-purple-50 border-purple-200'
                  : 'bg-slate-900/70 hover:bg-purple-950/30 border-purple-500/20 hover:border-purple-500/50'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm">จุติใหม่สู่ภพภูมิอื่น</h3>
                  <span className="text-[10px] font-mono text-purple-400">ISENGARD</span>
                </div>
                <p className="text-xs opacity-75 mt-1 leading-relaxed">
                  เลือก 4 คอนเซปต์ต้นแบบแฟนตาซี / ไซเบอร์พังก์ หรือสร้างเอง
                </p>
              </div>
            </button>

            {/* 3. Archives Hub */}
            <button
              onClick={() => handleAction(onOpenArchives, () => sound.playSelect())}
              className={`p-4 rounded-xl border text-left flex items-start gap-3.5 select-card-glow transition touch-manipulation ${
                isWhite
                  ? 'bg-slate-50 hover:bg-sky-50/60 border-slate-200'
                  : 'bg-slate-900/70 hover:bg-slate-900 border-sky-500/20 hover:border-sky-500/50'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/30 shrink-0 mt-0.5 relative">
                <Archive className="w-5 h-5 text-sky-400" />
                {archivesCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-sky-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {archivesCount}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm">คลังบันทึกการเดินทาง</h3>
                  <span className="text-[10px] font-mono text-sky-400">ARCHIVE</span>
                </div>
                <p className="text-xs opacity-75 mt-1 leading-relaxed">
                  สลับเล่นแชทเก่า ({archivesCount} ตอน) หรือดาวน์โหลดบันทึก .md
                </p>
              </div>
            </button>

            {/* 4. Destiny Dice Roller */}
            <button
              onClick={() => handleAction(onOpenDice, () => sound.playDice())}
              className={`p-4 rounded-xl border text-left flex items-start gap-3.5 select-card-glow transition touch-manipulation ${
                isWhite
                  ? 'bg-slate-50 hover:bg-amber-50/60 border-slate-200'
                  : 'bg-slate-900/70 hover:bg-slate-900 border-amber-500/20 hover:border-amber-500/50'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 shrink-0 mt-0.5">
                <Dices className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm">ทอยลูกเต๋าชะตากรรม</h3>
                  <span className="text-[10px] font-mono text-amber-400">D20 / D100</span>
                </div>
                <p className="text-xs opacity-75 mt-1 leading-relaxed">
                  ทอยวัดดวง D20, D100, D6 และส่งผลวิเคราะห์เข้าสู่เรื่องราว
                </p>
              </div>
            </button>

            {/* 5. Theme Switcher */}
            <button
              onClick={() => {
                triggerHaptic();
                sound.playChime();
                onToggleTheme();
              }}
              className={`p-4 rounded-xl border text-left flex items-start gap-3.5 select-card-glow transition touch-manipulation ${
                isWhite
                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  : 'bg-slate-900/70 hover:bg-slate-900 border-slate-700/50 hover:border-slate-500'
              }`}
            >
              <div
                className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${
                  isWhite
                    ? 'bg-slate-800 text-amber-300 border-slate-700'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}
              >
                {isWhite ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm">
                    {isWhite ? 'เปลี่ยนเป็นธีมมืด (Dark)' : 'เปลี่ยนเป็นธีมสว่าง (White)'}
                  </h3>
                  <span className="text-[10px] font-mono opacity-70">DIMENSION</span>
                </div>
                <p className="text-xs opacity-75 mt-1 leading-relaxed">
                  สลับฉากหลังระหว่าง Dark Void (สีดำ) หรือ White Void (สีขาว)
                </p>
              </div>
            </button>

            {/* 6. Guide / Codex */}
            <button
              onClick={() => handleAction(onOpenHelp, () => sound.playSelect())}
              className={`p-4 rounded-xl border text-left flex items-start gap-3.5 select-card-glow transition touch-manipulation ${
                isWhite
                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  : 'bg-slate-900/70 hover:bg-slate-900 border-slate-700/50 hover:border-slate-500'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-slate-800/40 text-slate-300 border border-slate-700 shrink-0 mt-0.5">
                <HelpCircle className="w-5 h-5 text-slate-300" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm">กฎแห่งระบบ & วิธีเล่น</h3>
                  <span className="text-[10px] font-mono opacity-70">CODEX</span>
                </div>
                <p className="text-xs opacity-75 mt-1 leading-relaxed">
                  คำแนะนำในการสร้างตัวละคร กฎเกณฑ์ GM และระบบต่อสู้
                </p>
              </div>
            </button>
          </div>

          {/* Dangerous / Reset Section */}
          <div
            className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
              isWhite
                ? 'bg-rose-50/60 border-rose-200'
                : 'bg-rose-950/20 border-rose-500/20'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 shrink-0">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-rose-400">
                  รีเซ็ตเรื่องราว / เริ่มต้นใหม่
                </h4>
                <p className="text-[11px] opacity-75">
                  เลือกว่าจะจัดเก็บเข้าคลัง หรือลบแล้วกลับสู่ห้องสีขาวว่างเปล่า
                </p>
              </div>
            </div>

            <button
              onClick={() => handleAction(onOpenReset, () => sound.playCombat())}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-sm active:scale-95 shrink-0"
            >
              รีเซ็ต
            </button>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`px-5 py-3 border-t flex items-center justify-between text-xs font-mono ${
            isWhite
              ? 'bg-slate-50/90 border-slate-200 text-slate-500'
              : 'bg-slate-900/90 border-indigo-500/20 text-slate-400'
          }`}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                triggerHaptic();
                sound.toggle();
              }}
              className="flex items-center gap-1.5 hover:text-indigo-400 transition"
            >
              {isSoundOn ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>เสียง: เปิด</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                  <span>เสียง: ปิด</span>
                </>
              )}
            </button>
          </div>

          <button
            onClick={() => {
              sound.playClose();
              onClose();
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              isWhite
                ? 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            ปิดหน้าจอคำสั่ง
          </button>
        </div>
      </div>
    </div>
  );
};
