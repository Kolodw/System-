import React, { useState } from 'react';
import { ChatMessage } from '../types';
import { marked } from 'marked';
import {
  Volume2,
  VolumeX,
  Loader2,
  Copy,
  Check,
  Dices,
  ShieldAlert,
  Sparkles,
  Bot,
  User,
} from 'lucide-react';
import { sound } from '../utils/sound';

interface MessageBubbleProps {
  message: ChatMessage;
  isLatest: boolean;
  onSelectAction?: (actionText: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isLatest,
  onSelectAction,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [copied, setCopied] = useState(false);

  // Clean raw content by removing hidden system sync comments
  const rawContent = message.content.replace(/<!--SYSTEM_SYNC:[\s\S]*?-->/g, '').trim();

  // Separate regular narrative from [ ข้อมูลสถานะ ] block if present
  const statusBoxRegex = /(-{3,}[\s\S]*?\[\s*ข้อมูลสถานะ\s*\][\s\S]*?-{3,})|(\[\s*ข้อมูลสถานะ\s*\][\s\S]*)/;
  const matchStatus = rawContent.match(statusBoxRegex);

  let narrativeText = rawContent;
  let statusBoxText = '';

  if (matchStatus) {
    statusBoxText = matchStatus[0];
    narrativeText = rawContent.replace(statusBoxText, '').trim();
  }

  // Render markdown HTML safely
  const renderedNarrativeHtml = marked.parse(narrativeText, {
    gfm: true,
    breaks: true,
  }) as string;

  const renderedStatusHtml = statusBoxText
    ? (marked.parse(statusBoxText, { gfm: true, breaks: true }) as string)
    : '';

  const handlePlayTTS = async () => {
    if (isPlayingAudio && currentAudio) {
      currentAudio.pause();
      setIsPlayingAudio(false);
      return;
    }

    if (message.audioUrl) {
      const audio = new Audio(message.audioUrl);
      audio.onended = () => setIsPlayingAudio(false);
      audio.play();
      setCurrentAudio(audio);
      setIsPlayingAudio(true);
      return;
    }

    try {
      setAudioLoading(true);
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: narrativeText,
          voice: 'Fenrir',
        }),
      });

      if (!res.ok) throw new Error('Failed to generate audio');
      const data = await res.json();
      if (data.audio) {
        const audioSrc = `data:audio/wav;base64,${data.audio}`;
        message.audioUrl = audioSrc;
        const audio = new Audio(audioSrc);
        audio.onended = () => setIsPlayingAudio(false);
        audio.play();
        setCurrentAudio(audio);
        setIsPlayingAudio(true);
      }
    } catch (err) {
      console.error('TTS error:', err);
    } finally {
      setAudioLoading(false);
    }
  };

  const handleCopy = () => {
    sound.playClick();
    navigator.clipboard.writeText(rawContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isModel = message.role === 'model';

  return (
    <div
      className={`flex flex-col w-full my-2 sm:my-3 animate-fadeIn ${
        isModel ? 'items-start' : 'items-end'
      }`}
    >
      <div
        className={`flex gap-2 sm:gap-3 w-full max-w-[98%] sm:max-w-[88%] ${
          isModel ? 'flex-row' : 'flex-row-reverse'
        }`}
      >
        {/* Avatar */}
        <div className="flex-shrink-0 mt-0.5">
          {isModel ? (
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-950 border border-indigo-500/50 flex items-center justify-center text-indigo-400 shadow-md shadow-indigo-950">
              <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          ) : (
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-md shadow-emerald-950">
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          )}
        </div>

        {/* Message Container */}
        <div className="flex flex-col gap-1 w-full min-w-0">
          {/* Header Info */}
          <div
            className={`flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-mono ${
              isModel ? 'text-indigo-300' : 'text-emerald-300 justify-end'
            }`}
          >
            <span className="font-bold truncate max-w-[160px] sm:max-w-none">
              {isModel ? 'Game Master' : 'คุณ (Player)'}
            </span>
            <span className="text-slate-500">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>

            {isModel && (
              <div className="flex items-center gap-1 ml-auto">
                <button
                  onClick={handlePlayTTS}
                  disabled={audioLoading}
                  title="ฟังเสียงบรรยาย GM (TTS)"
                  className="p-1 sm:px-1.5 rounded bg-indigo-950/60 active:bg-indigo-900 text-slate-300 hover:text-indigo-200 transition flex items-center gap-1 text-[10px] touch-manipulation min-h-[28px]"
                >
                  {audioLoading ? (
                    <Loader2 className="w-3 h-3 animate-spin text-indigo-400" />
                  ) : isPlayingAudio ? (
                    <VolumeX className="w-3 h-3 text-rose-400" />
                  ) : (
                    <Volume2 className="w-3 h-3 text-indigo-400" />
                  )}
                  <span>{isPlayingAudio ? 'หยุด' : 'ฟัง GM'}</span>
                </button>

                <button
                  onClick={handleCopy}
                  title="คัดลอกข้อความ"
                  className="p-1 rounded bg-slate-900 active:bg-slate-800 text-slate-400 hover:text-slate-200 transition min-w-[28px] min-h-[28px] flex items-center justify-center touch-manipulation"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Dice Roll Badge if attached to user message */}
          {message.diceRoll && (
            <div className="self-end px-2.5 py-1 rounded-lg bg-indigo-950/80 border border-indigo-500/40 text-[11px] font-mono text-indigo-200 flex items-center gap-1.5 shadow">
              <Dices className="w-3.5 h-3.5 text-indigo-400" />
              <span>
                {message.diceRoll.dice} ({message.diceRoll.roll}+{message.diceRoll.modifier}) ={' '}
                <strong className="text-white text-xs">{message.diceRoll.total}</strong>
              </span>
              <span className="text-indigo-300 text-[10px] border-l border-indigo-700/60 pl-1.5">
                {message.diceRoll.outcome}
              </span>
            </div>
          )}

          {/* Narrative Card */}
          <div
            className={`p-3.5 sm:p-5 rounded-2xl text-[13.5px] sm:text-sm leading-relaxed transition-all break-words ${
              isModel
                ? 'bg-slate-900/90 text-slate-100 border border-slate-700/60 shadow-xl backdrop-blur-md prose prose-invert max-w-none'
                : 'bg-emerald-950/50 text-slate-100 border border-emerald-500/30 shadow-md backdrop-blur-md self-end'
            }`}
          >
            {/* Story prose */}
            <div
              className="space-y-2.5 sm:space-y-3 prose-p:my-1.5 sm:prose-p:my-2 prose-headings:font-title prose-headings:text-indigo-200 prose-strong:text-indigo-300 prose-blockquote:border-l-indigo-500 prose-blockquote:text-slate-300"
              dangerouslySetInnerHTML={{ __html: renderedNarrativeHtml }}
            />

            {/* Stylized Status Box Widget */}
            {statusBoxText && (
              <div className="mt-3.5 sm:mt-4 p-3 sm:p-4 rounded-xl bg-slate-950/90 border border-indigo-500/40 shadow-inner relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-indigo-400 font-mono mb-2 border-b border-indigo-500/20 pb-1">
                  <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400 shrink-0" />
                  <span>[ ข้อมูลสถานะจากระบบ ]</span>
                </div>
                <div
                  className="text-[11.5px] sm:text-xs font-mono text-slate-300 space-y-0.5 sm:space-y-1"
                  dangerouslySetInnerHTML={{ __html: renderedStatusHtml }}
                />
              </div>
            )}
          </div>

          {/* Suggested Quick Actions */}
          {isLatest && isModel && message.suggestedActions && message.suggestedActions.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1.5 sm:gap-2 mt-1.5 pt-1">
              <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono flex items-center gap-1 self-start sm:self-center mr-1">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                ทางเลือกที่แนะนำ:
              </span>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1.5 w-full sm:w-auto">
                {message.suggestedActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      sound.playClick();
                      onSelectAction?.(action);
                    }}
                    className="w-full sm:w-auto text-left px-3 py-2 rounded-xl bg-indigo-950/70 active:bg-indigo-900 border border-indigo-500/40 active:border-indigo-400 text-xs text-indigo-200 active:text-white transition duration-150 shadow-sm active:scale-[0.98] flex items-center gap-1.5 min-h-[36px] touch-manipulation"
                  >
                    <span className="text-indigo-400 font-mono font-bold shrink-0">›</span>
                    <span className="truncate">{action}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
