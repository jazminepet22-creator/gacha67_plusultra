export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary';

export type LayerCategory =
  | 'body'
  | 'eyes'
  | 'mouth'
  | 'frontHair'
  | 'backHair'
  | 'top'
  | 'bottom'
  | 'shoes'
  | 'headAccessory'
  | 'handAccessory'
  | 'extra';

export interface CustomColorConfig {
  primary: string;
  secondary?: string;
  highlight?: string;
}

export interface CharacterItem {
  id: string;
  name: string;
  category: LayerCategory;
  rarity: ItemRarity;
  previewIcon?: string;
  // If spriteUrl is provided, canvas will render sprite; otherwise uses procedural canvas vector
  spriteUrl?: string;
  // Optional offset or sprite slice info
  spriteRect?: { x: number; y: number; w: number; h: number };
  defaultColor?: string;
  description?: string;
}

export interface CharacterState {
  id: string;
  name: string;
  pose: number; // 0 to 5
  expression: number; // 0 to 6
  skinColor: string;
  eyeColor: string;
  hairColor: string;
  topColor: string;
  bottomColor: string;
  shoesColor: string;
  accessoryColor: string;
  blushIntensity: number; // 0 to 1
  selectedItems: {
    eyes: string;
    frontHair: string;
    backHair: string;
    top: string;
    bottom: string;
    shoes: string;
    headAccessory: string;
    handAccessory: string;
  };
}

export interface DialogueBubble {
  text: string;
  speakerName?: string;
  style: 'speech' | 'thought' | 'shout' | 'whisper';
  position: 'top' | 'top-left' | 'top-right';
}

export interface SceneActor {
  instanceId: string;
  character: CharacterState;
  x: number; // Percentage 0 - 100 or px
  y: number;
  scale: number; // 0.5 to 2.0
  flipped: boolean;
  zIndex: number;
  dialogue?: DialogueBubble;
}

export interface StudioBackground {
  id: string;
  name: string;
  type: 'css' | 'image';
  preview: string; // CSS gradient or image URL
  description: string;
}

export interface GachaPoolItem {
  item: CharacterItem;
  dropRate: number; // Weight
}
