import React, { useState } from 'react';
import { ALL_ITEMS } from '../data/items';
import { ItemRarity, LayerCategory } from '../types';
import { Lock, CheckCircle2, Sparkles, Package, ShieldCheck } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface InventoryViewProps {
  unlockedItemIds: string[];
  onOpenGacha: () => void;
  onGoToCreator: () => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  unlockedItemIds,
  onOpenGacha,
  onGoToCreator,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | ItemRarity>('all');

  const filteredItems = ALL_ITEMS.filter((item) => {
    if (item.id === 'none') return false;
    if (selectedFilter === 'all') return true;
    return item.rarity === selectedFilter;
  });

  const totalItems = ALL_ITEMS.filter((i) => i.id !== 'none').length;
  const unlockedCount = ALL_ITEMS.filter(
    (i) => i.id !== 'none' && unlockedItemIds.includes(i.id)
  ).length;
  const progressPercent = Math.round((unlockedCount / totalItems) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Encabezado y Progreso */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border-4 border-pink-200 shadow-xl mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 font-['Outfit'] flex items-center gap-2">
              <Package className="w-7 h-7 text-pink-500" />
              <span>Inventario y Colección de Atuendos</span>
            </h2>
            <p className="text-sm text-slate-600 font-medium mt-1">
              Todos los objetos desbloqueados se guardan automáticamente en tu{' '}
              <span className="text-pink-600 font-mono font-bold">localStorage</span>.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                playClickSound();
                onOpenGacha();
              }}
              className="py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black bg-amber-400 hover:bg-amber-300 text-amber-950 shadow-md border-b-4 border-amber-600 active:border-b-0 active:translate-y-1 transition-all"
            >
              Tirar en el Gacha 🎰
            </button>
            <button
              onClick={() => {
                playClickSound();
                onGoToCreator();
              }}
              className="py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black bg-pink-500 hover:bg-pink-400 text-white shadow-md border-b-4 border-pink-700 active:border-b-0 active:translate-y-1 transition-all"
            >
              Vestir Personaje 👗
            </button>
          </div>
        </div>

        {/* Barra de Progreso de la Colección */}
        <div className="mt-5 bg-pink-50/80 p-4 rounded-2xl border-2 border-pink-200">
          <div className="flex items-center justify-between text-xs font-black mb-2">
            <span className="text-pink-700 uppercase tracking-wider">Progreso de Colección:</span>
            <span className="text-pink-600 font-mono text-sm">
              {unlockedCount} / {totalItems} ítems ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-3.5 bg-white rounded-full overflow-hidden border-2 border-pink-200 shadow-inner">
            <div
              style={{ width: `${progressPercent}%` }}
              className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full transition-all duration-500"
            />
          </div>
        </div>
      </div>

      {/* Filtros por Rareza */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap active:translate-y-0.5 ${
            selectedFilter === 'all'
              ? 'bg-pink-500 text-white shadow-md border-b-4 border-pink-700'
              : 'bg-white text-pink-700 hover:bg-pink-50 border-2 border-pink-200'
          }`}
        >
          Todos ({totalItems})
        </button>
        <button
          onClick={() => setSelectedFilter('common')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap active:translate-y-0.5 ${
            selectedFilter === 'common'
              ? 'bg-slate-700 text-white shadow-md border-b-4 border-slate-900'
              : 'bg-white text-slate-600 hover:bg-slate-50 border-2 border-slate-200'
          }`}
        >
          Comunes (60%)
        </button>
        <button
          onClick={() => setSelectedFilter('rare')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap active:translate-y-0.5 ${
            selectedFilter === 'rare'
              ? 'bg-sky-500 text-white shadow-md border-b-4 border-sky-700'
              : 'bg-white text-sky-700 hover:bg-sky-50 border-2 border-sky-200'
          }`}
        >
          Raros (25%)
        </button>
        <button
          onClick={() => setSelectedFilter('epic')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap active:translate-y-0.5 ${
            selectedFilter === 'epic'
              ? 'bg-purple-600 text-white shadow-md border-b-4 border-purple-800'
              : 'bg-white text-purple-700 hover:bg-purple-50 border-2 border-purple-200'
          }`}
        >
          Épicos (12%)
        </button>
        <button
          onClick={() => setSelectedFilter('legendary')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap active:translate-y-0.5 ${
            selectedFilter === 'legendary'
              ? 'bg-amber-400 text-amber-950 shadow-md border-b-4 border-amber-600'
              : 'bg-white text-amber-700 hover:bg-amber-50 border-2 border-amber-200'
          }`}
        >
          Legendarios (3%)
        </button>
      </div>

      {/* Grid de Ítems */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
        {filteredItems.map((item) => {
          const isUnlocked = unlockedItemIds.includes(item.id);
          return (
            <div
              key={item.id}
              className={`p-4 rounded-3xl border-4 flex flex-col justify-between h-32 transition-all ${
                isUnlocked
                  ? 'bg-white border-pink-200 shadow-md hover:border-pink-300'
                  : 'bg-slate-100/70 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-black text-slate-800 line-clamp-2">
                  {item.name}
                </h4>
                {isUnlocked ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </div>

              <div className="flex items-center justify-between mt-auto">
                <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">
                  {item.category}
                </span>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full capitalize ${
                    item.rarity === 'legendary'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : item.rarity === 'epic'
                      ? 'bg-purple-100 text-purple-800 border border-purple-300'
                      : item.rarity === 'rare'
                      ? 'bg-sky-100 text-sky-800 border border-sky-300'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {item.rarity}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
