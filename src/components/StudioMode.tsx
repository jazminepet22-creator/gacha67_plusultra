import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SceneActor, CharacterState, StudioBackground } from '../types';
import { STUDIO_BACKGROUNDS, POSES, EXPRESSIONS } from '../data/items';
import { renderCharacterToCanvas } from '../engine/renderer2D';
import { playClickSound, playSparkleSound } from '../utils/audio';
import {
  Camera,
  Plus,
  Trash2,
  Maximize2,
  MessageSquare,
  Sparkles,
  Layers,
  Volume2,
  Copy,
  ChevronDown,
  X,
} from 'lucide-react';

interface StudioModeProps {
  availableCharacters: CharacterState[];
  actors: SceneActor[];
  onUpdateActors: (updater: (prev: SceneActor[]) => SceneActor[]) => void;
  selectedActorId: string | null;
  onSelectActor: (id: string | null) => void;
}

export const StudioMode: React.FC<StudioModeProps> = ({
  availableCharacters,
  actors,
  onUpdateActors,
  selectedActorId,
  onSelectActor,
}) => {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [currentBg, setCurrentBg] = useState<StudioBackground>(STUDIO_BACKGROUNDS[0]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDialogueEditor, setShowDialogueEditor] = useState(false);

  const selectedActor = actors.find((a) => a.instanceId === selectedActorId) || null;

  // Manejador de inicio de arrastre (Mouse / Touch)
  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    actorId: string
  ) => {
    e.stopPropagation();
    onSelectActor(actorId);
    setIsDragging(true);

    const stage = stageRef.current;
    if (!stage) return;
    const stageRect = stage.getBoundingClientRect();
    const actor = actors.find((a) => a.instanceId === actorId);
    if (!actor) return;

    // Calcular offset relativo en porcentaje
    const clickXPercent = ((e.clientX - stageRect.left) / stageRect.width) * 100;
    const clickYPercent = ((e.clientY - stageRect.top) / stageRect.height) * 100;

    setDragOffset({
      x: clickXPercent - actor.x,
      y: clickYPercent - actor.y,
    });
  };

  // Movimiento al arrastrar
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging || !selectedActorId) return;
      const stage = stageRef.current;
      if (!stage) return;

      const stageRect = stage.getBoundingClientRect();
      const currentXPercent =
        ((e.clientX - stageRect.left) / stageRect.width) * 100;
      const currentYPercent =
        ((e.clientY - stageRect.top) / stageRect.height) * 100;

      const newX = Math.max(5, Math.min(95, currentXPercent - dragOffset.x));
      const newY = Math.max(15, Math.min(95, currentYPercent - dragOffset.y));

      onUpdateActors((prev) =>
        prev.map((a) =>
          a.instanceId === selectedActorId ? { ...a, x: newX, y: newY } : a
        )
      );
    },
    [isDragging, selectedActorId, dragOffset, onUpdateActors]
  );

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Añadir personaje al escenario
  const handleAddActor = (char: CharacterState) => {
    playSparkleSound();
    const newActor: SceneActor = {
      instanceId: `actor-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      character: { ...char },
      x: 30 + Math.random() * 40,
      y: 75,
      scale: 1.0,
      flipped: false,
      zIndex: actors.length + 1,
      dialogue: {
        text: '¡Hola! Bienvenidos a Gacha Studio ✨',
        speakerName: char.name,
        style: 'speech',
        position: 'top',
      },
    };
    onUpdateActors((prev) => [...prev, newActor]);
    onSelectActor(newActor.instanceId);
    setShowAddModal(false);
  };

  // Eliminar personaje del escenario
  const handleDeleteActor = (id: string) => {
    playClickSound();
    onUpdateActors((prev) => prev.filter((a) => a.instanceId !== id));
    if (selectedActorId === id) {
      onSelectActor(null);
    }
  };

  // Duplicar personaje
  const handleCloneActor = (actor: SceneActor) => {
    playSparkleSound();
    const clone: SceneActor = {
      ...actor,
      instanceId: `actor-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      x: Math.min(85, actor.x + 8),
      y: actor.y,
      zIndex: actors.length + 1,
    };
    onUpdateActors((prev) => [...prev, clone]);
    onSelectActor(clone.instanceId);
  };

  // Actualizar propiedades del actor activo
  const updateSelectedActor = (updater: (prev: SceneActor) => SceneActor) => {
    if (!selectedActorId) return;
    onUpdateActors((prev) =>
      prev.map((a) => (a.instanceId === selectedActorId ? updater(a) : a))
    );
  };

  // Capturar escena completa en PNG
  const handleExportScene = () => {
    playSparkleSound();
    const stage = stageRef.current;
    if (!stage) return;

    // Crear un canvas de alta definición para renderizar la escena completa
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Dibujar fondo
    // Para simplificar, dibujamos un fondo simulado con gradiente
    const grad = ctx.createLinearGradient(0, 0, 0, 720);
    if (currentBg.id === 'sakura-park') {
      grad.addColorStop(0, '#fbcfe8');
      grad.addColorStop(0.4, '#f472b6');
      grad.addColorStop(0.65, '#86efac');
      grad.addColorStop(1, '#15803d');
    } else if (currentBg.id === 'sunset-rooftop') {
      grad.addColorStop(0, '#4c1d95');
      grad.addColorStop(0.35, '#c026d3');
      grad.addColorStop(0.65, '#f97316');
      grad.addColorStop(0.85, '#fef08a');
      grad.addColorStop(1, '#1e293b');
    } else {
      grad.addColorStop(0, '#93c5fd');
      grad.addColorStop(0.45, '#bfdbfe');
      grad.addColorStop(0.7, '#d97706');
      grad.addColorStop(1, '#78350f');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1280, 720);

    // 2. Renderizar cada personaje ordenado por Z-Index
    const sortedActors = [...actors].sort((a, b) => a.zIndex - b.zIndex);
    sortedActors.forEach((actor) => {
      const actorCanvas = document.createElement('canvas');
      actorCanvas.width = 400;
      actorCanvas.height = 460;
      const aCtx = actorCanvas.getContext('2d');
      if (aCtx) {
        renderCharacterToCanvas(aCtx, actor.character, {
          width: 400,
          height: 460,
          flip: actor.flipped,
          scale: 1.0,
          showShadow: true,
        });

        const targetX = (actor.x / 100) * 1280;
        const targetY = (actor.y / 100) * 720;
        const renderW = 320 * actor.scale;
        const renderH = 370 * actor.scale;

        ctx.drawImage(
          actorCanvas,
          targetX - renderW / 2,
          targetY - renderH,
          renderW,
          renderH
        );

        // Si tiene diálogo, dibujar burbuja
        if (actor.dialogue?.text) {
          ctx.save();
          ctx.font = 'bold 18px Nunito, sans-serif';
          const textMetrics = ctx.measureText(actor.dialogue.text);
          const bubbleW = Math.max(160, textMetrics.width + 40);
          const bubbleH = 50;
          const bubbleX = targetX - bubbleW / 2;
          const bubbleY = targetY - renderH - 60;

          // Fondo burbuja
          ctx.fillStyle = '#ffffff';
          ctx.strokeStyle = '#1e1b4b';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(bubbleX, bubbleY, bubbleW, bubbleH, 16);
          ctx.fill();
          ctx.stroke();

          // Piquito
          ctx.beginPath();
          ctx.moveTo(targetX - 8, bubbleY + bubbleH);
          ctx.lineTo(targetX, bubbleY + bubbleH + 12);
          ctx.lineTo(targetX + 8, bubbleY + bubbleH);
          ctx.fill();
          ctx.stroke();

          // Texto
          ctx.fillStyle = '#0f172a';
          ctx.textAlign = 'center';
          ctx.fillText(actor.dialogue.text, targetX, bubbleY + 32);
          ctx.restore();
        }
      }
    });

    const link = document.createElement('a');
    link.download = `escena_gacha_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Barra de herramientas superior del Estudio */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5 bg-white p-3.5 rounded-2xl border-4 border-pink-200 shadow-md">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Añadir personaje */}
          <button
            onClick={() => {
              playClickSound();
              setShowAddModal(true);
            }}
            className="flex items-center gap-1.5 bg-pink-500 hover:bg-pink-400 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-black shadow-md border-b-4 border-pink-700 active:border-b-0 active:translate-y-1 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Personaje</span>
          </button>

          {/* Selector de Fondos */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-xs font-black uppercase text-pink-500 ml-2 hidden sm:inline">
              Fondo:
            </span>
            {STUDIO_BACKGROUNDS.map((bg) => (
              <button
                key={bg.id}
                onClick={() => {
                  playClickSound();
                  setCurrentBg(bg);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap active:translate-y-0.5 ${
                  currentBg.id === bg.id
                    ? 'bg-purple-600 text-white shadow-md border-b-4 border-purple-800'
                    : 'bg-pink-50 text-pink-700 hover:bg-pink-100 border-2 border-pink-200'
                }`}
              >
                {bg.name}
              </button>
            ))}
          </div>
        </div>

        {/* Capturar Escena */}
        <button
          onClick={handleExportScene}
          className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-black shadow-md border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 transition-all"
        >
          <Camera className="w-4 h-4" />
          <span>Capturar Foto PNG</span>
        </button>
      </div>

      {/* ÁREA DEL ESCENARIO (STAGE) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-8 flex flex-col items-center">
          <div
            ref={stageRef}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onClick={() => onSelectActor(null)}
            style={{ background: currentBg.preview }}
            className="relative w-full aspect-[16/9] min-h-[380px] rounded-3xl overflow-hidden border-4 border-pink-300 shadow-2xl select-none cursor-crosshair touch-none"
          >
            {/* Actores en el Escenario */}
            {actors.map((actor) => (
              <ActorItem
                key={actor.instanceId}
                actor={actor}
                isSelected={selectedActorId === actor.instanceId}
                onPointerDown={(e) => handlePointerDown(e, actor.instanceId)}
              />
            ))}

            {/* Aviso si no hay actores */}
            {actors.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-pink-950/20 backdrop-blur-xs">
                <Sparkles className="w-12 h-12 text-pink-500 mb-2 animate-bounce" />
                <p className="text-base font-black text-white drop-shadow-md">
                  El escenario está vacío
                </p>
                <p className="text-xs font-bold text-white/90 drop-shadow">
                  Haz clic en &quot;Añadir Personaje&quot; para colocar tu primer avatar
                </p>
              </div>
            )}
          </div>

          <p className="text-xs font-bold text-pink-600 mt-2.5 text-center bg-white/70 px-4 py-1.5 rounded-full border border-pink-200 shadow-sm">
            💡 <strong>Consejo:</strong> Haz clic y arrastra cualquier personaje
            para moverlo por el escenario. Selecciónalo para editar su diálogo,
            pose o tamaño.
          </p>
        </div>

        {/* PANEL DE CONTROL DEL PERSONAJE SELECCIONADO */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border-4 border-pink-200 shadow-xl">
          {selectedActor ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b-2 border-pink-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎭</span>
                  <div>
                    <h3 className="text-sm font-black text-pink-700">
                      {selectedActor.character.name}
                    </h3>
                    <p className="text-[11px] font-bold text-slate-400">
                      ID: {selectedActor.instanceId.slice(0, 10)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCloneActor(selectedActor)}
                    title="Duplicar"
                    className="p-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-600 border border-pink-200 active:scale-95 transition-all shadow-sm"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteActor(selectedActor.instanceId)}
                    title="Eliminar"
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 active:scale-95 transition-all shadow-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Globo de Diálogo */}
              <div className="bg-pink-50/70 p-3.5 rounded-2xl border-2 border-pink-200 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-pink-600 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-pink-500" />
                    <span>Globo de Diálogo</span>
                  </span>
                  <select
                    value={selectedActor.dialogue?.style || 'speech'}
                    onChange={(e) => {
                      const style = e.target.value as SceneActor['dialogue']['style'];
                      updateSelectedActor((prev) => ({
                        ...prev,
                        dialogue: {
                          text: prev.dialogue?.text || '¡Hola!',
                          style,
                          position: 'top',
                        },
                      }));
                    }}
                    className="bg-white text-slate-700 text-xs px-2.5 py-1 rounded-xl border-2 border-pink-200 font-bold outline-none"
                  >
                    <option value="speech">Bocadillo Normal</option>
                    <option value="thought">Pensamiento (Nube)</option>
                    <option value="shout">Grito / Acción</option>
                    <option value="whisper">Susurro</option>
                  </select>
                </div>

                <textarea
                  rows={2}
                  value={selectedActor.dialogue?.text || ''}
                  onChange={(e) => {
                    const text = e.target.value;
                    updateSelectedActor((prev) => ({
                      ...prev,
                      dialogue: {
                        style: prev.dialogue?.style || 'speech',
                        position: 'top',
                        text,
                      },
                    }));
                  }}
                  placeholder="Escribe el diálogo aquí..."
                  className="w-full bg-white border-2 border-pink-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:border-pink-500 outline-none resize-none shadow-inner"
                />

                <div className="flex items-center justify-end">
                  <button
                    onClick={() => {
                      updateSelectedActor((prev) => ({
                        ...prev,
                        dialogue: undefined,
                      }));
                    }}
                    className="text-[11px] font-black text-rose-500 hover:text-rose-700"
                  >
                    Quitar Diálogo
                  </button>
                </div>
              </div>

              {/* Transformaciones: Escala y Volteo */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-pink-50/70 p-3 rounded-2xl border-2 border-pink-200 flex flex-col gap-1.5">
                  <span className="text-xs font-black text-pink-600">
                    Tamaño: {selectedActor.scale.toFixed(2)}x
                  </span>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.05"
                    value={selectedActor.scale}
                    onChange={(e) => {
                      const scale = parseFloat(e.target.value);
                      updateSelectedActor((prev) => ({ ...prev, scale }));
                    }}
                    className="accent-pink-500 cursor-pointer"
                  />
                </div>

                <div className="bg-pink-50/70 p-3 rounded-2xl border-2 border-pink-200 flex flex-col justify-center items-center">
                  <button
                    onClick={() => {
                      playClickSound();
                      updateSelectedActor((prev) => ({
                        ...prev,
                        flipped: !prev.flipped,
                      }));
                    }}
                    className={`w-full py-2 px-1 rounded-xl text-xs font-black transition-all border-2 ${
                      selectedActor.flipped
                        ? 'bg-pink-500 text-white border-pink-600 shadow-sm'
                        : 'bg-white border-pink-200 text-pink-700 hover:bg-pink-100'
                    }`}
                  >
                    Mirar {selectedActor.flipped ? 'Izquierda ⬅️' : 'Derecha ➡️'}
                  </button>
                </div>
              </div>

              {/* Poses rápidas en el Estudio */}
              <div>
                <span className="text-xs font-black uppercase text-pink-600 mb-1.5 block">
                  Cambiar Pose:
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {POSES.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        playClickSound();
                        updateSelectedActor((prev) => ({
                          ...prev,
                          character: { ...prev.character, pose: p.id },
                        }));
                      }}
                      className={`p-2 rounded-xl border-2 text-center text-xs font-black transition-all ${
                        selectedActor.character.pose === p.id
                          ? 'bg-pink-100 border-pink-500 text-pink-800 ring-1 ring-pink-400'
                          : 'bg-pink-50/60 border-pink-200 text-slate-600 hover:bg-pink-100/50'
                      }`}
                    >
                      <span className="text-base block">{p.icon}</span>
                      <span className="truncate block text-[10px]">
                        {p.name.split('/')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Expresiones rápidas en el Estudio */}
              <div>
                <span className="text-xs font-black uppercase text-pink-600 mb-1.5 block">
                  Cambiar Expresión:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {EXPRESSIONS.map((expr) => (
                    <button
                      key={expr.id}
                      onClick={() => {
                        playClickSound();
                        updateSelectedActor((prev) => ({
                          ...prev,
                          character: { ...prev.character, expression: expr.id },
                        }));
                      }}
                      className={`p-2 rounded-xl border-2 text-base transition-all ${
                        selectedActor.character.expression === expr.id
                          ? 'bg-pink-200 border-pink-500 scale-105 shadow-sm'
                          : 'bg-pink-50 border-pink-200 hover:bg-pink-100'
                      }`}
                      title={expr.name}
                    >
                      {expr.emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center">
              <span className="text-4xl mb-3">👆</span>
              <p className="text-sm font-black text-pink-600">
                Selecciona un personaje
              </p>
              <p className="text-xs font-bold text-slate-500 mt-1 max-w-[200px]">
                Haz clic sobre cualquier avatar en el escenario para abrir sus
                controles de diálogo y pose.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE SELECCIÓN PARA AÑADIR PERSONAJE */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-pink-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-4 border-pink-300 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-pink-700 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-500" />
                <span>Elegir personaje para el escenario</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-pink-50 hover:bg-pink-100 border border-pink-200 text-pink-600 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-2.5 max-h-80 overflow-y-auto pr-1">
              {availableCharacters.map((char) => (
                <div
                  key={char.id}
                  onClick={() => handleAddActor(char)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-pink-50/60 hover:bg-pink-100 border-2 border-pink-200 hover:border-pink-400 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-pink-200 flex items-center justify-center text-xl shadow-inner">
                      {POSES[char.pose]?.icon || '🧍'}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-800">
                        {char.name}
                      </h4>
                      <p className="text-xs font-bold text-pink-500">
                        Pose: {POSES[char.pose]?.name.split('/')[0]}
                      </p>
                    </div>
                  </div>
                  <button className="text-xs font-black text-white bg-pink-500 hover:bg-pink-400 px-3.5 py-1.5 rounded-xl border-b-2 border-pink-700 shadow-sm">
                    + Colocar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Subcomponente de Actor colocado en el escenario
const ActorItem: React.FC<{
  actor: SceneActor;
  isSelected: boolean;
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
}> = ({ actor, isSelected, onPointerDown }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    renderCharacterToCanvas(ctx, actor.character, {
      width: canvas.width,
      height: canvas.height,
      flip: actor.flipped,
      scale: 1.0,
      showShadow: true,
    });
  }, [actor.character, actor.flipped]);

  return (
    <div
      onPointerDown={onPointerDown}
      style={{
        left: `${actor.x}%`,
        top: `${actor.y}%`,
        transform: `translate(-50%, -100%) scale(${actor.scale})`,
        zIndex: actor.zIndex + (isSelected ? 50 : 0),
      }}
      className={`absolute cursor-grab active:cursor-grabbing group transition-shadow ${
        isSelected ? 'filter drop-shadow(0 0 10px rgba(236, 72, 153, 0.8))' : ''
      }`}
    >
      {/* Globo de Diálogo Flotante */}
      {actor.dialogue?.text && (
        <div
          className={`absolute bottom-[96%] left-1/2 -translate-x-1/2 mb-3 px-3.5 py-2 max-w-[220px] min-w-[120px] rounded-2xl shadow-xl pointer-events-none transition-all ${
            actor.dialogue.style === 'thought'
              ? 'bg-white text-slate-900 border-2 border-dashed border-sky-400 rounded-full'
              : actor.dialogue.style === 'shout'
              ? 'bg-amber-300 text-slate-950 font-black border-2 border-rose-600'
              : actor.dialogue.style === 'whisper'
              ? 'bg-slate-900/90 text-slate-200 border border-slate-600 italic'
              : 'bg-white text-slate-900 border-2 border-slate-800'
          }`}
        >
          {actor.dialogue.speakerName && (
            <span className="block text-[10px] font-black uppercase text-pink-600 leading-tight">
              {actor.dialogue.speakerName}
            </span>
          )}
          <p className="text-xs font-bold leading-snug whitespace-pre-wrap">
            {actor.dialogue.text}
          </p>
          {/* Piquito del bocadillo */}
          <div
            className={`absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent ${
              actor.dialogue.style === 'shout'
                ? 'border-t-[8px] border-t-amber-300'
                : actor.dialogue.style === 'whisper'
                ? 'border-t-[8px] border-t-slate-900'
                : 'border-t-[8px] border-t-white'
            }`}
          />
        </div>
      )}

      {/* Canvas del Avatar */}
      <canvas
        ref={canvasRef}
        width={260}
        height={310}
        className="w-[180px] h-[215px] pointer-events-none"
      />

      {/* Indicador de Selección */}
      {isSelected && (
        <div className="absolute -inset-2 border-2 border-dashed border-pink-400 rounded-2xl pointer-events-none animate-pulse" />
      )}
    </div>
  );
};
