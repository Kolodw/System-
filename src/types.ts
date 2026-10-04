export interface CharacterState {
  name: string;
  title: string;
  race: string;
  gender: string;
  age: string;
  appearance: string;
  personality: string;
  world: string;
  lastWish: string;
  regretMemory: string;
  startingPower: string;
  level: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  location: string;
  dangerLevel: 'Safe' | 'Low' | 'Medium' | 'High' | 'Deadly';
  skills: string[];
  inventory: string[];
  objective: string;
}

export interface DiceRollResult {
  dice: string;
  sides: number;
  roll: number;
  modifier: number;
  total: number;
  outcome: string;
  timestamp: string;
  purpose?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: number;
  diceRoll?: DiceRollResult;
  audioUrl?: string;
  isAudioLoading?: boolean;
  suggestedActions?: string[];
  systemSync?: Partial<CharacterState>;
}

export type ThemeMode = 'dark' | 'white';

export interface ChatSessionArchive {
  id: string;
  name: string;
  world: string;
  characterState: CharacterState;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
  messageCount: number;
}

export interface GamePreset {
  id: string;
  title: string;
  world: string;
  worldDescription: string;
  name: string;
  race: string;
  gender: string;
  age: string;
  appearance: string;
  personality: string;
  lastWish: string;
  regretMemory: string;
  startingPower: string;
  icon: string;
  accentColor: string;
}
