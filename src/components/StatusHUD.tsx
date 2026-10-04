import React from 'react';
import { CharacterState, ThemeMode } from '../types';
import {
  Shield,
  Heart,
  Zap,
  MapPin,
  AlertTriangle,
  Award,
  Package,
  Sparkles,
  ChevronRight,
  X,
  User,
  Activity,
  Compass,
  FileText,
} from 'lucide-react';
import { sound } from '../utils/sound';

interface StatusHUDProps {
  state: CharacterState;
  isOpen: boolean;
  onToggle: () => void;
  onUseSkill?: (skillName: string) => void;
  onUseItem?: (itemName: string) => void;
  themeMode?: ThemeMode;
}

export const StatusHUD: React.FC<StatusHUDProps> = ({
  state,
  isOpen,
  onToggle,
  onUseSkill,
  onUseItem,
  themeMode = 'dark',
}) => {
  const isWhite = themeMode === 'white';
  const hpPercent = Math.max(0, Math.min(100, (state.hp / (state.maxHp || 100)) * 100));
  const mpPercent = Math.max(0, Math.min(100, (state.mp / (state.maxMp || 50)) * 100));

  const getDangerBadge = (level: string) => {
    switch (level) {
      case 'Deadly':
        return {
          label: 'DEADLY',
          fullLabel: 'อันตรายถึงตาย (DEADLY)',
          className: isWhite
            ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse font-bold'
            : 'bg-rose-950/80 text-rose-300 border-rose-500/50 animate-pulse',
        };
      case 'High':
        return {
          label: 'HIGH',
          fullLabel: 'อันตรายสูง (HIGH)',
          className: isWhite
            ? 'bg-orange-100 text-orange-800 border-orange-300 font-bold'
            : 'bg-orange-950/80 text-orange-300 border-orange-500/50',
        };
      case 'Medium':
        return {
          label: 'MED',
          fullLabel: 'ระวังภัย (MEDIUM)',
          className: isWhite
            ? 'bg-amber-100 text-amber-800 border-amber-300'
            : 'bg-amber-950/80 text-amber-300 border-amber-500/50',
        };
      case 'Low':
        return {
          label: 'LOW',
          fullLabel: 'ระวังตัว (LOW)',
          className: isWhite
            ? 'bg-sky-100 text-sky-800 border-sky-300'
            : 'bg-sky-950/80 text-sky-300 border-sky-500/50',
        };
      case 'Safe':
      default:
        return {
          label: 'SAFE',
          fullLabel: 'ปลอดภัย (SAFE)',
          className: isWhite
            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
            : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50',
        };
    }
  };

  const danger = getDangerBadge(state.dangerLevel);

  return (
    <>
      {/* Mini Bar Header (Always visible at top, clean and compact) */}
      <div
        className={`w-full flex items-center justify-between px-3 sm:px-6 py-2 border-b backdrop-blur-md transition-colors ${
          isWhite
            ? 'bg-white/95 border-slate-200 text-slate-800'
            : 'bg-slate-900/95 border-indigo-500/20 text-slate-100'
        }`}
      >
        {/* Left: Player Identity */}
        <div
          onClick={() => {
            sound.playClick();
            onToggle();
          }}
          className="flex items-center gap-2 cursor-pointer select-none overflow-hidden max-w-[50%] sm:max-w-[40%] group"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0 group-hover:scale-125 transition" />
          <div className="flex flex-col truncate">
            <div className="flex items-center gap-1.5 truncate">
              <span
                className={`text-xs sm:text-sm font-bold truncate group-hover:text-indigo-400 transition ${
                  isWhite ? 'text-slate-900' : 'text-white'
                }`}
              >
                {state.name || 'ดวงวิญญาณ'}
              </span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded border flex-shrink-0 ${
                  isWhite
                    ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                    : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                }`}
              >
                Lv.{state.level || 1}
              </span>
            </div>
            <span
              className={`text-[10px] font-mono truncate ${
                isWhite ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              {state.title || 'ผู้จุติใหม่'}
            </span>
          </div>
        </div>

        {/* Center / Right: Quick Gauges & Open Status Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick HP & MP gauges */}
          <div
            onClick={() => {
              sound.playClick();
              onToggle();
            }}
            className={`flex items-center gap-2.5 cursor-pointer px-2.5 py-1 rounded-xl border transition hover:scale-[1.02] active:scale-[0.98] ${
              isWhite
                ? 'bg-slate-100 border-slate-300 hover:bg-slate-200'
                : 'bg-slate-950/70 border-slate-800 hover:border-indigo-500/40'
            }`}
          >
            {/* HP */}
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500/20" />
              <div
                className={`w-12 sm:w-16 h-2 rounded-full overflow-hidden ${
                  isWhite ? 'bg-slate-200' : 'bg-slate-800'
                }`}
              >
                <div
                  className="h-full bg-gradient-to-r from-rose-600 to-rose-400 transition-all duration-300"
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
              <span
                className={`text-[10px] font-mono hidden sm:inline ${
                  isWhite ? 'text-rose-700' : 'text-rose-300'
                }`}
              >
                {state.hp}
              </span>
            </div>

            {/* MP */}
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-sky-500 fill-sky-500/20" />
              <div
                className={`w-12 sm:w-16 h-2 rounded-full overflow-hidden ${
                  isWhite ? 'bg-slate-200' : 'bg-slate-800'
                }`}
              >
                <div
                  className="h-full bg-gradient-to-r from-sky-600 to-cyan-400 transition-all duration-300"
                  style={{ width: `${mpPercent}%` }}
                />
              </div>
              <span
                className={`text-[10px] font-mono hidden sm:inline ${
                  isWhite ? 'text-sky-700' : 'text-sky-300'
                }`}
              >
                {state.mp}
              </span>
            </div>
          </div>

          {/* Danger Threat Badge */}
          <span
            className={`text-[9px] sm:text-[11px] font-mono px-1.5 sm:px-2 py-0.5 rounded border ${danger.className}`}
          >
            <span className="sm:hidden">{danger.label}</span>
            <span className="hidden sm:inline">{danger.fullLabel}</span>
          </span>

          {/* Open Full Status Window Button */}
          <button
            onClick={() => {
              sound.playClick();
              onToggle();
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono font-medium rounded-xl border transition shadow-sm min-h-[32px] touch-manipulation ${
              isWhite
                ? 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700'
                : 'bg-indigo-950/80 hover:bg-indigo-900 border-indigo-500/40 text-indigo-200 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-indigo-500" />
            <span>ดูสถานะ</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>
        </div>
      </div>

      {/* FULL-SCREEN BLURRED MODAL FOR STATUS (Prevents chat overlap, blurs entire background) */}
      {isOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              sound.playClick();
              onToggle();
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
        >
          <div
            className={`w-full max-w-3xl rounded-2xl border shadow-2xl flex flex-col max-h-[88vh] overflow-hidden transition-all animate-scaleIn ${
              isWhite
                ? 'bg-white border-slate-300 text-slate-800'
                : 'bg-slate-950 border-indigo-500/50 text-slate-100 shadow-indigo-950/50'
            }`}
          >
            {/* Holographic Header */}
            <div
              className={`flex items-center justify-between px-5 py-3.5 border-b ${
                isWhite
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-slate-900/90 border-indigo-500/30'
              }`}
            >
              <div className="flex items-center gap-2.5 text-indigo-500">
                <div
                  className={`p-1.5 rounded-lg border ${
                    isWhite
                      ? 'bg-indigo-100 border-indigo-200 text-indigo-700'
                      : 'bg-indigo-950 border-indigo-500/40 text-indigo-400'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3
                    className={`font-bold font-title tracking-wider text-sm sm:text-base flex items-center gap-2 ${
                      isWhite ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    <span>[ หน้าต่างสถานะระบบ - System Status ]</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        isWhite
                          ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                          : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                      }`}
                    >
                      Lv.{state.level || 1}
                    </span>
                  </h3>
                  <p
                    className={`text-[11px] font-mono ${
                      isWhite ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    ข้อมูลบันทึกสถิติและพลังแห่งชะตากรรม
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  onToggle();
                }}
                className={`p-1.5 rounded-lg transition min-w-[32px] min-h-[32px] flex items-center justify-center touch-manipulation ${
                  isWhite
                    ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                    : 'text-slate-400 hover:text-white active:bg-slate-800'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              {/* Row 1: Identity Profile Card */}
              <div
                className={`p-4 rounded-xl border space-y-3 ${
                  isWhite
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4
                      className={`text-base font-bold font-title ${
                        isWhite ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      {state.name || 'ดวงวิญญาณแห่งความว่างเปล่า'}
                    </h4>
                    <p
                      className={`text-xs font-mono mt-0.5 ${
                        isWhite ? 'text-indigo-700' : 'text-indigo-300'
                      }`}
                    >
                      ฉายา: {state.title || 'ผู้จุติใหม่'} • เผ่าพันธุ์: {state.race || 'มนุษย์'}
                    </p>
                  </div>
                  <span className={`text-[10px] font-mono px-2.5 py-1 rounded border ${danger.className}`}>
                    {danger.fullLabel}
                  </span>
                </div>

                <div
                  className={`grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t ${
                    isWhite ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-400'
                  }`}
                >
                  <div>
                    <span className="text-[10px] block opacity-70">เพศ</span>
                    <span className={`font-medium ${isWhite ? 'text-slate-800' : 'text-slate-200'}`}>
                      {state.gender || 'ไม่ระบุ'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] block opacity-70">อายุ</span>
                    <span className={`font-medium ${isWhite ? 'text-slate-800' : 'text-slate-200'}`}>
                      {state.age || 'ไม่ระบุ'}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] block opacity-70">มิติโลกปัจจุบัน</span>
                    <span
                      className={`font-medium truncate block ${
                        isWhite ? 'text-slate-800' : 'text-slate-200'
                      }`}
                    >
                      🌐 {state.world || 'พื้นที่สีขาวว่างเปล่า'}
                    </span>
                  </div>
                </div>

                {state.appearance && state.appearance !== 'ยังไม่ได้กำหนด' && (
                  <div
                    className={`pt-2 border-t text-[11px] ${
                      isWhite ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="font-semibold">รูปลักษณ์:</span> {state.appearance}
                  </div>
                )}
              </div>

              {/* Row 2: Vitals Gauges (HP & MP) */}
              <div
                className={`p-4 rounded-xl border space-y-3 font-mono ${
                  isWhite
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span
                    className={`flex items-center gap-1.5 ${
                      isWhite ? 'text-slate-800' : 'text-slate-200'
                    }`}
                  >
                    <Activity className="w-4 h-4 text-indigo-500" /> ค่าพลังกายและจิตวิญญาณ (Core Vitals)
                  </span>
                </div>

                {/* HP Gauge */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-rose-500 flex items-center gap-1 font-bold">
                      <Heart className="w-3.5 h-3.5 fill-rose-500/20" /> HP พลังชีวิต
                    </span>
                    <span className={`font-bold ${isWhite ? 'text-slate-800' : 'text-white'}`}>
                      {state.hp} / {state.maxHp} ({Math.round(hpPercent)}%)
                    </span>
                  </div>
                  <div
                    className={`w-full h-3 rounded-full overflow-hidden border ${
                      isWhite ? 'bg-slate-200 border-slate-300' : 'bg-slate-800 border-rose-950'
                    }`}
                  >
                    <div
                      className="h-full bg-gradient-to-r from-rose-600 via-rose-500 to-rose-400 transition-all duration-500"
                      style={{ width: `${hpPercent}%` }}
                    />
                  </div>
                </div>

                {/* MP Gauge */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-sky-500 flex items-center gap-1 font-bold">
                      <Zap className="w-3.5 h-3.5 fill-sky-500/20" /> MP มานา / พลังพิเศษ
                    </span>
                    <span className={`font-bold ${isWhite ? 'text-slate-800' : 'text-white'}`}>
                      {state.mp} / {state.maxMp} ({Math.round(mpPercent)}%)
                    </span>
                  </div>
                  <div
                    className={`w-full h-3 rounded-full overflow-hidden border ${
                      isWhite ? 'bg-slate-200 border-slate-300' : 'bg-slate-800 border-sky-950'
                    }`}
                  >
                    <div
                      className="h-full bg-gradient-to-r from-sky-600 via-cyan-500 to-cyan-400 transition-all duration-500"
                      style={{ width: `${mpPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Location & Objective */}
              <div
                className={`p-4 rounded-xl border space-y-2.5 ${
                  isWhite
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-1.5 text-amber-600 font-semibold text-xs">
                  <MapPin className="w-4 h-4" /> ตำแหน่งปัจจุบัน & สภาพแวดล้อม:
                </div>
                <div
                  className={`text-xs font-mono p-2.5 rounded-lg border ${
                    isWhite
                      ? 'bg-white text-slate-800 border-slate-300'
                      : 'bg-slate-950/70 text-slate-200 border-slate-800'
                  }`}
                >
                  {state.location || 'พื้นที่สีขาวว่างเปล่าหลังความตาย (The White Void)'}
                </div>

                <div
                  className={`text-xs font-semibold flex items-center gap-1.5 pt-1 ${
                    isWhite ? 'text-indigo-700' : 'text-indigo-400'
                  }`}
                >
                  <Award className="w-4 h-4" /> เป้าหมายหลักแห่งระบบ (System Quest):
                </div>
                <div
                  className={`text-xs p-2.5 rounded-lg border leading-relaxed ${
                    isWhite
                      ? 'bg-indigo-50/80 text-indigo-950 border-indigo-200'
                      : 'bg-indigo-950/40 text-indigo-200 border-indigo-500/20'
                  }`}
                >
                  {state.objective || 'ส่งมอบข้อมูลเพื่อจุติสู่โลกใบใหม่'}
                </div>
              </div>

              {/* Row 4: Skills & Abilities Grid */}
              <div
                className={`p-4 rounded-xl border space-y-2.5 ${
                  isWhite
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold text-purple-600">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> สกิล & พลังพิเศษ ({state.skills?.length || 0})
                  </span>
                  <span className={isWhite ? 'text-slate-500 text-[10px]' : 'text-slate-400 text-[10px]'}>
                    (คลิกที่สกิลเพื่อส่งคำสั่งใช้สกิลลงในแชททันที)
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {state.skills && state.skills.length > 0 ? (
                    state.skills.map((skill, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          sound.playClick();
                          onUseSkill?.(skill);
                          onToggle();
                        }}
                        className={`text-xs px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 active:scale-95 touch-manipulation shadow-sm ${
                          isWhite
                            ? 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-800'
                            : 'bg-purple-950/60 hover:bg-purple-900/80 border-purple-500/40 text-purple-200 hover:text-white'
                        }`}
                      >
                        <span>⚡</span>
                        <span className="font-medium">{skill}</span>
                        <span className="text-[10px] opacity-75 font-mono">› ใช้</span>
                      </button>
                    ))
                  ) : (
                    <p
                      className={`text-xs italic p-2 ${
                        isWhite ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      ยังไม่ได้รับการปลุกสกิลหรือทักษะพิเศษ
                    </p>
                  )}
                </div>
              </div>

              {/* Row 5: Inventory & Items Grid */}
              <div
                className={`p-4 rounded-xl border space-y-2.5 ${
                  isWhite
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-600">
                  <span className="flex items-center gap-1.5">
                    <Package className="w-4 h-4" /> คลังสัมภาระ ({state.inventory?.length || 0})
                  </span>
                  <span className={isWhite ? 'text-slate-500 text-[10px]' : 'text-slate-400 text-[10px]'}>
                    (คลิกที่ไอเทมเพื่อส่งคำสั่งหยิบใช้ลงในแชททันที)
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {state.inventory && state.inventory.length > 0 ? (
                    state.inventory.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          sound.playClick();
                          onUseItem?.(item);
                          onToggle();
                        }}
                        className={`text-xs px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 active:scale-95 touch-manipulation shadow-sm ${
                          isWhite
                            ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-800'
                            : 'bg-emerald-950/60 hover:bg-emerald-900/80 border-emerald-500/40 text-emerald-200 hover:text-white'
                        }`}
                      >
                        <span>📦</span>
                        <span className="font-medium">{item}</span>
                        <span className="text-[10px] opacity-75 font-mono">› ใช้</span>
                      </button>
                    ))
                  ) : (
                    <p
                      className={`text-xs italic p-2 ${
                        isWhite ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      คลังสัมภาระว่างเปล่า
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className={`px-5 py-3 border-t flex items-center justify-between ${
                isWhite ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/90 border-slate-800'
              }`}
            >
              <span
                className={`text-[11px] font-mono ${
                  isWhite ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                แตะภายนอกหรือปุ่มปิดเพื่อกลับสู่บทสนทนา
              </span>

              <button
                onClick={() => {
                  sound.playClick();
                  onToggle();
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                  isWhite
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                ปิดหน้าต่างสถานะ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
