import React, { useState } from 'react';
import { CharacterItem, GachaPoolItem } from '../types';
import { GACHA_POOL } from '../data/items';
import {
  playGachaPullSound,
  playFanfareSound,
  playSparkleSound,
  playClickSound,
} from '../utils/audio';
import { Sparkles, Dices, Award, CheckCircle2, Repeat, X } from 'lucide-react';

interface GachaModalProps {
  gems: number;
  unlockedItemIds: string[];
  onDeductGems: (amount: number) => boolean;
  onUnlockItem: (item: CharacterItem) => void;
  onAddGems: (amount: number) => void;
  onGoToCreator: () => void;
}

interface PullResult {
  item: CharacterItem;
  isDuplicate: boolean;
  refundGems?: number;
}

export const GachaModal: React.FC<GachaModalProps> = ({
  gems,
  unlockedItemIds,
  onDeductGems,
  onUnlockItem,
  onAddGems,
  onGoToCreator,
}) => {
  const [isPulling, setIsPulling] = useState(false);
  const [results, setResults] = useState<PullResult[] | null>(null);
  const [highestRarity, setHighestRarity] = useState<string>('common');

  // Algoritmo de probabilidades ponderadas
  const rollSingleItem = (): PullResult => {
    const roll = Math.random() * 100;
    let poolFiltered: GachaPoolItem[];
    let rarityPicked = 'common';

    if (roll < 3) {
      // 3% Legendario
      rarityPicked = 'legendary';
      poolFiltered = GACHA_POOL.filter((i) => i.item.rarity === 'legendary');
    } else if (roll < 15) {
      // 12% Épico (3% + 12% = 15%)
      rarityPicked = 'epic';
      poolFiltered = GACHA_POOL.filter((i) => i.item.rarity === 'epic');
    } else if (roll < 40) {
      // 25% Raro (15% + 25% = 40%)
      rarityPicked = 'rare';
      poolFiltered = GACHA_POOL.filter((i) => i.item.rarity === 'rare');
    } else {
      // 60% Común
      rarityPicked = 'common';
      poolFiltered = GACHA_POOL.filter((i) => i.item.rarity === 'common');
    }

    if (poolFiltered.length === 0) poolFiltered = GACHA_POOL;
    const randomPick =
      poolFiltered[Math.floor(Math.random() * poolFiltered.length)].item;

    const isDuplicate = unlockedItemIds.includes(randomPick.id);
    let refundGems = 0;
    if (isDuplicate) {
      refundGems =
        rarityPicked === 'legendary'
          ? 200
          : rarityPicked === 'epic'
          ? 100
          : rarityPicked === 'rare'
          ? 50
          : 25;
      onAddGems(refundGems);
    } else {
      onUnlockItem(randomPick);
    }

    return {
      item: randomPick,
      isDuplicate,
      refundGems,
    };
  };

  // Tirada de 1 o 10
  const handlePull = (count: 1 | 10) => {
    const cost = count === 1 ? 100 : 900;
    if (!onDeductGems(cost)) {
      alert('¡No tienes suficientes Gemas! Reclama gemas gratis arriba a la derecha.');
      return;
    }

    playGachaPullSound();
    setIsPulling(true);
    setResults(null);

    setTimeout(() => {
      const pulledResults: PullResult[] = [];
      let topRarity = 'common';

      for (let i = 0; i < count; i++) {
        const res = rollSingleItem();
        pulledResults.push(res);
        if (res.item.rarity === 'legendary') topRarity = 'legendary';
        else if (res.item.rarity === 'epic' && topRarity !== 'legendary')
          topRarity = 'epic';
        else if (
          res.item.rarity === 'rare' &&
          topRarity !== 'legendary' &&
          topRarity !== 'epic'
        )
          topRarity = 'rare';
      }

      setHighestRarity(topRarity);
      setResults(pulledResults);
      setIsPulling(false);
      playFanfareSound(topRarity);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Banner Principal de la Ruleta Gacha */}
      <div className="bg-white border-4 border-pink-200 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Luces decorativas */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-pink-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center max-w-xl mx-auto mb-8 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100 border-2 border-pink-300 text-pink-700 text-xs font-black mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>Gashapon Estelar Chibi</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight font-['Outfit']">
            Invoca Prendas & Accesorios
          </h2>
          <p className="text-slate-600 text-sm font-medium mt-2">
            Usa tus gemas para conseguir atuendos exclusivos. Los duplicados se
            reembolsan automáticamente en gemas de bonificación.
          </p>
        </div>

        {/* Cápsula Animada / Máquina Gashapon */}
        <div className="flex flex-col items-center justify-center my-8 relative z-10">
          <div
            className={`w-40 h-40 sm:w-48 sm:h-48 rounded-full flex items-center justify-center border-4 shadow-2xl transition-all duration-700 ${
              isPulling
                ? 'animate-spin border-amber-400 bg-gradient-to-tr from-amber-400 via-pink-400 to-purple-400 scale-110 shadow-amber-400/50'
                : 'border-pink-300 bg-gradient-to-tr from-pink-100 via-purple-100 to-pink-200 shadow-pink-300/50'
            }`}
          >
            <span className="text-6xl sm:text-7xl select-none">
              {isPulling ? '✨' : '🔮'}
            </span>
          </div>

          {isPulling && (
            <p className="text-pink-600 font-black text-sm tracking-wider uppercase mt-4 animate-pulse">
              ¡Conjurando accesorios estelares...!
            </p>
          )}
        </div>

        {/* Botones de Tirada (Roll 1x / Roll 10x) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10 max-w-md mx-auto">
          <button
            disabled={isPulling}
            onClick={() => handlePull(1)}
            className="w-full sm:flex-1 py-3 px-6 rounded-2xl font-black text-sm bg-purple-600 hover:bg-purple-500 text-white shadow-md border-b-4 border-purple-800 active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>Tirada x1</span>
            <span className="bg-purple-900/60 px-2 py-0.5 rounded-lg text-xs font-mono text-amber-300">
              100 💎
            </span>
          </button>

          <button
            disabled={isPulling}
            onClick={() => handlePull(10)}
            className="w-full sm:flex-1 py-3 px-6 rounded-2xl font-black text-sm bg-pink-500 hover:bg-pink-400 text-white shadow-md border-b-4 border-pink-700 active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>Tirada x10</span>
            <span className="bg-pink-800/60 px-2 py-0.5 rounded-lg text-xs font-mono text-amber-300">
              900 💎 (-10%)
            </span>
          </button>
        </div>

        {/* Tabla de Probabilidades y Rarezas */}
        <div className="mt-8 pt-6 border-t-2 border-pink-100 grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
          <div className="bg-pink-50/70 p-3 rounded-2xl border-2 border-pink-200 text-center">
            <span className="text-[11px] font-black uppercase text-slate-500 block">
              Común (60%)
            </span>
            <span className="text-xs font-bold text-slate-700">
              Lazos, Tops básicos
            </span>
          </div>
          <div className="bg-sky-50 p-3 rounded-2xl border-2 border-sky-200 text-center">
            <span className="text-[11px] font-black uppercase text-sky-600 block">
              Raro (25%)
            </span>
            <span className="text-xs font-bold text-sky-800">
              Nekomimi, Boba, Botas
            </span>
          </div>
          <div className="bg-purple-50 p-3 rounded-2xl border-2 border-purple-200 text-center">
            <span className="text-[11px] font-black uppercase text-purple-600 block">
              Épico (12%)
            </span>
            <span className="text-xs font-bold text-purple-800">
              Aureola, Varita, Trajes
            </span>
          </div>
          <div className="bg-amber-50 p-3 rounded-2xl border-2 border-amber-200 text-center">
            <span className="text-[11px] font-black uppercase text-amber-600 block">
              Legendario (3%)
            </span>
            <span className="text-xs font-bold text-amber-800">
              Corona Estelar, Katana
            </span>
          </div>
        </div>
      </div>

      {/* MODAL DE RESULTADOS DE LA TIRADA */}
      {results && (
        <div className="fixed inset-0 z-50 bg-pink-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-4 border-pink-300 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setResults(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-pink-50 hover:bg-pink-100 border border-pink-200 text-pink-600 flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <span className="text-4xl block mb-2">
                {highestRarity === 'legendary'
                  ? '🌟'
                  : highestRarity === 'epic'
                  ? '✨'
                  : '🎉'}
              </span>
              <h3 className="text-2xl font-black text-slate-800 font-['Outfit']">
                {highestRarity === 'legendary'
                  ? '¡Tirada Legendaria!'
                  : highestRarity === 'epic'
                  ? '¡Tirada Épica!'
                  : '¡Resultados de la Invocación!'}
              </h3>
              <p className="text-xs font-bold text-pink-600 mt-1">
                Los objetos se han añadido a tu guardarropa permanentemente
              </p>
            </div>

            {/* Grid de Ítems Obtenidos */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6">
              {results.map((res, index) => {
                const isLegendary = res.item.rarity === 'legendary';
                const isEpic = res.item.rarity === 'epic';
                const isRare = res.item.rarity === 'rare';

                return (
                  <div
                    key={index}
                    className={`p-3 rounded-2xl border-2 text-center flex flex-col items-center justify-between min-h-[140px] relative transition-transform hover:scale-105 ${
                      isLegendary
                        ? 'bg-amber-50 border-amber-400 text-amber-900 shadow-md shadow-amber-300/30'
                        : isEpic
                        ? 'bg-purple-50 border-purple-400 text-purple-900'
                        : isRare
                        ? 'bg-sky-50 border-sky-400 text-sky-900'
                        : 'bg-pink-50/60 border-pink-200 text-slate-800'
                    }`}
                  >
                    <span className="text-2xl mt-1">
                      {isLegendary
                        ? '👑'
                        : isEpic
                        ? '✨'
                        : isRare
                        ? '💎'
                        : '🎀'}
                    </span>

                    <div>
                      <h4 className="text-xs font-black leading-tight line-clamp-2">
                        {res.item.name}
                      </h4>
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider block mt-1 ${
                          isLegendary
                            ? 'text-amber-600'
                            : isEpic
                            ? 'text-purple-600'
                            : isRare
                            ? 'text-sky-600'
                            : 'text-slate-500'
                        }`}
                      >
                        {res.item.rarity}
                      </span>
                    </div>

                    {res.isDuplicate ? (
                      <span className="text-[10px] bg-white text-amber-700 font-mono font-bold px-2 py-0.5 rounded-full border border-amber-300">
                        +{res.refundGems} 💎 (Rep)
                      </span>
                    ) : (
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 font-black px-2 py-0.5 rounded-full border border-emerald-300">
                        ¡NUEVO!
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Acciones tras la tirada */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setResults(null)}
                className="py-2.5 px-5 rounded-xl text-xs font-black bg-white hover:bg-pink-50 text-slate-700 border-2 border-pink-200 transition-colors shadow-sm"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setResults(null);
                  onGoToCreator();
                }}
                className="py-2.5 px-5 rounded-xl text-xs font-black bg-pink-500 hover:bg-pink-400 text-white shadow-md border-b-4 border-pink-700 active:border-b-0 active:translate-y-1 transition-all"
              >
                Ir a Probar en el Creador 👗
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
