/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { CharacterState, ChatMessage, DiceRollResult, GamePreset } from './types';
import { INITIAL_GM_MESSAGE_CONTENT, PRESETS } from './data/presets';
import { VoidBackground } from './components/VoidBackground';
import { StatusHUD } from './components/StatusHUD';
import { MessageList } from './components/MessageList';
import { ActionControls } from './components/ActionControls';
import { SetupModal } from './components/SetupModal';
import { DiceModal } from './components/DiceModal';
import { sound } from './utils/sound';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  RotateCcw,
  BookOpen,
  HelpCircle,
  X,
  Volume2,
  VolumeX,
} from 'lucide-react';

const INITIAL_CHARACTER_STATE: CharacterState = {
  name: 'ดวงวิญญาณแห่งความว่างเปล่า',
  title: 'ผู้รอคอยการจุติ',
  race: 'ดวงวิญญาณบริสุทธิ์',
  gender: 'ยังไม่ได้กำหนด',
  age: 'ไร้กาลเวลา',
  appearance: 'กลุ่มควันเรืองแสงสีขาว',
  personality: 'ยังไม่ได้กำหนด',
  world: 'พื้นที่สีขาวว่างเปล่าหลังความตาย (The White Void)',
  lastWish: 'ยังไม่ได้ระบุ',
  regretMemory: 'ยังไม่ได้ระบุ',
  startingPower: 'ยังไม่ได้รับการปลุกพลัง',
  level: 1,
  hp: 100,
  maxHp: 100,
  mp: 50,
  maxMp: 50,
  location: 'พื้นที่สีขาวว่างเปล่าหลังความตาย (The White Void)',
  dangerLevel: 'Safe',
  skills: [],
  inventory: [],
  objective: 'ส่งมอบข้อมูลอดีตชาติ และสิทธิ์กำหนดการเกิดใหม่แก่ Game Master',
};

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('the_system_rpg_autosave');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.messages && parsed.messages.length > 0) {
          return parsed.messages;
        }
      } catch (e) {
        console.error('Failed to parse autosave', e);
      }
    }
    return [
      {
        id: 'initial-gm',
        role: 'model',
        content: INITIAL_GM_MESSAGE_CONTENT,
        timestamp: Date.now(),
        suggestedActions: [
          'เลือกต้นแบบ: นักล่าอสูรคำสาปโลหิต (Dark Fantasy)',
          'เลือกต้นแบบ: ซินดิเคทเงาไซเบอร์เนติกส์ (Cyberpunk 2099)',
          'เลือกต้นแบบ: มัจจุราชวันสิ้นโลก (Zombie Apocalypse)',
          'เลือกต้นแบบ: จักรพรรดิแห่งดันเจี้ยนมรณะ (Shadow Monarch)',
        ],
      },
    ];
  });

  const [characterState, setCharacterState] = useState<CharacterState>(() => {
    const saved = localStorage.getItem('the_system_rpg_autosave');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.characterState) {
          return parsed.characterState;
        }
      } catch (e) {
        console.error('Failed to parse character autosave', e);
      }
    }
    return INITIAL_CHARACTER_STATE;
  });

  const [isStreaming, setIsStreaming] = useState(false);
  const [isHUDOpen, setIsHUDOpen] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth >= 768 : false;
  });
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isDiceOpen, setIsDiceOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Check if player is still in Phase 1 (The White Void)
  const isVoidPhase =
    characterState.location?.includes('พื้นที่สีขาว') ||
    characterState.world?.includes('พื้นที่สีขาว') ||
    messages.length <= 2;

  // Auto-save on state or message update
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(
        'the_system_rpg_autosave',
        JSON.stringify({ messages, characterState, savedAt: Date.now() })
      );
    }
  }, [messages, characterState]);

  // Helper to parse system sync comments from model response
  const parseAndApplySystemSync = (fullText: string) => {
    const syncMatch = fullText.match(/<!--SYSTEM_SYNC:([\s\S]*?)-->/);
    if (syncMatch && syncMatch[1]) {
      try {
        const syncData = JSON.parse(syncMatch[1].trim());
        setCharacterState((prev) => {
          const updated = { ...prev };
          if (syncData.name) updated.name = syncData.name;
          if (syncData.race) updated.race = syncData.race;
          if (syncData.title) updated.title = syncData.title;
          if (typeof syncData.level === 'number') {
            if (syncData.level > prev.level) {
              sound.playLevelUp();
              confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
            }
            updated.level = syncData.level;
          }
          if (typeof syncData.hp === 'number') {
            if (syncData.hp < prev.hp) {
              sound.playCombat();
            }
            updated.hp = syncData.hp;
          }
          if (typeof syncData.maxHp === 'number') updated.maxHp = syncData.maxHp;
          if (typeof syncData.mp === 'number') updated.mp = syncData.mp;
          if (typeof syncData.maxMp === 'number') updated.maxMp = syncData.maxMp;
          if (syncData.location) updated.location = syncData.location;
          if (syncData.dangerLevel) updated.dangerLevel = syncData.dangerLevel;
          if (Array.isArray(syncData.skills)) updated.skills = syncData.skills;
          if (Array.isArray(syncData.inventory)) updated.inventory = syncData.inventory;
          if (syncData.objective) updated.objective = syncData.objective;
          return updated;
        });

        return syncData.suggestedActions || [];
      } catch (err) {
        console.error('Failed to parse SYSTEM_SYNC JSON', err);
      }
    }
    return [];
  };

  // Send message to server and stream response
  const handleSendMessage = async (text: string, diceResult?: DiceRollResult) => {
    if (isStreaming) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
      diceRoll: diceResult,
    };

    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setIsStreaming(true);

    const modelMsgId = `model-${Date.now()}`;
    const initialModelMessage: ChatMessage = {
      id: modelMsgId,
      role: 'model',
      content: '',
      timestamp: Date.now(),
    };

    setMessages([...updatedHistory, initialModelMessage]);

    try {
      sound.playChime();
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Server returned ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunkStr = decoder.decode(value, { stream: true });
        const lines = chunkStr.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataContent = line.slice(6).trim();
            if (dataContent === '[DONE]') break;
            try {
              const parsed = JSON.parse(dataContent);
              if (parsed.chunk) {
                accumulatedText += parsed.chunk;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === modelMsgId ? { ...msg, content: accumulatedText } : msg
                  )
                );
              }
              if (parsed.error) {
                accumulatedText += `\n\n*[แจ้งเตือนระบบ: เกิดข้อผิดพลาด ${parsed.error}]*`;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === modelMsgId ? { ...msg, content: accumulatedText } : msg
                  )
                );
              }
            } catch {
              // Ignore partial JSON
            }
          }
        }
      }

      // After streaming finishes, extract sync data
      const suggestedActions = parseAndApplySystemSync(accumulatedText);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === modelMsgId
            ? { ...msg, content: accumulatedText, suggestedActions }
            : msg
        )
      );
    } catch (err: any) {
      console.error('Chat request error:', err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === modelMsgId
            ? {
                ...msg,
                content: `*[การเชื่อมต่อกับระบบเกิดความขัดข้อง: ${err.message || 'โปรดตรวจสอบการเชื่อมต่อและลองใหม่อีกครั้ง'}]*`,
              }
            : msg
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  // Handle Preset or Custom setup submission
  const handleSetupSubmit = (
    formattedMessage: string,
    presetMeta?: Partial<GamePreset>
  ) => {
    setIsSetupOpen(false);

    if (presetMeta) {
      setCharacterState((prev) => ({
        ...prev,
        name: presetMeta.name || prev.name,
        world: presetMeta.world || prev.world,
        race: presetMeta.race || prev.race,
        gender: presetMeta.gender || prev.gender,
        age: presetMeta.age || prev.age,
        appearance: presetMeta.appearance || prev.appearance,
        personality: presetMeta.personality || prev.personality,
        startingPower: presetMeta.startingPower || prev.startingPower,
        skills: presetMeta.startingPower ? [presetMeta.startingPower.split('&')[0].trim()] : prev.skills,
        objective: `เริ่มต้นการเกิดใหม่ในโลก ${presetMeta.world || ''}`,
      }));
    }

    handleSendMessage(formattedMessage);
  };

  // Handle Dice Roll Submission
  const handleDiceSubmit = (roll: DiceRollResult) => {
    const diceText = `[ผลการทอยเต๋าชะตา ${roll.dice}: ทอยได้ ${roll.roll} + โบนัส ${roll.modifier} = ${roll.total} (${roll.outcome})] สำหรับการกระทำ: "${roll.purpose}"`;
    handleSendMessage(diceText, roll);
  };

  // Handle Quick Action Selection
  const handleSelectAction = (actionText: string) => {
    // Check if it's a preset selection
    const matchedPreset = PRESETS.find(
      (p) => actionText.includes(p.title) || actionText.includes(p.id)
    );
    if (matchedPreset) {
      handleSetupSubmit(
        `[ ข้อมูลการยืนยันตัวตนและการจุติ ]
• ข้อมูลอดีตชาติ:
1. ชื่อ: ${matchedPreset.name}
2. ความปรารถนาสุดท้าย: ${matchedPreset.lastWish}
3. ความทรงจำที่เสียดายที่สุด: ${matchedPreset.regretMemory}

• สิทธิ์กำหนดการไปเกิดใหม่:
1. โลกที่ต้องการไปเกิดใหม่: ${matchedPreset.world}
2. ตัวตนและสถานะเริ่มต้น: เพศ${matchedPreset.gender}, อายุ ${matchedPreset.age}, เผ่าพันธุ์${matchedPreset.race}, รูปลักษณ์: ${matchedPreset.appearance}
3. พลังพิเศษ / สกิลเริ่มต้น / หน้าที่ของระบบ: ${matchedPreset.startingPower}

ระบบจงนำพาข้าจุติสู่โลกใบนี้ทันที!`,
        matchedPreset
      );
      return;
    }

    handleSendMessage(actionText);
  };

  // Undo turn
  const handleUndo = () => {
    if (messages.length <= 1 || isStreaming) return;
    sound.playClick();
    if (window.confirm('คุณต้องการย้อนการกระทำล่าสุด 1 ตาหรือไม่?')) {
      setMessages((prev) => {
        // Remove last model and last user message
        const last = prev[prev.length - 1];
        if (last.role === 'model') {
          return prev.slice(0, prev.length - 2);
        }
        return prev.slice(0, prev.length - 1);
      });
    }
  };

  // Save Game manually
  const handleSave = () => {
    sound.playLevelUp();
    localStorage.setItem(
      'the_system_rpg_manual_save',
      JSON.stringify({ messages, characterState, savedAt: Date.now() })
    );
    alert('บันทึกความคืบหน้าของชะตากรรมเรียบร้อยแล้ว!');
  };

  // Load Game
  const handleLoad = () => {
    const saved = localStorage.getItem('the_system_rpg_manual_save');
    if (!saved) {
      alert('ไม่พบข้อมูลเซฟที่บันทึกไว้');
      return;
    }
    sound.playChime();
    if (window.confirm('ต้องการโหลดจุดเซฟล่าสุดหรือไม่? ข้อมูลที่ยังไม่ได้บันทึกจะหายไป')) {
      const parsed = JSON.parse(saved);
      setMessages(parsed.messages);
      setCharacterState(parsed.characterState);
    }
  };

  // Export Story Chronicle as Markdown
  const handleExport = () => {
    sound.playClick();
    const title = `# บันทึกตำนานการจุติ (Chronicle of Reincarnation): ${characterState.name}\n\n`;
    const meta = `> โลก: ${characterState.world}\n> เผ่าพันธุ์: ${characterState.race} | ระดับ: Lv.${characterState.level}\n> วันที่บันทึก: ${new Date().toLocaleString()}\n\n---\n\n`;

    const body = messages
      .map((m) => {
        const speaker = m.role === 'model' ? '### 🌌 Game Master & The System' : '### ⚔️ ผู้เล่น';
        const cleanContent = m.content.replace(/<!--SYSTEM_SYNC:[\s\S]*?-->/g, '').trim();
        return `${speaker}\n\n${cleanContent}\n\n---\n`;
      })
      .join('\n');

    const blob = new Blob([title + meta + body], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reincarnation_chronicle_${characterState.name || 'hero'}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Reset Game
  const handleReset = () => {
    sound.playClick();
    if (window.confirm('คุณต้องการรีเซ็ตและเริ่มต้นเรื่องราวใหม่ตั้งแต่พื้นที่สีขาวว่างเปล่าหรือไม่?')) {
      localStorage.removeItem('the_system_rpg_autosave');
      setMessages([
        {
          id: 'initial-gm',
          role: 'model',
          content: INITIAL_GM_MESSAGE_CONTENT,
          timestamp: Date.now(),
          suggestedActions: [
            'เลือกต้นแบบ: นักล่าอสูรคำสาปโลหิต (Dark Fantasy)',
            'เลือกต้นแบบ: ซินดิเคทเงาไซเบอร์เนติกส์ (Cyberpunk 2099)',
            'เลือกต้นแบบ: มัจจุราชวันสิ้นโลก (Zombie Apocalypse)',
            'เลือกต้นแบบ: จักรพรรดิแห่งดันเจี้ยนมรณะ (Shadow Monarch)',
          ],
        },
      ]);
      setCharacterState(INITIAL_CHARACTER_STATE);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Ambient Background */}
      <VoidBackground isVoidPhase={isVoidPhase} />

      {/* Main Top Header */}
      <header className="relative z-10 flex items-center justify-between px-3 sm:px-6 py-2 sm:py-3 border-b border-indigo-500/20 bg-slate-950/90 backdrop-blur-md pt-safe sm:pt-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/40 shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xs sm:text-base font-bold font-title tracking-wider text-white flex items-center gap-1.5 sm:gap-2">
              <span>THE SYSTEM</span>
              <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                GM RPG
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
              Game Master และผู้ควบคุมระบบประจำการเกิดใหม่
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Reincarnation Protocol Trigger */}
          <button
            onClick={() => {
              sound.playClick();
              setIsSetupOpen(true);
            }}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-900/60 to-indigo-900/60 active:from-purple-800 active:to-indigo-800 border border-purple-500/40 text-purple-200 active:text-white text-xs font-medium transition flex items-center gap-1 shadow-sm min-h-[34px] touch-manipulation"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[11px] sm:text-xs">จุติใหม่</span>
          </button>

          {/* Guide / Rules Modal Trigger */}
          <button
            onClick={() => {
              sound.playClick();
              setIsHelpOpen(true);
            }}
            title="คู่มือและกฎของระบบ"
            className="p-1.5 sm:p-2 rounded-lg bg-slate-900 active:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition min-w-[34px] min-h-[34px] flex items-center justify-center touch-manipulation"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Reset Game */}
          <button
            onClick={handleReset}
            title="เริ่มเกมใหม่ทั้งหมด"
            className="p-1.5 sm:p-2 rounded-lg bg-slate-900 active:bg-slate-800 border border-slate-700 text-slate-400 hover:text-rose-400 transition min-w-[34px] min-h-[34px] flex items-center justify-center touch-manipulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* System Status HUD Bar */}
      <div className="relative z-10">
        <StatusHUD
          state={characterState}
          isOpen={isHUDOpen}
          onToggle={() => setIsHUDOpen(!isHUDOpen)}
          onUseSkill={(skill) => handleSendMessage(`[ใช้สกิล: ${skill}]`)}
          onUseItem={(item) => handleSendMessage(`[ใช้งานไอเทม: ${item}]`)}
        />
      </div>

      {/* Narrative Message Scroll Area */}
      <main className="relative z-10 flex-1 flex flex-col max-w-5xl w-full mx-auto overflow-hidden">
        <MessageList
          messages={messages}
          isStreaming={isStreaming}
          onSelectAction={handleSelectAction}
        />
      </main>

      {/* Bottom Action Controls */}
      <footer className="relative z-20">
        <ActionControls
          onSendMessage={handleSendMessage}
          onOpenDice={() => {
            sound.playClick();
            setIsDiceOpen(true);
          }}
          onOpenSetup={() => {
            sound.playClick();
            setIsSetupOpen(true);
          }}
          onUndo={handleUndo}
          onSave={handleSave}
          onLoad={handleLoad}
          onExport={handleExport}
          onReset={handleReset}
          disabled={isStreaming}
          canUndo={messages.length > 2}
        />
      </footer>

      {/* Reincarnation Protocol Modal */}
      <SetupModal
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
        onSubmit={handleSetupSubmit}
      />

      {/* Fate Dice Modal */}
      <DiceModal
        isOpen={isDiceOpen}
        onClose={() => setIsDiceOpen(false)}
        onSubmitRoll={handleDiceSubmit}
      />

      {/* Help / GM System Rules Modal */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-xl bg-slate-900 border border-indigo-500/40 rounded-2xl shadow-2xl p-6 text-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-indigo-400">
                <BookOpen className="w-5 h-5" />
                <h3 className="font-bold font-title text-white text-base">
                  คู่มือ &amp; กฎเกณฑ์ของ Game Master (The System Rules)
                </h3>
              </div>
              <button
                onClick={() => setIsHelpOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-300">
              <div className="p-3 bg-indigo-950/40 rounded-xl border border-indigo-500/20">
                <h4 className="font-bold text-indigo-300 mb-1">🎮 ระบบการเล่น (Gameplay System):</h4>
                <p>
                  เกม RPG สไตล์ Text-based ที่ตอบสนองต่อทุกการกระทำของคุณอย่างอิสระ ไม่มีทางเลือกตายตัว
                  คุณสามารถพิมพ์คำพูด การกระทำ หรือแนวทางการตัดสินใจได้อย่างอิสระ GM จะบรรยายสภาพแวดล้อม
                  ปฏิกิริยาของ NPC และส่งจังหวะให้คุณตัดสินใจเสมอ
                </p>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <h4 className="font-bold text-emerald-300 mb-1">💬 คีย์ลัดการเล่น (RP Syntax):</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li><strong>"คำพูด":</strong> ใช้เครื่องหมายอัญประกาศเมื่อต้องการให้ตัวละครพูดกับ NPC</li>
                  <li><strong>*การกระทำ*:</strong> ใช้เครื่องหมายดอกจันเพื่อบรรยายท่วงท่า เช่น *ชักดาบฟาดใส่ลำคอ*</li>
                  <li><strong>[ตรวจสอบระบบ]:</strong> เพื่อดูข้อมูล ค่าพลัง หรือวิเคราะห์สิ่งของรอบตัว</li>
                </ul>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <h4 className="font-bold text-purple-300 mb-1">🎲 ลูกเต๋าแห่งชะตา (Fate Dice):</h4>
                <p>
                  คุณสามารถกดปุ่ม "ทอยเต๋าชะตา" เพื่อสุ่มค่า D20 / D100 ในการกระทำที่ท้าทาย
                  (เช่น ลอบเร้น, โจมตีจุดตาย, เจรจา) ผลลัพธ์จะถูกนำไปคิดในเนื้อเรื่องอย่างสมจริง
                </p>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <h4 className="font-bold text-amber-300 mb-1">🔥 มิติของเนื้อหา (Mature &amp; Combat):</h4>
                <p>
                  ฉากต่อสู้ดิบ ดาร์ก เลือดสาดตามสถานการณ์ และสำหรับฉากความสัมพันธ์ลึกซึ้ง
                  ระบบจะปรับระดับความละเอียดตามความประสงค์ของผู้เล่น หากพิมพ์ย่อจะบรรยายมู้ดแล้วตัดภาพ (Fade to black)
                  หรือตอบรับตามน้ำหนักที่คุณเปิดประเด็นไว้
                </p>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setIsHelpOpen(false)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
              >
                เข้าใจแล้ว พร้อมผจญภัย
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
