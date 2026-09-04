import React, { useState } from 'react';
import { VANILLA_STANDALONE_CODE, SPRITE_INTEGRATION_GUIDE } from '../engine/vanillaTemplate';
import { playClickSound, playSparkleSound } from '../utils/audio';
import { Copy, Download, Check, Code, BookOpen, Layers, Sparkles } from 'lucide-react';

export const SpriteGuideModal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'code' | 'guide'>('code');
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(VANILLA_STANDALONE_CODE);
      playSparkleSound();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignored
    }
  };

  const handleDownloadFile = () => {
    playSparkleSound();
    const blob = new Blob([VANILLA_STANDALONE_CODE], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'gacha_life_engine_vanilla.html';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Encabezado */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border-4 border-pink-200 shadow-xl mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 font-['Outfit'] flex items-center gap-2">
              <Code className="w-7 h-7 text-pink-500" />
              <span>Arquitectura Vanilla JS & Conexión de Sprites</span>
            </h2>
            <p className="text-sm text-slate-600 font-medium mt-1">
              Código fuente completo en HTML, CSS y JavaScript Vanilla puro,
              listo para guardar y ejecutar en cualquier navegador.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black bg-white hover:bg-pink-50 text-slate-700 border-2 border-pink-200 transition-all active:translate-y-0.5 shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 font-black">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-pink-500" />
                  <span>Copiar Código</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadFile}
              className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black bg-pink-500 hover:bg-pink-400 text-white shadow-md border-b-4 border-pink-700 active:border-b-0 active:translate-y-1 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Descargar .html</span>
            </button>
          </div>
        </div>

        {/* Pestañas de la sección */}
        <div className="flex items-center gap-2 mt-5 border-t-2 border-pink-100 pt-4">
          <button
            onClick={() => {
              playClickSound();
              setActiveTab('code');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'code'
                ? 'bg-pink-500 text-white shadow-md border-b-4 border-pink-700'
                : 'bg-pink-50/70 text-pink-700 hover:bg-pink-100/70 border-2 border-pink-200'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>1. Código Vanilla Completo (index.html)</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setActiveTab('guide');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'guide'
                ? 'bg-pink-500 text-white shadow-md border-b-4 border-pink-700'
                : 'bg-pink-50/70 text-pink-700 hover:bg-pink-100/70 border-2 border-pink-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>2. Guía Técnica de Sprites & Tintado</span>
          </button>
        </div>
      </div>

      {/* CONTENIDO DE LA PESTAÑA ACTIVA */}
      {activeTab === 'code' ? (
        <div className="bg-slate-900 rounded-3xl p-5 border-4 border-pink-200 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs text-slate-400">
            <span className="font-mono text-pink-300 font-bold">gacha_life_standalone.html</span>
            <span className="text-[11px] bg-pink-950/70 text-pink-300 border border-pink-700/50 px-2.5 py-1 rounded-md font-mono font-bold">
              HTML5 Canvas + Vanilla JS (Sin librerías externas)
            </span>
          </div>
          <pre className="text-xs font-mono text-slate-200 overflow-x-auto max-h-[580px] p-2 leading-relaxed selection:bg-pink-500/30">
            <code>{VANILLA_STANDALONE_CODE}</code>
          </pre>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-pink-200 shadow-xl text-slate-800 leading-relaxed">
          <div className="prose max-w-none text-sm space-y-6">
            <div>
              <h3 className="text-lg font-black text-pink-600 mb-2 flex items-center gap-2">
                <span>1. Estructura de Capas (Z-Index / Render Pipeline)</span>
              </h3>
              <p className="text-slate-600">
                En videojuegos 2D como Gacha Club o Gacha Life, los personajes
                se ensamblan a través de un <strong>Z-Buffer manual</strong> en
                HTML5 Canvas. El orden estricto de dibujado para que la ropa y el
                cabello no se tapen incorrectamente es:
              </p>
              <div className="bg-slate-900 p-4 rounded-2xl font-mono text-xs text-emerald-400 my-3 border-2 border-slate-800 shadow-inner">
                [FONDO DEL ESCENARIO]<br />
                &nbsp;&nbsp;1. back_hair.png (Cabello posterior / coletas)<br />
                &nbsp;&nbsp;2. wings_tail.png (Alas, colas o capas)<br />
                &nbsp;&nbsp;3. body_base.png (Brazos traseros, torso, piernas)<br />
                &nbsp;&nbsp;4. shoes.png (Calzado)<br />
                &nbsp;&nbsp;5. bottom.png (Falda, shorts o pantalones)<br />
                &nbsp;&nbsp;6. top.png (Camisa, chaqueta, uniforme)<br />
                &nbsp;&nbsp;7. head_base.png (Cabeza, orejas, cuello)<br />
                &nbsp;&nbsp;8. eyes.png (Esclerótica, iris coloreado, brillo)<br />
                &nbsp;&nbsp;9. mouth_expression.png (Boca y cejas según expresión)<br />
                &nbsp;10. front_hair.png (Flequillo y mechones frontales)<br />
                &nbsp;11. head_acc.png (Gorros, lazos, orejas nekomimi)<br />
                &nbsp;12. hand_prop.png (Espada, varita, té de boba)<br />
                [BURBUJAS DE DIÁLOGO / UI]
              </div>
            </div>

            <div>
              <h3 className="text-lg font-black text-pink-600 mb-2">
                2. Tintado Dinámico de Colores Hex en Canvas Offscreen
              </h3>
              <p className="text-slate-600">
                Para permitir que el jugador pinte el cabello o la ropa de
                cualquier color Hexadecimal sin tener que guardar 100 archivos
                PNG para cada color, los sprites base se diseñan en{' '}
                <strong>escala de grises</strong> y se tintan en un canvas
                invisible con <code className="bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded font-mono font-bold">globalCompositeOperation = &apos;source-in&apos;</code> o <code className="bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded font-mono font-bold">&apos;multiply&apos;</code>:
              </p>
              <div className="bg-slate-900 p-4 rounded-2xl font-mono text-xs text-sky-300 my-3 border-2 border-slate-800 shadow-inner">
                <span className="text-slate-500">// Función de tintado dinámico</span><br />
                function createTintedSprite(image, hexColor, width, height) &#123;<br />
                &nbsp;&nbsp;const offCanvas = document.createElement(&apos;canvas&apos;);<br />
                &nbsp;&nbsp;offCanvas.width = width;<br />
                &nbsp;&nbsp;offCanvas.height = height;<br />
                &nbsp;&nbsp;const offCtx = offCanvas.getContext(&apos;2d&apos;);<br />
                <br />
                &nbsp;&nbsp;<span className="text-slate-500">// 1. Dibuja el sprite original en escala de grises</span><br />
                &nbsp;&nbsp;offCtx.drawImage(image, 0, 0, width, height);<br />
                <br />
                &nbsp;&nbsp;<span className="text-slate-500">// 2. Conserva la silueta y aplica el color Hex deseado</span><br />
                &nbsp;&nbsp;offCtx.globalCompositeOperation = &apos;source-in&apos;;<br />
                &nbsp;&nbsp;offCtx.fillStyle = hexColor;<br />
                &nbsp;&nbsp;offCtx.fillRect(0, 0, width, height);<br />
                <br />
                &nbsp;&nbsp;return offCanvas; <span className="text-slate-500">// Retorna el canvas listo para ctx.drawImage()</span><br />
                &#125;
              </div>
            </div>

            <div>
              <h3 className="text-lg font-black text-pink-600 mb-2">
                3. Conexión de Spritesheets (Texture Atlas)
              </h3>
              <p className="text-slate-600">
                Si colocas todas las piezas en un solo archivo de imagen grande
                (sprite atlas), puedes recortar cualquier parte utilizando los 9
                parámetros nativos de <code className="bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded font-mono font-bold">ctx.drawImage</code>:
              </p>
              <div className="bg-slate-900 p-4 rounded-2xl font-mono text-xs text-amber-300 my-3 border-2 border-slate-800 shadow-inner">
                <span className="text-slate-500">// ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);</span><br />
                <span className="text-slate-500">// sx, sy: Coordenadas de inicio del recorte en el archivo PNG</span><br />
                <span className="text-slate-500">// sw, sh: Ancho y alto del recorte</span><br />
                <span className="text-slate-500">// dx, dy: Posición de destino en el avatar/pantalla</span><br />
                <span className="text-slate-500">// dw, dh: Tamaño de dibujado final</span><br />
                ctx.drawImage(atlasImage, 128 * frameIndex, 0, 128, 128, -64, -128, 128, 128);
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
