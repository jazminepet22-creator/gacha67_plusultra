import React from 'react';
import { Sparkles, Palette, Clapperboard, Dices, Package, Code, Plus } from 'lucide-react';
import { playClickSound, playSparkleSound } from '../utils/audio';

interface NavbarProps {
  activeTab: 'creator' | 'studio' | 'gacha' | 'inventory' | 'guide';
  onTabChange: (tab: 'creator' | 'studio' | 'gacha' | 'inventory' | 'guide') => void;
  gems: number;
  onAddGems: (amount: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  gems,
  onAddGems,
}) => {
  const handleTabClick = (tab: 'creator' | 'studio' | 'gacha' | 'inventory' | 'guide') => {
    playClickSound();
    onTabChange(tab);
  };

  const handleClaimGems = () => {
    playSparkleSound();
    onAddGems(500);
  };

  return (
    <header className="bg-white border-b-4 border-pink-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between flex-wrap gap-3">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-pink-500 to-rose-400 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md border-b-4 border-pink-600 select-none">
            G
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-pink-500 tracking-tight italic font-['Outfit'] leading-none">
              GACHA CREATOR <span className="text-amber-500 not-italic text-sm font-extrabold px-1.5 py-0.5 rounded-md bg-amber-100 border border-amber-300 ml-1">Pro</span>
            </h1>
            <p className="text-[11px] font-bold text-pink-400/90 tracking-wide uppercase mt-0.5">
              Motor 2D & Escenarios Chibi
            </p>
          </div>
        </div>

        {/* Navigation Tabs with Vibrant 3D Tactile Buttons */}
        <nav className="flex items-center bg-pink-100/80 p-1.5 rounded-2xl border-2 border-pink-200 overflow-x-auto gap-1">
          <button
            id="tab-creator"
            onClick={() => handleTabClick('creator')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all whitespace-nowrap active:translate-y-0.5 ${
              activeTab === 'creator'
                ? 'bg-pink-500 text-white shadow-md border-b-4 border-pink-700'
                : 'text-pink-600 hover:bg-white/80'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Creador</span>
          </button>

          <button
            id="tab-studio"
            onClick={() => handleTabClick('studio')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all whitespace-nowrap active:translate-y-0.5 ${
              activeTab === 'studio'
                ? 'bg-purple-500 text-white shadow-md border-b-4 border-purple-700'
                : 'text-purple-600 hover:bg-white/80'
            }`}
          >
            <Clapperboard className="w-4 h-4" />
            <span>Modo Estudio</span>
          </button>

          <button
            id="tab-gacha"
            onClick={() => handleTabClick('gacha')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all whitespace-nowrap active:translate-y-0.5 ${
              activeTab === 'gacha'
                ? 'bg-yellow-400 text-yellow-950 shadow-md border-b-4 border-yellow-600'
                : 'text-yellow-700 hover:bg-white/80'
            }`}
          >
            <Dices className="w-4 h-4" />
            <span>Gacha</span>
          </button>

          <button
            id="tab-inventory"
            onClick={() => handleTabClick('inventory')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all whitespace-nowrap active:translate-y-0.5 ${
              activeTab === 'inventory'
                ? 'bg-emerald-500 text-white shadow-md border-b-4 border-emerald-700'
                : 'text-emerald-700 hover:bg-white/80'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Inventario</span>
          </button>

          <button
            id="tab-guide"
            onClick={() => handleTabClick('guide')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all whitespace-nowrap active:translate-y-0.5 ${
              activeTab === 'guide'
                ? 'bg-sky-500 text-white shadow-md border-b-4 border-sky-700'
                : 'text-sky-700 hover:bg-white/80'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Sprites & Vanilla</span>
          </button>
        </nav>

        {/* Currency Counters (Gems & Claim Button) */}
        <div className="flex items-center gap-2.5">
          <div className="bg-purple-100 px-3.5 py-1 rounded-full border-2 border-purple-300 flex items-center gap-1.5 shadow-sm">
            <span className="text-sm">💎</span>
            <span className="font-mono font-black text-purple-700 text-sm">
              {gems.toLocaleString()}
            </span>
          </div>

          <button
            id="btn-claim-gems"
            onClick={handleClaimGems}
            title="Reclamar 500 Gemas gratis"
            className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-300 text-yellow-950 px-3 py-1.5 rounded-full text-xs font-black transition-all active:translate-y-0.5 shadow-md border-b-4 border-yellow-600 active:border-b-0"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>+500</span>
          </button>
        </div>
      </div>
    </header>
  );
};
