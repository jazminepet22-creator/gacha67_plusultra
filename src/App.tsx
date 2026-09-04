import React, { useState, useEffect } from 'react';
import { CharacterState, SceneActor, CharacterItem } from './types';
import {
  getInitialUnlockedItems,
  saveUnlockedItems,
  getSavedGems,
  saveGems,
  getSavedCharacters,
  saveCharacters,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { CharacterCreator } from './components/CharacterCreator';
import { StudioMode } from './components/StudioMode';
import { GachaModal } from './components/GachaModal';
import { InventoryView } from './components/InventoryView';
import { SpriteGuideModal } from './components/SpriteGuideModal';
import { DEFAULT_CHARACTERS } from './data/items';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'creator' | 'studio' | 'gacha' | 'inventory' | 'guide'
  >('creator');

  // Estado del monedero de gemas
  const [gems, setGems] = useState<number>(() => getSavedGems());

  // Estado del inventario desbloqueado
  const [unlockedItemIds, setUnlockedItemIds] = useState<string[]>(() =>
    getInitialUnlockedItems()
  );

  // Lista de personajes guardados
  const [characters, setCharacters] = useState<CharacterState[]>(() =>
    getSavedCharacters()
  );

  // ID del personaje activo en el creador
  const [activeCharId, setActiveCharId] = useState<string>(
    () => characters[0]?.id || DEFAULT_CHARACTERS[0].id
  );

  // Actores colocados en el escenario de Modo Estudio
  const [actors, setActors] = useState<SceneActor[]>(() => [
    {
      instanceId: 'actor-init-1',
      character: characters[0] || DEFAULT_CHARACTERS[0],
      x: 35,
      y: 78,
      scale: 1.0,
      flipped: false,
      zIndex: 1,
      dialogue: {
        text: '¡Bienvenidos a Gacha Studio! ✨',
        speakerName: characters[0]?.name || 'Luna',
        style: 'speech',
        position: 'top',
      },
    },
    {
      instanceId: 'actor-init-2',
      character: characters[1] || DEFAULT_CHARACTERS[1],
      x: 65,
      y: 78,
      scale: 1.0,
      flipped: true,
      zIndex: 2,
      dialogue: {
        text: '¡Prueba a arrastrarnos o cambiar nuestro diálogo! 🎮',
        speakerName: characters[1]?.name || 'Ren',
        style: 'thought',
        position: 'top',
      },
    },
  ]);

  const [selectedActorId, setSelectedActorId] = useState<string | null>(
    'actor-init-1'
  );

  // Guardar gemas en localStorage al cambiar
  useEffect(() => {
    saveGems(gems);
  }, [gems]);

  // Guardar inventario en localStorage al cambiar
  useEffect(() => {
    saveUnlockedItems(unlockedItemIds);
  }, [unlockedItemIds]);

  // Guardar personajes en localStorage al cambiar
  useEffect(() => {
    saveCharacters(characters);
  }, [characters]);

  // Personaje activo actualmente en el editor
  const currentCharacter =
    characters.find((c) => c.id === activeCharId) ||
    characters[0] ||
    DEFAULT_CHARACTERS[0];

  // Actualizador del personaje activo
  const handleUpdateCharacter = (
    updater: (prev: CharacterState) => CharacterState
  ) => {
    setCharacters((prev) =>
      prev.map((c) => (c.id === currentCharacter.id ? updater(c) : c))
    );
  };

  // Crear un nuevo slot de personaje
  const handleCreateNewCharacter = () => {
    const newId = `char-${Date.now()}`;
    const newChar: CharacterState = {
      ...DEFAULT_CHARACTERS[0],
      id: newId,
      name: `Personaje ${characters.length + 1}`,
      hairColor: '#3b82f6',
      topColor: '#10b981',
      pose: 0,
      expression: 0,
    };
    setCharacters((prev) => [...prev, newChar]);
    setActiveCharId(newId);
  };

  // Enviar personaje al modo estudio
  const handleSendToStudio = (char: CharacterState) => {
    const newActor: SceneActor = {
      instanceId: `actor-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      character: { ...char },
      x: 40 + (Math.random() * 20 - 10),
      y: 78,
      scale: 1.0,
      flipped: false,
      zIndex: actors.length + 1,
      dialogue: {
        text: `¡Hola, soy ${char.name}! ✨`,
        speakerName: char.name,
        style: 'speech',
        position: 'top',
      },
    };
    setActors((prev) => [...prev, newActor]);
    setSelectedActorId(newActor.instanceId);
    setActiveTab('studio');
  };

  // Deducir gemas (para gacha)
  const handleDeductGems = (amount: number): boolean => {
    if (gems < amount) return false;
    setGems((prev) => prev - amount);
    return true;
  };

  // Añadir gemas
  const handleAddGems = (amount: number) => {
    setGems((prev) => prev + amount);
  };

  // Desbloquear ítem de gacha
  const handleUnlockItem = (item: CharacterItem) => {
    setUnlockedItemIds((prev) => {
      if (prev.includes(item.id)) return prev;
      return [...prev, item.id];
    });
  };

  return (
    <div className="min-h-screen bg-pink-50 text-slate-800 flex flex-col selection:bg-pink-400 selection:text-white bg-[radial-gradient(#f472b6_1.2px,transparent_1.2px)] [background-size:24px_24px]">
      {/* Barra de Navegación Superior */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        gems={gems}
        onAddGems={handleAddGems}
      />

      {/* Contenido Principal según Pestaña Activa */}
      <main className="flex-1 pb-16">
        {activeTab === 'creator' && (
          <CharacterCreator
            character={currentCharacter}
            unlockedItemIds={unlockedItemIds}
            onUpdateCharacter={handleUpdateCharacter}
            onSendToStudio={handleSendToStudio}
            onOpenGacha={() => setActiveTab('gacha')}
            allCharacters={characters}
            onSelectCharacter={(id) => setActiveCharId(id)}
            onCreateNewCharacter={handleCreateNewCharacter}
          />
        )}

        {activeTab === 'studio' && (
          <StudioMode
            availableCharacters={characters}
            actors={actors}
            onUpdateActors={setActors}
            selectedActorId={selectedActorId}
            onSelectActor={setSelectedActorId}
          />
        )}

        {activeTab === 'gacha' && (
          <GachaModal
            gems={gems}
            unlockedItemIds={unlockedItemIds}
            onDeductGems={handleDeductGems}
            onUnlockItem={handleUnlockItem}
            onAddGems={handleAddGems}
            onGoToCreator={() => setActiveTab('creator')}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryView
            unlockedItemIds={unlockedItemIds}
            onOpenGacha={() => setActiveTab('gacha')}
            onGoToCreator={() => setActiveTab('creator')}
          />
        )}

        {activeTab === 'guide' && <SpriteGuideModal />}
      </main>

      {/* Footer estilizado con tema Vibrant Palette */}
      <footer className="border-t-4 border-pink-200 bg-white/95 backdrop-blur-md py-4 text-center text-xs font-bold text-pink-700/80 shadow-[0_-4px_10px_rgba(244,114,182,0.08)]">
        <p>
          GACHA CREATOR PRO • Motor de Capas 2D & Escenarios Chibi • Guardado Local y Tintado Hex Dinámico
        </p>
      </footer>
    </div>
  );
}
