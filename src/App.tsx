/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  CharacterState,
  ChatMessage,
  DiceRollResult,
  GamePreset,
  ThemeMode,
  ChatSessionArchive,
} from './types';
import { INITIAL_GM_MESSAGE_CONTENT, PRESETS } from './data/presets';
import { VoidBackground } from './components/VoidBackground';
import { StatusHUD } from './components/StatusHUD';
import { MessageList } from './components/MessageList';
import { ActionControls } from './components/ActionControls';
import { SetupModal } from './components/SetupModal';
import { DiceModal } from './components/DiceModal';
import { ResetModal } from './components/ResetModal';
import { ArchivesModal } from './components/ArchivesModal';
import { SystemHubModal } from './components/SystemHubModal';
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
  Archive,
  Sun,
  Moon,
  Sliders,
  Activity,
  Heart,
  Zap,
  Shield,
  Layers,
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
          // Clean any previous artifacts of "Incomplete JSON segment at the end"
          return parsed.messages.map((m: ChatMessage) => ({
            ...m,
            content: m.content
              .replace(/\n\n\*\[แจ้งเตือนระบบ: เกิดข้อผิดพลาด.*?Incomplete JSON segment.*?\]\*/gi, '')
              .trim(),
          }));
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
  const [isHUDOpen, setIsHUDOpen] = useState(false);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isDiceOpen, setIsDiceOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isHubOpen, setIsHubOpen] = useState(false);

  // Background Theme: 'dark' (black) or 'white'
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('the_system_theme');
    return saved === 'white' ? 'white' : 'dark';
  });

  const isWhite = themeMode === 'white';

  useEffect(() => {
    localStorage.setItem('the_system_theme', themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    sound.playClick();
    setThemeMode((prev) => (prev === 'dark' ? 'white' : 'dark'));
  };

  // Chronicle Archives list (Old chats saved / stored)
  const [archives, setArchives] = useState<ChatSessionArchive[]>(() => {
    const saved = localStorage.getItem('the_system_rpg_archives');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error('Failed to parse archives', e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('the_system_rpg_archives', JSON.stringify(archives));
  }, [archives]);

  const [isArchivesOpen, setIsArchivesOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

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
        let errMsg = `เซิร์ฟเวอร์ตอบกลับสถานะ ${response.status}`;
        try {
          const errData = await response.json();
          if (errData.error) errMsg = errData.error;
        } catch {
          // ignore json parse error
        }
        throw new Error(errMsg);
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
                // If it's the SDK trailing buffer artifact and we already have content, don't show error
                if (!parsed.error.includes('Incomplete JSON') || !accumulatedText) {
                  accumulatedText += `\n\n*[แจ้งเตือนระบบ: เกิดข้อผิดพลาด ${parsed.error}]*`;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === modelMsgId ? { ...msg, content: accumulatedText } : msg
                    )
                  );
                }
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

  // Save current active session into archives
  const handleArchiveCurrentChat = (notify: boolean = true) => {
    if (messages.length <= 1 && characterState.name === INITIAL_CHARACTER_STATE.name) {
      if (notify) alert('ยังไม่มีบทสนทนาที่ต้องการจัดเก็บ');
      return null;
    }
    sound.playLevelUp();
    const archiveItem: ChatSessionArchive = {
      id: `archive-${Date.now()}`,
      name: characterState.name || 'ดวงวิญญาณแห่งความว่างเปล่า',
      world: characterState.world || 'พื้นที่สีขาวว่างเปล่า',
      characterState: { ...characterState },
      messages: [...messages],
      createdAt: messages[0]?.timestamp || Date.now(),
      updatedAt: Date.now(),
      messageCount: messages.length,
    };

    setArchives((prev) => [archiveItem, ...prev]);
    if (notify) {
      alert(`จัดเก็บประวัติเรื่องราวของ "${archiveItem.name}" เข้าสู่คลังเรียบร้อยแล้ว!`);
    }
    return archiveItem;
  };

  // Archive and reset to start new
  const handleArchiveAndReset = () => {
    handleArchiveCurrentChat(false);
    resetToWhiteVoid();
  };

  // Delete active session and reset to start new
  const handleDeleteAndReset = () => {
    resetToWhiteVoid();
  };

  const resetToWhiteVoid = () => {
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
    sound.playChime();
  };

  // Load an archive to play
  const handleLoadArchive = (archive: ChatSessionArchive) => {
    sound.playLevelUp();
    setMessages(archive.messages);
    setCharacterState(archive.characterState);
    localStorage.setItem(
      'the_system_rpg_autosave',
      JSON.stringify({
        messages: archive.messages,
        characterState: archive.characterState,
        savedAt: Date.now(),
      })
    );
    setIsArchivesOpen(false);
  };

  // Delete single archive
  const handleDeleteArchive = (id: string) => {
    sound.playCombat();
    setArchives((prev) => prev.filter((a) => a.id !== id));
  };

  // Clear all archives
  const handleClearAllArchives = () => {
    sound.playCombat();
    setArchives([]);
  };

  // Export archive to markdown
  const handleExportArchive = (archive: ChatSessionArchive) => {
    sound.playClick();
    const title = `# บันทึกตำนานการจุติ (Chronicle of Reincarnation): ${archive.characterState.name}\n\n`;
    const meta = `> โลก: ${archive.characterState.world}\n> เผ่าพันธุ์: ${archive.characterState.race} | ระดับ: Lv.${archive.characterState.level}\n> วันที่บันทึก: ${new Date(archive.updatedAt || archive.createdAt).toLocaleString()}\n\n---\n\n`;

    const body = archive.messages
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
    link.download = `reincarnation_${archive.characterState.name || 'hero'}_${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`relative min-h-screen flex flex-col transition-colors duration-300 selection:bg-indigo-500 selection:text-white ${
        isWhite ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'
      }`}
    >
      {/* Dynamic Ambient Background (Canvas Particle System) */}
      <VoidBackground themeMode={themeMode} />

      {/* Master Holographic System Command Header */}
      <header
        className={`relative z-10 flex items-center justify-between px-3 sm:px-6 py-2 sm:py-2.5 border-b backdrop-blur-md pt-safe sm:pt-2.5 transition-colors ${
          isWhite
            ? 'bg-white/95 border-slate-200 text-slate-800 shadow-sm'
            : 'bg-slate-950/95 border-indigo-500/25 text-slate-100 shadow-lg shadow-black/20'
        }`}
      >
        {/* Left: System Emblem & Interactive Character Status Chip */}
        <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
          <button
            onClick={() => {
              sound.playChime();
              setIsHubOpen(true);
            }}
            title="เปิดหน้าต่างเลือกระบบ (Select Screen)"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/40 shrink-0 cursor-pointer select-card-glow active:scale-95 transition"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
          </button>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span
                className={`text-xs sm:text-sm font-bold font-title tracking-wider ${
                  isWhite ? 'text-slate-900' : 'text-white'
                }`}
              >
                THE SYSTEM
              </span>
              <span
                className={`text-[9px] font-mono px-1.5 py-0.2 rounded border font-semibold ${
                  isWhite
                    ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                    : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                }`}
              >
                GM RPG
              </span>
            </div>

            {/* Clickable Quick Status Chip */}
            <div
              onClick={() => {
                sound.playOpen();
                setIsHUDOpen(true);
              }}
              title="คลิกเพื่อดูหน้าต่างสถานะตัวละครแบบเต็ม"
              className={`flex items-center gap-1.5 cursor-pointer group text-[11px] truncate mt-0.5 select-none transition ${
                isWhite ? 'hover:text-indigo-600' : 'hover:text-indigo-300'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="font-semibold truncate max-w-[120px] sm:max-w-[180px]">
                {characterState.name || 'ดวงวิญญาณ'}
              </span>
              <span
                className={`text-[9px] font-mono px-1 py-0.2 rounded border ${
                  isWhite
                    ? 'bg-slate-100 border-slate-300 text-slate-600'
                    : 'bg-slate-900 border-slate-700 text-slate-300'
                }`}
              >
                Lv.{characterState.level || 1}
              </span>
              <span className="hidden md:inline-block text-[10px] font-mono opacity-60">
                • {characterState.world || 'ห้องสีขาว'}
              </span>
            </div>
          </div>
        </div>

        {/* Center / Right: Action Hub with the new Select Screen Trigger */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick HP/MP Orb or Gauge (Compact) */}
          <div
            onClick={() => {
              sound.playOpen();
              setIsHUDOpen(true);
            }}
            title="HP และ MP ปัจจุบัน (คลิกเพื่อดูสถานะ)"
            className={`hidden xs:flex items-center gap-2 px-2 sm:px-2.5 py-1 rounded-xl border cursor-pointer select-card-glow transition ${
              isWhite
                ? 'bg-slate-100 hover:bg-slate-200/70 border-slate-300'
                : 'bg-slate-900/90 hover:bg-slate-900 border-indigo-500/30'
            }`}
          >
            {/* HP */}
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3 text-rose-500 shrink-0" />
              <div className="w-8 sm:w-12 h-1.5 rounded-full bg-slate-800/40 overflow-hidden">
                <div
                  className="h-full bg-rose-500"
                  style={{
                    width: `${Math.max(0, Math.min(100, (characterState.hp / (characterState.maxHp || 100)) * 100))}%`,
                  }}
                />
              </div>
              <span className="text-[10px] font-mono font-bold text-rose-400">
                {characterState.hp}
              </span>
            </div>

            {/* MP */}
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-sky-500 shrink-0" />
              <div className="w-8 sm:w-12 h-1.5 rounded-full bg-slate-800/40 overflow-hidden">
                <div
                  className="h-full bg-sky-500"
                  style={{
                    width: `${Math.max(0, Math.min(100, (characterState.mp / (characterState.maxMp || 50)) * 100))}%`,
                  }}
                />
              </div>
              <span className="text-[10px] font-mono font-bold text-sky-400">
                {characterState.mp}
              </span>
            </div>
          </div>

          {/* Quick Theme Switcher */}
          <button
            onClick={toggleTheme}
            title={isWhite ? 'เปลี่ยนเป็นธีมมืด (พื้นหลังสีดำ)' : 'เปลี่ยนเป็นธีมสว่าง (พื้นหลังสีขาว)'}
            className={`px-2 py-1.5 sm:px-2.5 rounded-xl border text-xs font-medium transition flex items-center gap-1 select-card-glow min-h-[34px] touch-manipulation ${
              isWhite
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                : 'bg-slate-900 active:bg-slate-800 border-slate-700 text-amber-400 hover:text-white'
            }`}
          >
            {isWhite ? <Moon className="w-3.5 h-3.5 text-slate-700" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
            <span className="text-[11px] hidden md:inline">{isWhite ? 'มืด' : 'สว่าง'}</span>
          </button>

          {/* Direct Status Window button */}
          <button
            onClick={() => {
              sound.playOpen();
              setIsHUDOpen(true);
            }}
            title="เปิดหน้าต่างสถานะตัวละคร (Status Sheet)"
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-medium transition flex items-center gap-1.5 select-card-glow min-h-[34px] touch-manipulation ${
              isWhite
                ? 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700'
                : 'bg-indigo-950/80 active:bg-indigo-900 border-indigo-500/40 text-indigo-200 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[11px] sm:text-xs">สถานะ</span>
          </button>

          {/* 🌟 Master Select Screen Button (ศูนย์เลือกระบบ) */}
          <button
            onClick={() => {
              sound.playSelect();
              setIsHubOpen(true);
            }}
            title="เปิดหน้าจอเลือกระบบ (System Command Hub)"
            className="relative px-3 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 select-card-glow min-h-[34px] touch-manipulation border border-indigo-400/40 active:scale-95"
          >
            <Sliders className="w-3.5 h-3.5 animate-pulse" />
            <span className="text-[11px] sm:text-xs font-bold tracking-wide">
              ✦ เลือกระบบ
            </span>
            {archives.length > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-white text-indigo-900 text-[9px] font-bold">
                {archives.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* System Status HUD Full Blurred Modal */}
      <StatusHUD
        state={characterState}
        isOpen={isHUDOpen}
        onToggle={() => setIsHUDOpen(!isHUDOpen)}
        onUseSkill={(skill) => handleSendMessage(`[ใช้สกิล: ${skill}]`)}
        onUseItem={(item) => handleSendMessage(`[ใช้งานไอเทม: ${item}]`)}
        themeMode={themeMode}
      />

      {/* Narrative Message Scroll Area */}
      <main className="relative z-10 flex-1 flex flex-col max-w-5xl w-full mx-auto overflow-hidden">
        <MessageList
          messages={messages}
          isStreaming={isStreaming}
          onSelectAction={handleSelectAction}
          themeMode={themeMode}
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
          onReset={() => setIsResetModalOpen(true)}
          onOpenArchives={() => setIsArchivesOpen(true)}
          onToggleTheme={toggleTheme}
          onOpenHub={() => setIsHubOpen(true)}
          archivesCount={archives.length}
          themeMode={themeMode}
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

      {/* Reset Game Confirmation Modal */}
      <ResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onArchiveAndReset={handleArchiveAndReset}
        onDeleteAndReset={handleDeleteAndReset}
        characterName={characterState.name}
        messageCount={messages.length}
        themeMode={themeMode}
      />

      {/* Chronicle Archives Modal */}
      <ArchivesModal
        isOpen={isArchivesOpen}
        onClose={() => setIsArchivesOpen(false)}
        archives={archives}
        onLoadArchive={handleLoadArchive}
        onDeleteArchive={handleDeleteArchive}
        onClearAllArchives={handleClearAllArchives}
        onExportArchive={handleExportArchive}
        onArchiveCurrentChat={() => handleArchiveCurrentChat(true)}
        themeMode={themeMode}
      />

      {/* Help / GM System Rules Modal */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div
            className={`w-full max-w-xl rounded-2xl shadow-2xl p-6 space-y-4 border transition-colors ${
              isWhite
                ? 'bg-white border-slate-300 text-slate-800'
                : 'bg-slate-900 border-indigo-500/40 text-slate-200'
            }`}
          >
            <div
              className={`flex items-center justify-between border-b pb-3 ${
                isWhite ? 'border-slate-200' : 'border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2 text-indigo-500">
                <BookOpen className="w-5 h-5" />
                <h3
                  className={`font-bold font-title text-base ${
                    isWhite ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  คู่มือ &amp; กฎเกณฑ์ของ Game Master (The System Rules)
                </h3>
              </div>
              <button
                onClick={() => setIsHelpOpen(false)}
                className={`p-1 rounded-lg ${
                  isWhite
                    ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              className={`space-y-3 text-xs leading-relaxed ${
                isWhite ? 'text-slate-600' : 'text-slate-300'
              }`}
            >
              <div
                className={`p-3 rounded-xl border ${
                  isWhite
                    ? 'bg-indigo-50/70 border-indigo-200'
                    : 'bg-indigo-950/40 border-indigo-500/20'
                }`}
              >
                <h4
                  className={`font-bold mb-1 ${
                    isWhite ? 'text-indigo-800' : 'text-indigo-300'
                  }`}
                >
                  🎮 ระบบการเล่น (Gameplay System):
                </h4>
                <p>
                  เกม RPG สไตล์ Text-based ที่ตอบสนองต่อทุกการกระทำของคุณอย่างอิสระ ไม่มีทางเลือกตายตัว
                  คุณสามารถพิมพ์คำพูด การกระทำ หรือแนวทางการตัดสินใจได้อย่างอิสระ GM จะบรรยายสภาพแวดล้อม
                  ปฏิกิริยาของ NPC และส่งจังหวะให้คุณตัดสินใจเสมอ
                </p>
              </div>

              <div
                className={`p-3 rounded-xl border ${
                  isWhite ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <h4
                  className={`font-bold mb-1 ${
                    isWhite ? 'text-emerald-700' : 'text-emerald-300'
                  }`}
                >
                  💬 คีย์ลัดการเล่น (RP Syntax):
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>"คำพูด":</strong> ใช้เครื่องหมายอัญประกาศเมื่อต้องการให้ตัวละครพูดกับ NPC</li>
                  <li><strong>*การกระทำ*:</strong> ใช้เครื่องหมายดอกจันเพื่อบรรยายท่วงท่า เช่น *ชักดาบฟาดใส่ลำคอ*</li>
                  <li><strong>[ตรวจสอบระบบ]:</strong> เพื่อดูข้อมูล ค่าพลัง หรือวิเคราะห์สิ่งของรอบตัว</li>
                </ul>
              </div>

              <div
                className={`p-3 rounded-xl border ${
                  isWhite ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <h4
                  className={`font-bold mb-1 ${
                    isWhite ? 'text-purple-700' : 'text-purple-300'
                  }`}
                >
                  🎲 ลูกเต๋าแห่งชะตา (Fate Dice):
                </h4>
                <p>
                  คุณสามารถกดปุ่ม "ทอยเต๋า" เพื่อสุ่มค่า D20 / D100 ในการกระทำที่ท้าทาย
                  (เช่น ลอบเร้น, โจมตีจุดตาย, เจรจา) ผลลัพธ์จะถูกนำไปคิดในเนื้อเรื่องอย่างสมจริง
                </p>
              </div>

              <div
                className={`p-3 rounded-xl border ${
                  isWhite ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <h4
                  className={`font-bold mb-1 ${
                    isWhite ? 'text-amber-700' : 'text-amber-300'
                  }`}
                >
                  🔥 มิติของเนื้อหา (Mature &amp; Combat):
                </h4>
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

      {/* System Select Screen (หน้า Select คำสั่งระบบ) */}
      <SystemHubModal
        isOpen={isHubOpen}
        onClose={() => setIsHubOpen(false)}
        characterState={characterState}
        archivesCount={archives.length}
        themeMode={themeMode}
        onToggleTheme={toggleTheme}
        onOpenStatus={() => setIsHUDOpen(true)}
        onOpenReincarnate={() => setIsSetupOpen(true)}
        onOpenArchives={() => setIsArchivesOpen(true)}
        onOpenDice={() => setIsDiceOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenReset={() => setIsResetModalOpen(true)}
      />
    </div>
  );
}
