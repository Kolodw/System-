import React, { useState } from 'react';
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
  X,
  User,
  Activity,
  Compass,
  FileText,
  ArrowRight,
  Layers,
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
  const [activeTab, setActiveTab] = useState<'profile' | 'skills' | 'inventory'>('profile');

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

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          sound.playClose();
          onToggle();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl animate-fadeIn"
      style={{
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div
        className={`w-full max-w-2xl rounded-2xl border shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transition-all animate-scaleIn select-card-glow ${
          isWhite
            ? 'bg-white/95 border-slate-300 text-slate-800 shadow-slate-300/50'
            : 'bg-slate-950/95 border-indigo-500/40 text-slate-100 shadow-indigo-950/80 ring-1 ring-indigo-500/30'
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
            <div
              className={`p-2 rounded-xl border shrink-0 ${
                isWhite
                  ? 'bg-indigo-100 border-indigo-200 text-indigo-700'
                  : 'bg-indigo-950/80 border-indigo-500/40 text-indigo-400'
              }`}
            >
              <Shield className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  className={`font-bold font-title tracking-wider text-sm sm:text-base ${
                    isWhite ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  SYSTEM STATUS WINDOW
                </h3>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                    isWhite
                      ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                      : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                  }`}
                >
                  Lv.{state.level || 1}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${danger.className}`}>
                  {danger.label}
                </span>
              </div>
              <p
                className={`text-[11px] font-mono ${
                  isWhite ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                หน้าต่างสถานะและสถิติข้อมูลผู้จุติใหม่แห่ง The System
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClose();
              onToggle();
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

        {/* Tab Navigation */}
        <div
          className={`flex border-b px-5 pt-2 gap-2 text-xs font-mono ${
            isWhite
              ? 'bg-slate-100/60 border-slate-200'
              : 'bg-slate-900/40 border-indigo-500/20'
          }`}
        >
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('profile');
            }}
            className={`pb-2 px-3 border-b-2 font-medium transition flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? isWhite
                  ? 'border-indigo-600 text-indigo-700 font-bold'
                  : 'border-indigo-500 text-white font-bold'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>ข้อมูล & พลังกาย</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('skills');
            }}
            className={`pb-2 px-3 border-b-2 font-medium transition flex items-center gap-1.5 ${
              activeTab === 'skills'
                ? isWhite
                  ? 'border-purple-600 text-purple-700 font-bold'
                  : 'border-purple-500 text-purple-300 font-bold'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>สกิลพิเศษ ({state.skills?.length || 0})</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('inventory');
            }}
            className={`pb-2 px-3 border-b-2 font-medium transition flex items-center gap-1.5 ${
              activeTab === 'inventory'
                ? isWhite
                  ? 'border-emerald-600 text-emerald-700 font-bold'
                  : 'border-emerald-500 text-emerald-300 font-bold'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>ช่องเก็บของ ({state.inventory?.length || 0})</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {activeTab === 'profile' && (
            <>
              {/* Profile Card */}
              <div
                className={`p-4 rounded-xl border space-y-3 ${
                  isWhite ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/80 border-slate-800'
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

              {/* Vitals Gauges (HP & MP) */}
              <div
                className={`p-4 rounded-xl border space-y-3 font-mono ${
                  isWhite ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/80 border-slate-800'
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

              {/* Location & Objective */}
              <div
                className={`p-4 rounded-xl border space-y-2.5 ${
                  isWhite ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/80 border-slate-800'
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
            </>
          )}

          {activeTab === 'skills' && (
            <div
              className={`p-4 rounded-xl border space-y-3 ${
                isWhite ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold text-purple-600">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> สกิล & ความสามารถพิเศษ
                </span>
                <span className={isWhite ? 'text-slate-500 text-[10px]' : 'text-slate-400 text-[10px]'}>
                  (คลิกเพื่อใช้งานในแชททันที)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {state.skills && state.skills.length > 0 ? (
                  state.skills.map((skill, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        sound.playClick();
                        onUseSkill?.(skill);
                        onToggle();
                      }}
                      className={`text-xs p-3 rounded-xl border text-left transition flex items-center justify-between gap-2 select-card-glow touch-manipulation shadow-sm ${
                        isWhite
                          ? 'bg-purple-50 hover:bg-purple-100/80 border-purple-200 text-purple-900'
                          : 'bg-purple-950/40 hover:bg-purple-900/60 border-purple-500/30 text-purple-100 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">⚡</span>
                        <span className="font-semibold">{skill}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 border border-purple-400/30">
                        ใช้งาน ›
                      </span>
                    </button>
                  ))
                ) : (
                  <div
                    className={`col-span-2 text-xs italic p-4 text-center border rounded-xl border-dashed ${
                      isWhite ? 'border-slate-300 text-slate-400' : 'border-slate-800 text-slate-500'
                    }`}
                  >
                    ยังไม่ได้รับการปลุกสกิลหรือทักษะพิเศษ — ดำเนินเรื่องราวเพื่อปลดล็อค
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div
              className={`p-4 rounded-xl border space-y-3 ${
                isWhite ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-600">
                <span className="flex items-center gap-1.5">
                  <Package className="w-4 h-4" /> คลังสัมภาระ & ไอเทม
                </span>
                <span className={isWhite ? 'text-slate-500 text-[10px]' : 'text-slate-400 text-[10px]'}>
                  (คลิกเพื่อใช้งานในแชททันที)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {state.inventory && state.inventory.length > 0 ? (
                  state.inventory.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        sound.playClick();
                        onUseItem?.(item);
                        onToggle();
                      }}
                      className={`text-xs p-3 rounded-xl border text-left transition flex items-center justify-between gap-2 select-card-glow touch-manipulation shadow-sm ${
                        isWhite
                          ? 'bg-emerald-50 hover:bg-emerald-100/80 border-emerald-200 text-emerald-900'
                          : 'bg-emerald-950/40 hover:bg-emerald-900/60 border-emerald-500/30 text-emerald-100 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">📦</span>
                        <span className="font-semibold">{item}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/30">
                        ใช้งาน ›
                      </span>
                    </button>
                  ))
                ) : (
                  <div
                    className={`col-span-2 text-xs italic p-4 text-center border rounded-xl border-dashed ${
                      isWhite ? 'border-slate-300 text-slate-400' : 'border-slate-800 text-slate-500'
                    }`}
                  >
                    คลังสัมภาระว่างเปล่า — สำรวจโลกและค้นหาไอเทมในการเดินทาง
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`px-5 py-3 border-t flex items-center justify-between ${
            isWhite ? 'bg-slate-50/90 border-slate-200' : 'bg-slate-900/90 border-slate-800'
          }`}
        >
          <span
            className={`text-[11px] font-mono ${
              isWhite ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            กด Esc หรือแตะภายนอกเพื่อกลับสู่บทสนทนา
          </span>

          <button
            onClick={() => {
              sound.playClose();
              onToggle();
            }}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition active:scale-95 shadow-sm"
          >
            ปิดหน้าต่างสถานะ
          </button>
        </div>
      </div>
    </div>
  );
};
