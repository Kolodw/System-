import React from 'react';
import { CharacterState } from '../types';
import {
  Shield,
  Heart,
  Zap,
  MapPin,
  AlertTriangle,
  Award,
  Package,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  User,
} from 'lucide-react';
import { sound } from '../utils/sound';

interface StatusHUDProps {
  state: CharacterState;
  isOpen: boolean;
  onToggle: () => void;
  onUseSkill?: (skillName: string) => void;
  onUseItem?: (itemName: string) => void;
}

export const StatusHUD: React.FC<StatusHUDProps> = ({
  state,
  isOpen,
  onToggle,
  onUseSkill,
  onUseItem,
}) => {
  const hpPercent = Math.max(0, Math.min(100, (state.hp / (state.maxHp || 100)) * 100));
  const mpPercent = Math.max(0, Math.min(100, (state.mp / (state.maxMp || 50)) * 100));

  const getDangerBadge = (level: string) => {
    switch (level) {
      case 'Deadly':
        return {
          label: 'DEADLY',
          fullLabel: 'อันตรายถึงตาย (DEADLY)',
          className: 'bg-rose-950/80 text-rose-300 border-rose-500/50 animate-pulse',
        };
      case 'High':
        return {
          label: 'HIGH',
          fullLabel: 'อันตรายสูง (HIGH)',
          className: 'bg-orange-950/80 text-orange-300 border-orange-500/50',
        };
      case 'Medium':
        return {
          label: 'MED',
          fullLabel: 'ระวังภัย (MEDIUM)',
          className: 'bg-amber-950/80 text-amber-300 border-amber-500/50',
        };
      case 'Low':
        return {
          label: 'LOW',
          fullLabel: 'ระวังตัว (LOW)',
          className: 'bg-sky-950/80 text-sky-300 border-sky-500/50',
        };
      case 'Safe':
      default:
        return {
          label: 'SAFE',
          fullLabel: 'ปลอดภัย (SAFE)',
          className: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50',
        };
    }
  };

  const danger = getDangerBadge(state.dangerLevel);

  return (
    <div className="w-full">
      {/* Mini Bar Header (Optimized for Mobile & Desktop) */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-slate-900/95 border-b border-indigo-500/20 backdrop-blur-md">
        {/* Left: Player Identity */}
        <div
          onClick={() => {
            sound.playClick();
            onToggle();
          }}
          className="flex items-center gap-2 cursor-pointer select-none overflow-hidden max-w-[55%] sm:max-w-[40%]"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping flex-shrink-0" />
          <div className="flex flex-col truncate">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-xs font-bold text-white truncate">
                {state.name || 'ดวงวิญญาณ'}
              </span>
              <span className="text-[10px] text-indigo-300 font-mono px-1 py-0.2 rounded bg-indigo-500/20 border border-indigo-500/30 flex-shrink-0">
                Lv.{state.level || 1}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono truncate">
              {state.title || 'ผู้จุติใหม่'}
            </span>
          </div>
        </div>

        {/* Center / Right: Gauges & Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile compact bars */}
          <div
            onClick={() => {
              sound.playClick();
              onToggle();
            }}
            className="flex items-center gap-2 cursor-pointer bg-slate-950/60 px-2 py-1 rounded-lg border border-slate-800"
          >
            {/* HP */}
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3 text-rose-400 fill-rose-500/20" />
              <div className="w-12 sm:w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-600 to-rose-400 transition-all duration-300"
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-rose-300 hidden sm:inline">
                {state.hp}
              </span>
            </div>

            {/* MP */}
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-sky-400 fill-sky-500/20" />
              <div className="w-12 sm:w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-600 to-cyan-400 transition-all duration-300"
                  style={{ width: `${mpPercent}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-sky-300 hidden sm:inline">
                {state.mp}
              </span>
            </div>
          </div>

          {/* Danger Badge */}
          <span
            className={`text-[9px] sm:text-[11px] font-mono px-1.5 sm:px-2 py-0.5 rounded border ${danger.className}`}
          >
            <span className="sm:hidden">{danger.label}</span>
            <span className="hidden sm:inline">{danger.fullLabel}</span>
          </span>

          {/* Open/Close Button */}
          <button
            onClick={() => {
              sound.playClick();
              onToggle();
            }}
            className="flex items-center gap-1 px-2 py-1 text-xs font-mono font-medium rounded-lg bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-500/30 text-indigo-200 transition min-h-[32px] touch-manipulation"
          >
            <span className="hidden sm:inline">{isOpen ? 'ซ่อน' : 'สถานะ'}</span>
            <span className="sm:hidden text-[11px]">{isOpen ? 'ปิด' : 'สถานะ'}</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded System Window for Desktop */}
      {isOpen && (
        <>
          {/* Mobile Bottom Sheet Drawer (md:hidden) */}
          <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end bg-black/70 backdrop-blur-sm animate-fadeIn">
            <div className="bg-slate-950 border-t border-indigo-500/40 rounded-t-3xl max-h-[82vh] flex flex-col shadow-2xl overflow-hidden animate-slideUp">
              {/* Drawer Handle & Header */}
              <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-1 bg-slate-600 rounded-full mx-auto" />
                  <span className="text-xs font-bold text-indigo-300 font-mono">
                    [หน้าต่างสถานะตัวละคร]
                  </span>
                </div>
                <button
                  onClick={onToggle}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-4 overflow-y-auto space-y-3.5 text-xs text-slate-200 pb-safe">
                {/* Stats & Identity */}
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        <span>{state.name || 'ไร้นาม'}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono border border-indigo-500/30">
                          Lv.{state.level || 1}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {state.race || 'มนุษย์'} • {state.title || 'ผู้จุติใหม่'}
                      </p>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${danger.className}`}>
                      {danger.fullLabel}
                    </span>
                  </div>

                  {/* Gauges */}
                  <div className="space-y-2 pt-1 font-mono">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-rose-400 flex items-center gap-1">
                          <Heart className="w-3 h-3" /> HP พลังชีวิต
                        </span>
                        <span className="text-slate-300 font-bold">
                          {state.hp}/{state.maxHp}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-rose-600 to-rose-400 transition-all duration-300"
                          style={{ width: `${hpPercent}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-sky-400 flex items-center gap-1">
                          <Zap className="w-3 h-3" /> MP มานา/พลังพิเศษ
                        </span>
                        <span className="text-slate-300 font-bold">
                          {state.mp}/{state.maxMp}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-sky-600 to-cyan-400 transition-all duration-300"
                          style={{ width: `${mpPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location & Objective */}
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-1 text-amber-400 font-semibold text-[11px]">
                    <MapPin className="w-3.5 h-3.5" /> ตำแหน่งปัจจุบัน:
                  </div>
                  <div className="text-xs text-white font-mono bg-slate-950 p-2 rounded-lg border border-slate-800">
                    {state.location || 'พื้นที่สีขาวว่างเปล่าหลังความตาย'}
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
                    <Award className="w-3.5 h-3.5 text-indigo-400" /> เป้าหมาย:
                  </div>
                  <div className="text-xs text-slate-200 bg-indigo-950/40 p-2 rounded-lg border border-indigo-500/20">
                    {state.objective || 'ส่งมอบข้อมูลเพื่อจุติสู่โลกใบใหม่'}
                  </div>
                </div>

                {/* Skills */}
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-purple-300">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> สกิล & พลังพิเศษ ({state.skills?.length || 0})
                    </span>
                    <span className="text-[10px] text-slate-400">แตะเพื่อสั่งใช้</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {state.skills && state.skills.length > 0 ? (
                      state.skills.map((skill, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            sound.playClick();
                            onUseSkill?.(skill);
                            onToggle();
                          }}
                          className="text-xs px-2.5 py-1.5 rounded-lg bg-purple-950/50 border border-purple-500/30 text-purple-200 active:scale-95 transition"
                        >
                          ⚡ {skill}
                        </button>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 italic">ยังไม่มีสกิล</p>
                    )}
                  </div>
                </div>

                {/* Inventory */}
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-300">
                    <span className="flex items-center gap-1">
                      <Package className="w-3.5 h-3.5" /> คลังสัมภาระ ({state.inventory?.length || 0})
                    </span>
                    <span className="text-[10px] text-slate-400">แตะเพื่อหยิบใช้</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {state.inventory && state.inventory.length > 0 ? (
                      state.inventory.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            sound.playClick();
                            onUseItem?.(item);
                            onToggle();
                          }}
                          className="text-xs px-2.5 py-1.5 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-emerald-200 active:scale-95 transition"
                        >
                          📦 {item}
                        </button>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 italic">คลังสัมภาระว่างเปล่า</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Grid Layout (hidden md:block) */}
          <div className="hidden md:block p-4 sm:p-5 bg-slate-950/95 border-b border-indigo-500/30 backdrop-blur-xl shadow-2xl animate-fadeIn text-slate-200">
            <div className="max-w-7xl mx-auto grid grid-cols-4 gap-4">
              {/* Col 1: Identity & Stats */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-bold text-white font-title flex items-center gap-2">
                      <span>{state.name || 'ไร้นาม'}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono border border-indigo-500/30">
                        Lv.{state.level || 1}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono">
                      {state.race || 'มนุษย์'} • {state.title || 'ผู้จุติใหม่'}
                    </p>
                  </div>
                  <div className="p-1.5 bg-indigo-950 rounded-lg border border-indigo-500/40 text-indigo-400">
                    <Shield className="w-4 h-4" />
                  </div>
                </div>

                {/* Gauges */}
                <div className="space-y-2 pt-1 font-mono text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-rose-400 flex items-center gap-1">
                        <Heart className="w-3 h-3" /> HP พลังชีวิต
                      </span>
                      <span className="text-slate-300">
                        {state.hp}/{state.maxHp}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden border border-rose-950">
                      <div
                        className="h-full bg-gradient-to-r from-rose-600 to-rose-400 transition-all duration-500"
                        style={{ width: `${hpPercent}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-sky-400 flex items-center gap-1">
                        <Zap className="w-3 h-3" /> MP มานา/พลังพิเศษ
                      </span>
                      <span className="text-slate-300">
                        {state.mp}/{state.maxMp}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden border border-sky-950">
                      <div
                        className="h-full bg-gradient-to-r from-sky-600 to-cyan-400 transition-all duration-500"
                        style={{ width: `${mpPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-1 text-[11px] text-slate-400 border-t border-slate-800/80">
                  <span className="text-slate-500">มิติโลก:</span> {state.world || 'มิติไร้ขอบเขต'}
                </div>
              </div>

              {/* Col 2: Location & Objective */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 border-b border-slate-800 pb-1.5">
                  <span className="flex items-center gap-1 text-amber-400">
                    <MapPin className="w-3.5 h-3.5" /> สภาพแวดล้อม & สถานที่
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${danger.className}`}>
                    {danger.fullLabel}
                  </span>
                </div>

                <div className="text-xs text-white font-mono bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                  {state.location || 'พื้นที่สีขาวว่างเปล่าหลังความตาย (The White Void)'}
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
                    <Award className="w-3.5 h-3.5 text-indigo-400" /> เป้าหมายหลัก:
                  </span>
                  <p className="text-xs text-slate-200 bg-indigo-950/30 p-2 rounded-lg border border-indigo-500/20">
                    {state.objective || 'ส่งมอบข้อมูลเพื่อจุติสู่โลกใบใหม่'}
                  </p>
                </div>
              </div>

              {/* Col 3: Skills & Powers */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 border-b border-slate-800 pb-1.5">
                  <span className="flex items-center gap-1 text-purple-400">
                    <Sparkles className="w-3.5 h-3.5" /> สกิล & พลังพิเศษ
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {state.skills?.length || 0} ทักษะ
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {state.skills && state.skills.length > 0 ? (
                    state.skills.map((skill, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          sound.playClick();
                          onUseSkill?.(skill);
                        }}
                        title="คลิกเพื่อสั่งใช้สกิลนี้"
                        className="text-left text-xs px-2.5 py-1 rounded-lg bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-200 hover:text-white transition flex items-center gap-1 group"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 group-hover:scale-125 transition" />
                        <span>{skill}</span>
                      </button>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 italic">ยังไม่มีสกิลที่ปลดล็อก</p>
                  )}
                </div>
              </div>

              {/* Col 4: Inventory */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 border-b border-slate-800 pb-1.5">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Package className="w-3.5 h-3.5" /> คลังสัมภาระ (Inventory)
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {state.inventory?.length || 0} ช่อง
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {state.inventory && state.inventory.length > 0 ? (
                    state.inventory.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          sound.playClick();
                          onUseItem?.(item);
                        }}
                        title="คลิกเพื่อใช้ไอเทม"
                        className="text-left text-xs px-2.5 py-1 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-200 hover:text-white transition flex items-center gap-1 group"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:scale-125 transition" />
                        <span>{item}</span>
                      </button>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 italic">คลังสัมภาระยังว่างเปล่า</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

