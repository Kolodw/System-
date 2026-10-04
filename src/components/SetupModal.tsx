import React, { useState } from 'react';
import { PRESETS } from '../data/presets';
import { GamePreset } from '../types';
import { Sparkles, Compass, Shield, Skull, Zap, ChevronRight, X, User } from 'lucide-react';
import { sound } from '../utils/sound';

interface SetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formattedMessage: string, presetMeta?: Partial<GamePreset>) => void;
}

export const SetupModal: React.FC<SetupModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRESETS[0].id);

  // Custom Form Fields
  const [customName, setCustomName] = useState('');
  const [customWish, setCustomWish] = useState('');
  const [customRegret, setCustomRegret] = useState('');
  const [customWorld, setCustomWorld] = useState('ดาร์กแฟนตาซี / ยุคกลางต้องสาป');
  const [customIdentity, setCustomIdentity] = useState('เพศชาย อายุ 23 ปี ร่างกายสูงโปร่ง เผ่าพันธุ์มนุษย์ นิสัยสุขุมเด็ดขาด ไม่เกรงกลัวความตาย');
  const [customPower, setCustomPower] = useState('เนตรสัจธรรมมองเห็นจุดอ่อนของศัตรู & ระบบคลังมิติติดตัวไม่จำกัด');

  if (!isOpen) return null;

  const handleSelectPreset = (preset: GamePreset) => {
    sound.playClick();
    setSelectedPresetId(preset.id);
  };

  const handleConfirmPreset = () => {
    const preset = PRESETS.find((p) => p.id === selectedPresetId);
    if (!preset) return;

    sound.playLevelUp();
    const formatted = `[ ข้อมูลการยืนยันตัวตนและการจุติ ]
• ข้อมูลอดีตชาติ:
1. ชื่อ: ${preset.name}
2. ความปรารถนาสุดท้าย: ${preset.lastWish}
3. ความทรงจำที่เสียดายที่สุด: ${preset.regretMemory}

• สิทธิ์กำหนดการไปเกิดใหม่:
1. โลกที่ต้องการไปเกิดใหม่: ${preset.world} (${preset.worldDescription})
2. ตัวตนและสถานะเริ่มต้น: เพศ${preset.gender}, อายุ ${preset.age}, เผ่าพันธุ์${preset.race}, รูปลักษณ์: ${preset.appearance}, นิสัย: ${preset.personality}
3. พลังพิเศษ / สกิลเริ่มต้น / หน้าที่ของระบบ: ${preset.startingPower}

ข้าพร้อมแล้ว ท่าน Game Master จงเริ่มการจุติและเปิดฉากเรื่องราวเถิด!`;

    onSubmit(formatted, preset);
  };

  const handleConfirmCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) {
      alert('กรุณากรอกชื่อตัวละครของคุณ');
      return;
    }

    sound.playLevelUp();
    const formatted = `[ ข้อมูลการยืนยันตัวตนและการจุติ ]
• ข้อมูลอดีตชาติ:
1. ชื่อ: ${customName.trim()}
2. ความปรารถนาสุดท้าย: ${customWish.trim() || 'อยากมีชีวิตที่เลือกทางเดินด้วยตัวเอง'}
3. ความทรงจำที่เสียดายที่สุด: ${customRegret.trim() || 'การจากไปโดยยังไม่ได้ใช้ชีวิตอย่างเต็มที่'}

• สิทธิ์กำหนดการไปเกิดใหม่:
1. โลกที่ต้องการไปเกิดใหม่: ${customWorld.trim()}
2. ตัวตนและสถานะเริ่มต้น: ${customIdentity.trim()}
3. พลังพิเศษ / สกิลเริ่มต้น / หน้าที่ของระบบ: ${customPower.trim()}

ข้าตอบครบทุกประการแล้ว ระบบจงเปิดมิติและนำพาข้าไปเกิดใหม่เถิด!`;

    onSubmit(formatted, {
      name: customName,
      world: customWorld,
      startingPower: customPower,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full h-full sm:h-auto sm:max-w-3xl sm:max-h-[90vh] sm:rounded-2xl flex flex-col bg-slate-900 border-0 sm:border border-indigo-500/40 shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-indigo-500/20 bg-slate-950/80 pt-safe sm:pt-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-indigo-500/20 rounded-lg text-indigo-400 border border-indigo-500/30 shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-bold font-title tracking-wider text-white">
                โปรโตคอลการจุติสู่ภพใหม่
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400">
                กำหนด 3 อดีตชาติ และ 3 กฎเกณฑ์แห่งชีวิตใหม่
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg active:bg-slate-800 transition min-w-[36px] min-h-[36px] flex items-center justify-center touch-manipulation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-3 sm:px-6 pt-2">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('presets');
            }}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 transition flex items-center gap-1.5 min-h-[40px] touch-manipulation ${
              activeTab === 'presets'
                ? 'border-indigo-500 text-indigo-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span>ต้นแบบจุติด่วน</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('custom');
            }}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 transition flex items-center gap-1.5 min-h-[40px] touch-manipulation ${
              activeTab === 'custom'
                ? 'border-indigo-500 text-indigo-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span>สร้างตัวตนอิสระ</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {activeTab === 'presets' ? (
            <div className="space-y-3.5">
              <p className="text-xs text-slate-400">
                แตะเลือกแม่แบบตัวละครและโลกที่คุณต้องการ แล้วกด "ยืนยันและเริ่มการจุติ":
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {PRESETS.map((p) => {
                  const isSelected = selectedPresetId === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => handleSelectPreset(p)}
                      className={`relative p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all duration-200 text-left touch-manipulation active:scale-[0.99] ${
                        isSelected
                          ? 'bg-indigo-950/50 border-indigo-400 ring-2 ring-indigo-500/30 shadow-lg shadow-indigo-950/50'
                          : 'bg-slate-800/40 border-slate-700/60 active:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1.5">
                        <span className="text-xl sm:text-2xl">{p.icon}</span>
                        <span
                          className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full font-mono font-medium"
                          style={{
                            backgroundColor: `${p.accentColor}25`,
                            color: p.accentColor,
                            border: `1px solid ${p.accentColor}40`,
                          }}
                        >
                          {p.race}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-white font-title mb-0.5">
                        {p.title}
                      </h3>
                      <div className="text-xs text-indigo-300 font-medium mb-1">
                        {p.name} • {p.gender} ({p.age})
                      </div>
                      <p className="text-[11px] text-slate-300 line-clamp-2 mb-1.5 font-mono">
                        🌐 {p.world}
                      </p>
                      <p className="text-[11px] text-slate-400 line-clamp-2">
                        ⚡ {p.startingPower}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Selected Preset Details Box */}
              {selectedPresetId && (
                <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/70 border border-slate-700/70 space-y-2 text-xs">
                  {(() => {
                    const curr = PRESETS.find((p) => p.id === selectedPresetId);
                    if (!curr) return null;
                    return (
                      <>
                        <div className="flex items-center justify-between text-indigo-300 font-semibold border-b border-slate-800 pb-1.5">
                          <span>{curr.title}</span>
                          <span className="font-mono text-slate-400 text-[11px]">โลก: {curr.world}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-slate-300 text-[11.5px]">
                          <div>
                            <span className="text-slate-400">รูปลักษณ์:</span> {curr.appearance}
                          </div>
                          <div>
                            <span className="text-slate-400">นิสัย:</span> {curr.personality}
                          </div>
                          <div>
                            <span className="text-slate-400">ความปรารถนา:</span> {curr.lastWish}
                          </div>
                          <div>
                            <span className="text-slate-400">ความเสียดาย:</span> {curr.regretMemory}
                          </div>
                        </div>
                        <div className="pt-1 text-emerald-400 text-[11.5px]">
                          <span className="text-slate-400">พลังพิเศษ:</span> {curr.startingPower}
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          ) : (
            <form id="custom-form" onSubmit={handleConfirmCustom} className="space-y-3 sm:space-y-4">
              <div className="p-2.5 sm:p-3 bg-indigo-950/30 border border-indigo-500/20 rounded-xl text-xs text-indigo-200">
                กำหนดข้อมูลด้วยตัวคุณเองได้อย่างอิสระ GM จะปรับแต่งเนื้อเรื่องให้เข้ากับความต้องการของคุณ
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    1. ชื่อตัวละคร <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="เช่น ลูเซียน, ราเชล, ไคโร"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-base sm:text-sm text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    2. ความปรารถนาสุดท้าย
                  </label>
                  <input
                    type="text"
                    value={customWish}
                    onChange={(e) => setCustomWish(e.target.value)}
                    placeholder="เช่น อยากมีชีวิตอมตะ"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-base sm:text-sm text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    3. ความทรงจำที่เสียดายที่สุด
                  </label>
                  <input
                    type="text"
                    value={customRegret}
                    onChange={(e) => setCustomRegret(e.target.value)}
                    placeholder="เช่น ไม่ได้บอกลาครอบครัว"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-base sm:text-sm text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  4. โลกที่ต้องการไปเกิดใหม่ (Setting / World)
                </label>
                <input
                  type="text"
                  value={customWorld}
                  onChange={(e) => setCustomWorld(e.target.value)}
                  placeholder="เช่น ดาร์กแฟนตาซี, ไซเบอร์พังก์ดิสโทเปีย, ยุคซอมบี้วันสิ้นโลก"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-base sm:text-sm text-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  5. ตัวตนและสถานะเริ่มต้น (เพศ, อายุ, รูปลักษณ์, สรีระ, เผ่าพันธุ์, นิสัย)
                </label>
                <textarea
                  rows={2}
                  value={customIdentity}
                  onChange={(e) => setCustomIdentity(e.target.value)}
                  placeholder="เช่น เพศชาย อายุ 21 ปี สูงโปร่ง ผมดำ เผ่าเอลฟ์มืด นิสัยฉลาดแกมโกง"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-base sm:text-sm text-white focus:outline-none focus:border-indigo-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  6. พลังพิเศษ / สกิลเริ่มต้น / หน้าที่ของระบบที่คุณต้องการ
                </label>
                <textarea
                  rows={2}
                  value={customPower}
                  onChange={(e) => setCustomPower(e.target.value)}
                  placeholder="เช่น สกิลคัดลอกความสามารถศัตรู, เวทบงการเงา, คลังมิติติดตัว"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-base sm:text-sm text-white focus:outline-none focus:border-indigo-400 resize-none"
                />
              </div>
            </form>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-800 bg-slate-950 pb-safe sm:pb-4">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 text-xs font-medium text-slate-400 active:text-white transition touch-manipulation"
          >
            ยกเลิก (พิมพ์ในแชท)
          </button>

          {activeTab === 'presets' ? (
            <button
              onClick={handleConfirmPreset}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 active:from-indigo-700 active:to-purple-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition active:scale-[0.98] touch-manipulation min-h-[42px]"
            >
              <span>ยืนยันและเริ่มการจุติ</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              form="custom-form"
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 active:from-indigo-700 active:to-purple-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition active:scale-[0.98] touch-manipulation min-h-[42px]"
            >
              <span>ยืนยันตัวตนและสร้างโลก</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
