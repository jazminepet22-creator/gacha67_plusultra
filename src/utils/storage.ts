import { CharacterState } from '../types';
import { DEFAULT_CHARACTERS, ALL_ITEMS } from '../data/items';

const INVENTORY_KEY = 'gacha_studio_inventory_v1';
const GEMS_KEY = 'gacha_studio_gems_v1';
const CHARACTERS_KEY = 'gacha_studio_characters_v1';

// Todos los ítems comunes vienen desbloqueados por defecto
export function getInitialUnlockedItems(): string[] {
  try {
    const saved = localStorage.getItem(INVENTORY_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error loading inventory:', e);
  }

  // Pre-desbloqueados: todos los comunes y algunos básicos
  const defaultUnlocked = ALL_ITEMS
    .filter((item) => item.rarity === 'common' || item.id === 'cat-ears')
    .map((item) => item.id);

  try {
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(defaultUnlocked));
  } catch {
    // Ignored
  }
  return defaultUnlocked;
}

export function saveUnlockedItems(items: string[]) {
  try {
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving inventory:', e);
  }
}

export function getSavedGems(): number {
  try {
    const saved = localStorage.getItem(GEMS_KEY);
    if (saved !== null) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Error loading gems:', e);
  }
  return 1000; // Monedas iniciales de bienvenida
}

export function saveGems(gems: number) {
  try {
    localStorage.setItem(GEMS_KEY, gems.toString());
  } catch (e) {
    console.error('Error saving gems:', e);
  }
}

export function getSavedCharacters(): CharacterState[] {
  try {
    const saved = localStorage.getItem(CHARACTERS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error loading characters:', e);
  }
  return DEFAULT_CHARACTERS;
}

export function saveCharacters(characters: CharacterState[]) {
  try {
    localStorage.setItem(CHARACTERS_KEY, JSON.stringify(characters));
  } catch (e) {
    console.error('Error saving characters:', e);
  }
}
