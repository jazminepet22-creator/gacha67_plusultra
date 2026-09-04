import React, { useRef, useEffect, useState } from 'react';
import { CharacterState } from '../types';
import { POSES, EXPRESSIONS, ALL_ITEMS, COLOR_PALETTES } from '../data/items';
import { renderCharacterToCanvas } from '../engine/renderer2D';
import { playClickSound, playSparkleSound } from '../utils/audio';
import {
  Download,
  Shuffle,
  RotateCcw,
  Sparkles,
  Lock,
  Shirt,
  Smile,
  Scissors,
  Crown,
  Footprints,
  Maximize2,
  Check,
  Clapperboard,
} from 'lucide-react';

interface CharacterCreatorProps {
  character: CharacterState;
  unlockedItemIds: string[];
  onUpdateCharacter: (updater: (prev: CharacterState) => CharacterState) => void;
  onSendToStudio: (char: CharacterState) => void;
  onOpenGacha: () => void;
  allCharacters: CharacterState[];
  onSelectCharacter: (charId: string) => void;
  onCreateNewCharacter: () => void;
}

type SubTab = 'hair' | 'face' | 'clothes' | 'shoes' | 'accessories' | 'poses';

export const CharacterCreator: React.FC<CharacterCreatorProps> = ({
  character,
  unlockedItemIds,
  onUpdateCharacter,
  onSendToStudio,
  onOpenGacha,
  allCharacters,
  onSelectCharacter,
  onCreateNewCharacter,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('clothes');
  const [flipped, setFlipped] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Redibujar el avatar cada vez que cambie el personaje o la orientación
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    renderCharacterToCanvas(ctx, character, {
      width: canvas.width,
      height: canvas.height,
      flip: flipped,
      scale: 1.05,
      showShadow: true,
    });
  }, [character, flipped]);

  // Manejo de cambio de ítem
  const handleSelectItem = (
    category: keyof CharacterState['selectedItems'],
    itemId: string
  ) => {
    const isUnlocked = unlockedItemIds.includes(itemId) || itemId === 'none';
    if (!isUnlocked) {
      playClickSound();
      onOpenGacha();
      return;
    }

    playClickSound();
    onUpdateCharacter((prev) => ({
      ...prev,
      selectedItems: {
        ...prev.selectedItems,
        [category]: itemId,
      },
    }));
  };

  // Manejo de cambio de color
  const handleColorChange = (key: keyof CharacterState, color: string) => {
    onUpdateCharacter((prev) => ({
      ...prev,
      [key]: color,
    }));
  };

  // Randomizador completo de personaje
  const handleRandomize = () => {
    playSparkleSound();
    const availableItems = ALL_ITEMS.filter(
      (item) => unlockedItemIds.includes(item.id) || item.rarity === 'common'
    );

    const getRandom = (cat: string, def: string) => {
      const filtered = availableItems.filter((i) => i.category === cat);
      if (!filtered.length) return def;
      return filtered[Math.floor(Math.random() * filtered.length)].id;
    };

    const getRandomColor = (palette: string[]) =>
      palette[Math.floor(Math.random() * palette.length)];

    onUpdateCharacter((prev) => ({
      ...prev,
      pose: Math.floor(Math.random() * POSES.length),
      expression: Math.floor(Math.random() * EXPRESSIONS.length),
      skinColor: getRandomColor(COLOR_PALETTES.skin),
      hairColor: getRandomColor(COLOR_PALETTES.hair),
      eyeColor: getRandomColor(COLOR_PALETTES.eyes),
      topColor: getRandomColor(COLOR_PALETTES.clothes),
      bottomColor: getRandomColor(COLOR_PALETTES.clothes),
      shoesColor: getRandomColor(COLOR_PALETTES.clothes),
      accessoryColor: getRandomColor(COLOR_PALETTES.hair),
      selectedItems: {
        eyes: 'sparkle-anime',
        frontHair: getRandom('frontHair', 'bangs-straight'),
        backHair: getRandom('backHair', 'short-bob'),
        top: getRandom('top', 'casual-tee'),
        bottom: getRandom('bottom', 'pleated-skirt'),
        shoes: getRandom('shoes', 'sneakers'),
        headAccessory: getRandom('headAccessory', 'none'),
        handAccessory: getRandom('handAccessory', 'none'),
      },
    }));
  };

  // Descargar Avatar en PNG de alta resolución
  const handleDownloadPNG = () => {
    playSparkleSound();
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Crear canvas temporal para exportar a 2x de resolución
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 720;
    exportCanvas.height = 840;
    const exportCtx = exportCanvas.getContext('2d');
    if (exportCtx) {
      renderCharacterToCanvas(exportCtx, character, {
        width: exportCanvas.width,
        height: exportCanvas.height,
        flip: flipped,
        scale: 2.1,
        showShadow: true,
      });

      const link = document.createElement('a');
      link.download = `${character.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_avatar.png`;
      link.href = exportCanvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Selector de personaje activo / Slot */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6 bg-white p-3.5 rounded-2xl border-4 border-pink-200 shadow-md">
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <span className="text-xs font-black uppercase tracking-wider text-pink-500 mr-1">
            Personajes:
          </span>
          {allCharacters.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                playClickSound();
                onSelectCharacter(c.id);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all whitespace-nowrap flex items-center gap-1.5 active:translate-y-0.5 ${
                c.id === character.id
                  ? 'bg-pink-500 text-white shadow-md border-b-4 border-pink-700'
                  : 'bg-pink-50 text-pink-700 hover:bg-pink-100 border-2 border-pink-200'
              }`}
            >
              <span>{c.name}</span>
            </button>
          ))}
          <button
            onClick={() => {
              playSparkleSound();
              onCreateNewCharacter();
            }}
            className="px-3.5 py-1.5 rounded-xl text-xs font-black border-2 border-dashed border-pink-400 text-pink-600 bg-pink-50/60 hover:bg-pink-100 transition-colors"
          >
            + Nuevo
          </button>
        </div>

        {/* Renombrar avatar */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-black uppercase text-pink-600">Nombre:</label>
          <input
            type="text"
            value={character.name}
            onChange={(e) =>
              onUpdateCharacter((prev) => ({ ...prev, name: e.target.value }))
            }
            className="bg-pink-50 border-2 border-pink-200 rounded-xl px-3 py-1 text-sm font-bold text-pink-700 focus:border-pink-500 focus:bg-white outline-none w-36 shadow-inner"
          />
        </div>
      </div>

      {/* Grid Principal: Canvas Izquierda + Panel de Personalización Derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* COLUMNA 1: VISTA PREVIA EN CANVAS */}
        <div className="lg:col-span-5 flex flex-col items-center bg-white rounded-3xl p-5 border-4 border-pink-200 shadow-xl sticky top-20">
          {/* Burbuja de diálogo de muestra estilo Gacha */}
          <div className="relative mb-3 bg-white px-5 py-2 rounded-2xl shadow-md border-2 border-pink-200 flex items-center gap-1.5">
            <p className="text-xs font-bold text-pink-600">&quot;¡Listo para el escenario! ✨&quot;</p>
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white absolute -bottom-2 left-1/2 -translate-x-1/2 drop-shadow-sm" />
          </div>

          <div className="relative w-full aspect-[6/7] max-w-[340px] rounded-2xl overflow-hidden bg-gradient-to-b from-pink-100/70 via-slate-50 to-pink-50 border-4 border-pink-200 shadow-inner flex items-center justify-center">
            {/* Canvas Principal */}
            <canvas
              ref={canvasRef}
              width={360}
              height={420}
              className="w-full h-full object-contain"
            />

            {/* Badge de Pose & Expresión activa */}
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border-2 border-pink-200 text-xs font-black text-pink-600 flex items-center gap-1.5 shadow-sm">
              <span>{POSES[character.pose]?.icon}</span>
              <span>{EXPRESSIONS[character.expression]?.emoji}</span>
            </div>

            {/* Botón de voltear horizontal (Flip) */}
            <button
              onClick={() => {
                playClickSound();
                setFlipped((prev) => !prev);
              }}
              title="Voltear personaje"
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white border-2 border-pink-200 hover:bg-pink-50 text-pink-600 flex items-center justify-center transition-transform active:scale-90 shadow-sm"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Botones de acción rápida */}
          <div className="w-full grid grid-cols-2 gap-2.5 mt-4 max-w-[340px]">
            <button
              onClick={handleRandomize}
              className="flex items-center justify-center gap-1.5 bg-white hover:bg-pink-50 text-pink-600 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black transition-all active:translate-y-0.5 border-2 border-pink-200 shadow-sm"
            >
              <Shuffle className="w-4 h-4 text-amber-500" />
              <span>Aleatorio</span>
            </button>

            <button
              onClick={handleDownloadPNG}
              className="flex items-center justify-center gap-1.5 bg-pink-500 hover:bg-pink-400 text-white py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black shadow-md border-b-4 border-pink-700 active:border-b-0 active:translate-y-1 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Exportar PNG</span>
            </button>
          </div>

          {/* Botón para enviar personaje al Modo Estudio */}
          <button
            onClick={() => {
              playSparkleSound();
              onSendToStudio(character);
            }}
            className="w-full max-w-[340px] mt-2.5 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-purple-500/20 border-b-4 border-purple-700 active:border-b-0 active:translate-y-1 transition-all"
          >
            <Clapperboard className="w-4 h-4" />
            <span>Colocar en el Modo Estudio 🎬</span>
          </button>
        </div>

        {/* COLUMNA 2: PANELES DE PERSONALIZACIÓN Y PALETAS */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border-4 border-pink-200 shadow-xl flex flex-col gap-5">
          {/* Selector de sub-pestañas */}
          <div className="flex items-center gap-1 bg-pink-100/80 p-1.5 rounded-2xl border-2 border-pink-200 overflow-x-auto">
            <button
              onClick={() => {
                playClickSound();
                setActiveSubTab('clothes');
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap active:translate-y-0.5 ${
                activeSubTab === 'clothes'
                  ? 'bg-pink-500 text-white shadow border-b-4 border-pink-700'
                  : 'text-pink-600 hover:bg-white/80'
              }`}
            >
              <Shirt className="w-3.5 h-3.5" />
              <span>Ropa</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                setActiveSubTab('hair');
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap active:translate-y-0.5 ${
                activeSubTab === 'hair'
                  ? 'bg-pink-500 text-white shadow border-b-4 border-pink-700'
                  : 'text-pink-600 hover:bg-white/80'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Cabello</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                setActiveSubTab('face');
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap active:translate-y-0.5 ${
                activeSubTab === 'face'
                  ? 'bg-pink-500 text-white shadow border-b-4 border-pink-700'
                  : 'text-pink-600 hover:bg-white/80'
              }`}
            >
              <Smile className="w-3.5 h-3.5" />
              <span>Rostro & Ojos</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                setActiveSubTab('shoes');
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap active:translate-y-0.5 ${
                activeSubTab === 'shoes'
                  ? 'bg-pink-500 text-white shadow border-b-4 border-pink-700'
                  : 'text-pink-600 hover:bg-white/80'
              }`}
            >
              <Footprints className="w-3.5 h-3.5" />
              <span>Calzado</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                setActiveSubTab('accessories');
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap active:translate-y-0.5 ${
                activeSubTab === 'accessories'
                  ? 'bg-pink-500 text-white shadow border-b-4 border-pink-700'
                  : 'text-pink-600 hover:bg-white/80'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Accesorios</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                setActiveSubTab('poses');
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap active:translate-y-0.5 ${
                activeSubTab === 'poses'
                  ? 'bg-pink-500 text-white shadow border-b-4 border-pink-700'
                  : 'text-pink-600 hover:bg-white/80'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Poses</span>
            </button>
          </div>

          {/* CONTENIDO DE LA PESTAÑA SELECCIONADA */}

          {/* 1. ROPA (SUPERIOR E INFERIOR) */}
          {activeSubTab === 'clothes' && (
            <div className="flex flex-col gap-5">
              {/* Ropa Superior */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-pink-600">
                    Prenda Superior (Top)
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Color Top:</span>
                    <input
                      type="color"
                      value={character.topColor}
                      onChange={(e) => handleColorChange('topColor', e.target.value)}
                      className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {ALL_ITEMS.filter((i) => i.category === 'top').map((item) => {
                    const isUnlocked = unlockedItemIds.includes(item.id);
                    const isSelected = character.selectedItems.top === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectItem('top', item.id)}
                        className={`p-3 rounded-2xl border-2 text-left flex flex-col justify-between h-20 transition-all ${
                          isSelected
                            ? 'bg-pink-100 border-pink-500 text-pink-900 ring-2 ring-pink-400 shadow-sm'
                            : 'bg-pink-50/50 border-pink-200 text-slate-700 hover:border-pink-300 hover:bg-pink-100/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black truncate">
                            {item.name}
                          </span>
                          {!isUnlocked && (
                            <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          )}
                        </div>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full self-start capitalize ${
                            item.rarity === 'epic'
                              ? 'bg-purple-100 text-purple-700 border border-purple-300'
                              : item.rarity === 'rare'
                              ? 'bg-sky-100 text-sky-700 border border-sky-300'
                              : 'bg-white text-slate-600 border border-slate-200'
                          }`}
                        >
                          {item.rarity}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ropa Inferior */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-pink-600">
                    Prenda Inferior (Bottom)
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Color Bottom:</span>
                    <input
                      type="color"
                      value={character.bottomColor}
                      onChange={(e) =>
                        handleColorChange('bottomColor', e.target.value)
                      }
                      className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {ALL_ITEMS.filter((i) => i.category === 'bottom').map((item) => {
                    const isUnlocked = unlockedItemIds.includes(item.id);
                    const isSelected = character.selectedItems.bottom === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectItem('bottom', item.id)}
                        className={`p-3 rounded-2xl border-2 text-left flex flex-col justify-between h-20 transition-all ${
                          isSelected
                            ? 'bg-pink-100 border-pink-500 text-pink-900 ring-2 ring-pink-400 shadow-sm'
                            : 'bg-pink-50/50 border-pink-200 text-slate-700 hover:border-pink-300 hover:bg-pink-100/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black truncate">
                            {item.name}
                          </span>
                          {!isUnlocked && (
                            <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 font-black uppercase">
                          {item.rarity}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Paleta rápida para ropa */}
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-pink-600 mb-2 block">
                  Paleta de Colores Rápida:
                </span>
                <div className="flex flex-wrap gap-2">
                  {COLOR_PALETTES.clothes.map((col) => (
                    <button
                      key={col}
                      onClick={() => {
                        playClickSound();
                        handleColorChange('topColor', col);
                      }}
                      style={{ backgroundColor: col }}
                      className="w-7 h-7 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform active:scale-95"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. CABELLO (FLEQUILLO Y POSTERIOR) */}
          {activeSubTab === 'hair' && (
            <div className="flex flex-col gap-5">
              {/* Color de Cabello */}
              <div className="flex items-center justify-between bg-pink-50/70 p-3 rounded-2xl border-2 border-pink-200">
                <span className="text-xs font-black uppercase tracking-wider text-pink-600">
                  Tinte de Cabello Dinámico:
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={character.hairColor}
                    onChange={(e) => handleColorChange('hairColor', e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none"
                  />
                  <span className="font-mono text-xs text-pink-700 font-black uppercase">
                    {character.hairColor}
                  </span>
                </div>
              </div>

              {/* Paleta de Tinte */}
              <div className="flex flex-wrap gap-2">
                {COLOR_PALETTES.hair.map((col) => (
                  <button
                    key={col}
                    onClick={() => {
                      playClickSound();
                      handleColorChange('hairColor', col);
                    }}
                    style={{ backgroundColor: col }}
                    className="w-8 h-8 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform"
                  />
                ))}
              </div>

              {/* Flequillo Frontal */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-pink-600 mb-2">
                  Flequillo Frontal (Front Hair)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {ALL_ITEMS.filter((i) => i.category === 'frontHair').map((item) => {
                    const isUnlocked = unlockedItemIds.includes(item.id);
                    const isSelected = character.selectedItems.frontHair === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectItem('frontHair', item.id)}
                        className={`p-3 rounded-2xl border-2 text-left flex flex-col justify-between h-20 transition-all ${
                          isSelected
                            ? 'bg-pink-100 border-pink-500 text-pink-900 ring-2 ring-pink-400 shadow-sm'
                            : 'bg-pink-50/50 border-pink-200 text-slate-700 hover:border-pink-300 hover:bg-pink-100/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black truncate">
                            {item.name}
                          </span>
                          {!isUnlocked && (
                            <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 font-black uppercase">
                          {item.rarity}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cabello Posterior */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-pink-600 mb-2">
                  Cabello Posterior (Back Hair)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {ALL_ITEMS.filter((i) => i.category === 'backHair').map((item) => {
                    const isUnlocked = unlockedItemIds.includes(item.id);
                    const isSelected = character.selectedItems.backHair === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectItem('backHair', item.id)}
                        className={`p-3 rounded-2xl border-2 text-left flex flex-col justify-between h-20 transition-all ${
                          isSelected
                            ? 'bg-pink-100 border-pink-500 text-pink-900 ring-2 ring-pink-400 shadow-sm'
                            : 'bg-pink-50/50 border-pink-200 text-slate-700 hover:border-pink-300 hover:bg-pink-100/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black truncate">
                            {item.name}
                          </span>
                          {!isUnlocked && (
                            <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          )}
                        </div>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full self-start capitalize ${
                            item.rarity === 'epic'
                              ? 'bg-purple-100 text-purple-700 border border-purple-300'
                              : item.rarity === 'rare'
                              ? 'bg-sky-100 text-sky-700 border border-sky-300'
                              : 'bg-white text-slate-600 border border-slate-200'
                          }`}
                        >
                          {item.rarity}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 3. ROSTRO, OJOS Y EXPRESIÓN */}
          {activeSubTab === 'face' && (
            <div className="flex flex-col gap-5">
              {/* Selector de Expresión */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-pink-600 mb-2">
                  Expresiones Faciales
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {EXPRESSIONS.map((expr) => {
                    const isSelected = character.expression === expr.id;
                    return (
                      <button
                        key={expr.id}
                        onClick={() => {
                          playClickSound();
                          onUpdateCharacter((prev) => ({
                            ...prev,
                            expression: expr.id,
                          }));
                        }}
                        className={`p-3 rounded-2xl border-2 text-center flex flex-col items-center justify-center gap-1 transition-all ${
                          isSelected
                            ? 'bg-pink-100 border-pink-500 text-pink-900 ring-2 ring-pink-400 shadow-sm'
                            : 'bg-pink-50/50 border-pink-200 text-slate-700 hover:border-pink-300 hover:bg-pink-100/50'
                        }`}
                      >
                        <span className="text-2xl">{expr.emoji}</span>
                        <span className="text-xs font-black">{expr.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Colores de Ojos y Piel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Ojos */}
                <div className="bg-pink-50/70 p-3.5 rounded-2xl border-2 border-pink-200 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-pink-600">
                      Color de Iris / Ojos:
                    </span>
                    <input
                      type="color"
                      value={character.eyeColor}
                      onChange={(e) => handleColorChange('eyeColor', e.target.value)}
                      className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-none"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {COLOR_PALETTES.eyes.map((col) => (
                      <button
                        key={col}
                        onClick={() => {
                          playClickSound();
                          handleColorChange('eyeColor', col);
                        }}
                        style={{ backgroundColor: col }}
                        className="w-6 h-6 rounded-full border border-white shadow-sm hover:scale-110 transition-transform"
                      />
                    ))}
                  </div>
                </div>

                {/* Tono de Piel */}
                <div className="bg-pink-50/70 p-3.5 rounded-2xl border-2 border-pink-200 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-pink-600">
                      Tono de Piel:
                    </span>
                    <input
                      type="color"
                      value={character.skinColor}
                      onChange={(e) => handleColorChange('skinColor', e.target.value)}
                      className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-none"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {COLOR_PALETTES.skin.map((col) => (
                      <button
                        key={col}
                        onClick={() => {
                          playClickSound();
                          handleColorChange('skinColor', col);
                        }}
                        style={{ backgroundColor: col }}
                        className="w-6 h-6 rounded-full border border-white shadow-sm hover:scale-110 transition-transform"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Nivel de Rubor (Blush Slider) */}
              <div className="bg-pink-50/70 p-3.5 rounded-2xl border-2 border-pink-200 flex items-center justify-between">
                <span className="text-xs font-black uppercase text-pink-600">
                  Intensidad del Rubor (Blush):
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={character.blushIntensity}
                  onChange={(e) =>
                    onUpdateCharacter((prev) => ({
                      ...prev,
                      blushIntensity: parseFloat(e.target.value),
                    }))
                  }
                  className="w-36 accent-pink-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* 4. CALZADO */}
          {activeSubTab === 'shoes' && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-pink-600">
                  Calzado
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Color Calzado:</span>
                  <input
                    type="color"
                    value={character.shoesColor}
                    onChange={(e) => handleColorChange('shoesColor', e.target.value)}
                    className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {ALL_ITEMS.filter((i) => i.category === 'shoes').map((item) => {
                  const isUnlocked = unlockedItemIds.includes(item.id);
                  const isSelected = character.selectedItems.shoes === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectItem('shoes', item.id)}
                      className={`p-3 rounded-2xl border-2 text-left flex flex-col justify-between h-20 transition-all ${
                        isSelected
                          ? 'bg-pink-100 border-pink-500 text-pink-900 ring-2 ring-pink-400 shadow-sm'
                          : 'bg-pink-50/50 border-pink-200 text-slate-700 hover:border-pink-300 hover:bg-pink-100/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black truncate">
                          {item.name}
                        </span>
                        {!isUnlocked && (
                          <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 font-black uppercase">
                        {item.rarity}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. ACCESORIOS (CABEZA Y MANO) */}
          {activeSubTab === 'accessories' && (
            <div className="flex flex-col gap-5">
              {/* Accesorios de Cabeza */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-pink-600">
                    Accesorio de Cabeza
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Color Accesorio:</span>
                    <input
                      type="color"
                      value={character.accessoryColor}
                      onChange={(e) =>
                        handleColorChange('accessoryColor', e.target.value)
                      }
                      className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {ALL_ITEMS.filter((i) => i.category === 'headAccessory').map(
                    (item) => {
                      const isUnlocked =
                        unlockedItemIds.includes(item.id) || item.id === 'none';
                      const isSelected =
                        character.selectedItems.headAccessory === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelectItem('headAccessory', item.id)}
                          className={`p-3 rounded-2xl border-2 text-left flex flex-col justify-between h-20 transition-all ${
                            isSelected
                              ? 'bg-pink-100 border-pink-500 text-pink-900 ring-2 ring-pink-400 shadow-sm'
                              : 'bg-pink-50/50 border-pink-200 text-slate-700 hover:border-pink-300 hover:bg-pink-100/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black truncate">
                              {item.name}
                            </span>
                            {!isUnlocked && (
                              <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            )}
                          </div>
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full self-start capitalize ${
                              item.rarity === 'legendary'
                                ? 'bg-amber-100 text-amber-700 border border-amber-300'
                                : item.rarity === 'epic'
                                ? 'bg-purple-100 text-purple-700 border border-purple-300'
                                : item.rarity === 'rare'
                                ? 'bg-sky-100 text-sky-700 border border-sky-300'
                                : 'bg-white text-slate-600 border border-slate-200'
                            }`}
                          >
                            {item.rarity}
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Accesorios de Mano (Props) */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-pink-600 mb-2">
                  Objeto en Mano (Prop)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {ALL_ITEMS.filter((i) => i.category === 'handAccessory').map(
                    (item) => {
                      const isUnlocked =
                        unlockedItemIds.includes(item.id) || item.id === 'none';
                      const isSelected =
                        character.selectedItems.handAccessory === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelectItem('handAccessory', item.id)}
                          className={`p-3 rounded-2xl border-2 text-left flex flex-col justify-between h-20 transition-all ${
                            isSelected
                              ? 'bg-pink-100 border-pink-500 text-pink-900 ring-2 ring-pink-400 shadow-sm'
                              : 'bg-pink-50/50 border-pink-200 text-slate-700 hover:border-pink-300 hover:bg-pink-100/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black truncate">
                              {item.name}
                            </span>
                            {!isUnlocked && (
                              <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            )}
                          </div>
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full self-start capitalize ${
                              item.rarity === 'legendary'
                                ? 'bg-amber-100 text-amber-700 border border-amber-300'
                                : item.rarity === 'epic'
                                ? 'bg-purple-100 text-purple-700 border border-purple-300'
                                : item.rarity === 'rare'
                                ? 'bg-sky-100 text-sky-700 border border-sky-300'
                                : 'bg-white text-slate-600 border border-slate-200'
                            }`}
                          >
                            {item.rarity}
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 6. POSES CORPORALES */}
          {activeSubTab === 'poses' && (
            <div className="flex flex-col gap-5">
              <h3 className="text-xs font-black uppercase tracking-wider text-pink-600">
                Poses y Gestos del Avatar
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {POSES.map((p) => {
                  const isSelected = character.pose === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        playClickSound();
                        onUpdateCharacter((prev) => ({
                          ...prev,
                          pose: p.id,
                        }));
                      }}
                      className={`p-4 rounded-2xl border-2 text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                        isSelected
                          ? 'bg-pink-100 border-pink-500 text-pink-900 ring-2 ring-pink-400 shadow-sm'
                          : 'bg-pink-50/50 border-pink-200 text-slate-700 hover:border-pink-300 hover:bg-pink-100/50'
                      }`}
                    >
                      <span className="text-3xl">{p.icon}</span>
                      <span className="text-xs font-black">{p.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
