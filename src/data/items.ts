import { CharacterItem, CharacterState, StudioBackground, GachaPoolItem } from '../types';

export const POSES = [
  { id: 0, name: 'Normal / Idle', icon: '🧍' },
  { id: 1, name: 'Saludo / Wave', icon: '👋' },
  { id: 2, name: 'Paz / Peace', icon: '✌️' },
  { id: 3, name: 'Confiado / Manos en caderas', icon: '😎' },
  { id: 4, name: 'Pose de Batalla', icon: '⚔️' },
  { id: 5, name: 'Tímido / Kawaii', icon: '🥺' },
];

export const EXPRESSIONS = [
  { id: 0, name: 'Feliz / Normal', emoji: '😊' },
  { id: 1, name: 'Ilusionado / Sparkly', emoji: '🤩' },
  { id: 2, name: 'Guiño / Pícaro', emoji: '😉' },
  { id: 3, name: 'Tsundere / Puchero', emoji: '😤' },
  { id: 4, name: 'Sorprendido', emoji: '😮' },
  { id: 5, name: 'Gatito / Smug :3', emoji: '😸' },
  { id: 6, name: 'Somnoliento / Zen', emoji: '😴' },
];

export const COLOR_PALETTES = {
  skin: ['#ffe4c4', '#ffdab9', '#fcd5b5', '#e8b89d', '#c68642', '#8d5524', '#4a2c11', '#fed7aa', '#fbcfe8'],
  hair: ['#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#334155', '#1e293b', '#f8fafc', '#d97706'],
  eyes: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#475569'],
  clothes: ['#3b82f6', '#ef4444', '#10b981', '#8b5cf6', '#ec4899', '#f59e0b', '#1e293b', '#475569', '#f8fafc', '#14b8a6'],
};

export const ALL_ITEMS: CharacterItem[] = [
  // Cabello Frontal
  { id: 'bangs-straight', name: 'Flequillo Recto', category: 'frontHair', rarity: 'common' },
  { id: 'bangs-soft', name: 'Flequillo Suave', category: 'frontHair', rarity: 'common' },
  { id: 'anime-spikes', name: 'Picos Anime Shonen', category: 'frontHair', rarity: 'rare' },

  // Cabello Trasero
  { id: 'short-bob', name: 'Corte Bob Corto', category: 'backHair', rarity: 'common' },
  { id: 'long-twin-tails', name: 'Coletas Dobles (Twin Tails)', category: 'backHair', rarity: 'rare' },
  { id: 'long-flowing', name: 'Cabello Largo Ondulado', category: 'backHair', rarity: 'rare' },
  { id: 'ponytail', name: 'Cola de Caballo Alta', category: 'backHair', rarity: 'common' },
  { id: 'spiky-anime', name: 'Cabello de Puntas Salvajes', category: 'backHair', rarity: 'epic' },

  // Ropa Superior (Top)
  { id: 'casual-tee', name: 'Camiseta Casual', category: 'top', rarity: 'common' },
  { id: 'hoodie', name: 'Sudadera Oversize', category: 'top', rarity: 'common' },
  { id: 'school-uniform', name: 'Uniforme Escolar Sailor', category: 'top', rarity: 'rare' },
  { id: 'magical-top', name: 'Top Mahou Shoujo Mágico', category: 'top', rarity: 'epic' },

  // Ropa Inferior (Bottom)
  { id: 'pants-regular', name: 'Pantalones Rectos', category: 'bottom', rarity: 'common' },
  { id: 'pleated-skirt', name: 'Falda de Pliegues', category: 'bottom', rarity: 'common' },
  { id: 'denim-shorts', name: 'Shorts de Mezclilla', category: 'bottom', rarity: 'common' },

  // Calzado (Shoes)
  { id: 'sneakers', name: 'Zapatillas Urbanas', category: 'shoes', rarity: 'common' },
  { id: 'mary-jane', name: 'Zapatos Escolares Mary Jane', category: 'shoes', rarity: 'common' },
  { id: 'boots', name: 'Botas de Aventura', category: 'shoes', rarity: 'rare' },

  // Accesorios de Cabeza
  { id: 'none', name: 'Ninguno', category: 'headAccessory', rarity: 'common' },
  { id: 'ribbon-bow', name: 'Lazo Coquette', category: 'headAccessory', rarity: 'common' },
  { id: 'cat-ears', name: 'Orejas Nekomimi', category: 'headAccessory', rarity: 'rare' },
  { id: 'devil-horns', name: 'Cuernos de Demonio', category: 'headAccessory', rarity: 'rare' },
  { id: 'angel-halo', name: 'Aureola Celestial', category: 'headAccessory', rarity: 'epic' },
  { id: 'star-crown', name: 'Corona de Estrellas Doradas', category: 'headAccessory', rarity: 'legendary' },

  // Accesorios de Mano
  { id: 'none', name: 'Ninguno', category: 'handAccessory', rarity: 'common' },
  { id: 'boba-drink', name: 'Té de Boba Dulce', category: 'handAccessory', rarity: 'rare' },
  { id: 'magic-wand', name: 'Varita Mágica Estelar', category: 'handAccessory', rarity: 'epic' },
  { id: 'pixel-sword', name: 'Katana Shonen', category: 'handAccessory', rarity: 'legendary' },
];

export const GACHA_POOL: GachaPoolItem[] = [
  // Comunes (60%)
  { item: { id: 'ribbon-bow', name: 'Lazo Coquette', category: 'headAccessory', rarity: 'common', description: 'Un lazo dulce y femenino' }, dropRate: 20 },
  { item: { id: 'casual-tee', name: 'Camiseta Casual', category: 'top', rarity: 'common', description: 'Cómoda para el día a día' }, dropRate: 20 },
  { item: { id: 'sneakers', name: 'Zapatillas Urbanas', category: 'shoes', rarity: 'common', description: 'Calzado deportivo ligero' }, dropRate: 20 },

  // Raros (25%)
  { item: { id: 'cat-ears', name: 'Orejas Nekomimi', category: 'headAccessory', rarity: 'rare', description: 'Tiernas orejitas de gato con movimiento' }, dropRate: 8 },
  { item: { id: 'devil-horns', name: 'Cuernos de Demonio', category: 'headAccessory', rarity: 'rare', description: 'Pequeños cuernos traviesos' }, dropRate: 8 },
  { item: { id: 'boba-drink', name: 'Té de Boba Dulce', category: 'handAccessory', rarity: 'rare', description: 'Bebida helada con perlas de tapioca' }, dropRate: 9 },

  // Épicos (12%)
  { item: { id: 'angel-halo', name: 'Aureola Celestial', category: 'headAccessory', rarity: 'epic', description: 'Aureola dorada que irradia pureza' }, dropRate: 4 },
  { item: { id: 'magical-top', name: 'Top Mahou Shoujo', category: 'top', rarity: 'epic', description: 'Uniforme de chica mágica con gema' }, dropRate: 4 },
  { item: { id: 'magic-wand', name: 'Varita Mágica Estelar', category: 'handAccessory', rarity: 'epic', description: 'Canaliza hechizos luminosos' }, dropRate: 4 },

  // Legendarios (3%)
  { item: { id: 'star-crown', name: 'Corona de Estrellas Doradas', category: 'headAccessory', rarity: 'legendary', description: 'Corona real forjada con polvo estelar' }, dropRate: 1.5 },
  { item: { id: 'pixel-sword', name: 'Katana Shonen', category: 'handAccessory', rarity: 'legendary', description: 'Filo legendario imbuido en energía' }, dropRate: 1.5 },
];

export const STUDIO_BACKGROUNDS: StudioBackground[] = [
  {
    id: 'classroom',
    name: 'Aula de Clases Anime',
    type: 'css',
    preview: 'linear-gradient(to bottom, #93c5fd, #bfdbfe 45%, #fed7aa 46%, #d97706 70%, #78350f 100%)',
    description: 'Típica clase japonesa con luz solar de tarde y suelo de madera.',
  },
  {
    id: 'sakura-park',
    name: 'Parque Sakura en Flor',
    type: 'css',
    preview: 'linear-gradient(to bottom, #fbcfe8, #f472b6 40%, #86efac 65%, #15803d 100%)',
    description: 'Sendero primaveral bordeado por cerezos rosas y césped suave.',
  },
  {
    id: 'sunset-rooftop',
    name: 'Azotea al Atardecer',
    type: 'css',
    preview: 'linear-gradient(to bottom, #4c1d95, #c026d3 35%, #f97316 65%, #fef08a 85%, #334155 86%, #1e293b 100%)',
    description: 'El clásico horizonte crepuscular sobre los rascacielos.',
  },
  {
    id: 'fantasy-castle',
    name: 'Salón del Trono Mágico',
    type: 'css',
    preview: 'linear-gradient(to bottom, #1e1b4b, #312e81 40%, #4338ca 70%, #1e1b4b 71%, #0f172a 100%)',
    description: 'Arquitectura mística con vitrales y alfombra real púrpura.',
  },
  {
    id: 'cyberpunk-alley',
    name: 'Callejón Neón Cyberpunk',
    type: 'css',
    preview: 'linear-gradient(to bottom, #030712, #111827 40%, #06b6d4 41%, #083344 70%, #020617 100%)',
    description: 'Luces de neón turquesa y violeta reflejadas en el asfalto mojado.',
  },
  {
    id: 'kawaii-room',
    name: 'Habitación Pastel Gamer',
    type: 'css',
    preview: 'linear-gradient(to bottom, #fce7f3, #e0e7ff 50%, #fef3c7 51%, #fbcfe8 100%)',
    description: 'Dormitorio estético con tonos pastel suaves.',
  },
];

export const DEFAULT_CHARACTERS: CharacterState[] = [
  {
    id: 'char-luna',
    name: 'Luna 🌙',
    pose: 1, // Waving
    expression: 1, // Sparkly
    skinColor: '#ffdab9',
    eyeColor: '#8b5cf6',
    hairColor: '#ec4899',
    topColor: '#8b5cf6',
    bottomColor: '#f43f5e',
    shoesColor: '#1e293b',
    accessoryColor: '#fbbf24',
    blushIntensity: 0.6,
    selectedItems: {
      eyes: 'sparkle-anime',
      frontHair: 'bangs-straight',
      backHair: 'long-twin-tails',
      top: 'school-uniform',
      bottom: 'pleated-skirt',
      shoes: 'mary-jane',
      headAccessory: 'cat-ears',
      handAccessory: 'boba-drink',
    },
  },
  {
    id: 'char-ren',
    name: 'Ren ⚡',
    pose: 2, // Peace
    expression: 2, // Wink
    skinColor: '#fcd5b5',
    eyeColor: '#3b82f6',
    hairColor: '#06b6d4',
    topColor: '#3b82f6',
    bottomColor: '#1e293b',
    shoesColor: '#f8fafc',
    accessoryColor: '#f59e0b',
    blushIntensity: 0.4,
    selectedItems: {
      eyes: 'sparkle-anime',
      frontHair: 'anime-spikes',
      backHair: 'spiky-anime',
      top: 'hoodie',
      bottom: 'pants-regular',
      shoes: 'sneakers',
      headAccessory: 'devil-horns',
      handAccessory: 'pixel-sword',
    },
  },
];
