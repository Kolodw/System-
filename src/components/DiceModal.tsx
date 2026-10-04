import React, { useState } from 'react';
import { DiceRollResult } from '../types';
import { sound } from '../utils/sound';
import { Dices, X, Sparkles, CheckCircle2, AlertOctagon } from 'lucide-react';

interface DiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitRoll: (roll: DiceRollResult) => void;
}

export const DiceModal: React.FC<DiceModalProps> = ({ isOpen, onClose, onSubmitRoll }) => {
  const [diceType, setDiceType] = useState<'d20' | 'd100' | 'd6' | 'd12'>('d20');
  const [modifier, setModifier] = useState<number>(0);
  const [purpose, setPurpose] = useState<string>('ทอยทดสอบการกระทำ (Action Check)');
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [result, setResult] = useState<DiceRollResult | null>(null);

  if (!isOpen) return null;

  const handleRoll = () => {
    setIsRolling(true);
    sound.playDice();

    let rollTimes = 0;
    const maxRolls = 10;
    const interval = setInterval(() => {
      rollTimes++;
      if (rollTimes >= maxRolls) {
        clearInterval(interval);
        finalizeRoll();
      }
    }, 60);
  };

  const finalizeRoll = () => {
    let sides = 20;
    if (diceType === 'd100') sides = 100;
    else if (diceType === 'd6') sides = 6;
    else if (diceType === 'd12') sides = 12;

    const baseRoll = Math.floor(Math.random() * sides) + 1;
    const total = baseRoll + modifier;

    let outcome = 'Normal';
    if (diceType === 'd20') {
      if (baseRoll === 20) {
        outcome = '⭐ ปาฏิหาริย์สำเร็จขั้นวิกฤต (Critical Success!)';
        sound.playLevelUp();
      } else if (baseRoll === 1) {
        outcome = '💀 หายนะล้มเหลวขั้นวิกฤต (Critical Failure!)';
        sound.playCombat();
      } else if (total >= 15) {
        outcome = '✨ สำเร็จอย่างงดงาม (Great Success)';
        sound.playChime();
      } else if (total >= 10) {
        outcome = '✔️ สำเร็จตามเป้า (Success)';
        sound.playChime();
      } else {
        outcome = '❌ ล้มเหลว (Failure)';
        sound.playCombat();
      }
    } else {
      outcome = `ผลรวม: ${total}`;
      sound.playChime();
    }

    const rollData: DiceRollResult = {
      dice: diceType.toUpperCase(),
      sides,
      roll: baseRoll,
      modifier,
      total,
      outcome,
      purpose,
      timestamp: new Date().toLocaleTimeString(),
    };

    setResult(rollData);
    setIsRolling(false);
  };

  const handleSubmit = () => {
    if (!result) return;
    sound.playClick();
    onSubmitRoll(result);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border border-indigo-500/40 rounded-2xl shadow-2xl overflow-hidden text-slate-100 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 bg-slate-950/70 border-b border-indigo-500/20">
          <div className="flex items-center gap-2 text-indigo-400">
            <Dices className="w-5 h-5 animate-spin-slow" />
            <span className="font-bold font-title tracking-wider text-white text-sm sm:text-base">
              ลูกเต๋าแห่งโชคชะตา (Fate Dice)
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg active:bg-slate-800 transition min-w-[36px] min-h-[36px] flex items-center justify-center touch-manipulation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 space-y-3.5 sm:space-y-4 overflow-y-auto">
          {/* Purpose Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              จุดประสงค์ในการทอย (Action Purpose)
            </label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="เช่น ทอยฟันดาบเล็งหัวใจ, ทอยลอบเร้น"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-base sm:text-xs text-white focus:outline-none focus:border-indigo-400"
            />
          </div>

          {/* Dice Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              เลือกประเภทลูกเต๋า
            </label>
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
              {(['d20', 'd100', 'd6', 'd12'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setDiceType(d);
                    setResult(null);
                  }}
                  className={`py-2.5 sm:py-2 text-xs font-bold font-mono rounded-xl border transition min-h-[42px] touch-manipulation active:scale-95 ${
                    diceType === d
                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {d.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Modifier */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              แต้มโบนัส (Modifier): {modifier >= 0 ? `+${modifier}` : modifier}
            </label>
            <div className="flex items-center gap-1.5 sm:gap-2">
              {[-2, 0, 1, 2, 3, 5].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setModifier(m);
                  }}
                  className={`flex-1 py-2 sm:py-1.5 text-xs font-mono rounded-lg border transition min-h-[38px] touch-manipulation active:scale-95 ${
                    modifier === m
                      ? 'bg-purple-600 border-purple-400 text-white font-bold'
                      : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {m >= 0 ? `+${m}` : m}
                </button>
              ))}
            </div>
          </div>

          {/* Roll Result Display */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950 border border-slate-800 text-center min-h-[100px] flex flex-col items-center justify-center">
            {isRolling ? (
              <div className="space-y-1.5">
                <Dices className="w-7 h-7 text-indigo-400 animate-spin mx-auto" />
                <p className="text-xs font-mono text-indigo-300 animate-pulse">
                  เต๋ากำลังหมุนวนในกระแสโชคชะตา...
                </p>
              </div>
            ) : result ? (
              <div className="space-y-1.5 animate-fadeIn">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-wider">
                    {result.total}
                  </span>
                  <div className="text-left text-xs font-mono text-slate-400 border-l border-slate-700 pl-2">
                    <div>เต๋า: {result.roll}</div>
                    <div>โบนัส: {result.modifier >= 0 ? `+${result.modifier}` : result.modifier}</div>
                  </div>
                </div>
                <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-indigo-300 inline-block">
                  {result.outcome}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                แตะปุ่ม "ทอยลูกเต๋า" เพื่อตัดสินเหตุการณ์
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1 pb-safe sm:pb-0">
            <button
              type="button"
              disabled={isRolling}
              onClick={handleRoll}
              className="flex-1 py-3 bg-indigo-600 active:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5 transition disabled:opacity-50 min-h-[44px] touch-manipulation"
            >
              <Dices className="w-4 h-4" />
              <span>{result ? 'ทอยใหม่อีกครั้ง' : 'ทอยลูกเต๋า'}</span>
            </button>

            {result && (
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 active:from-emerald-700 active:to-teal-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition min-h-[44px] touch-manipulation"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>ใช้ผลนี้</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
