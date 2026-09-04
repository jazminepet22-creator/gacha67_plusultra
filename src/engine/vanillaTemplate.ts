/**
 * Código fuente completo y autosuficiente en HTML, CSS y Vanilla JavaScript
 * listo para guardar como `index.html` y abrir directamente con doble clic en el navegador.
 */
export const VANILLA_STANDALONE_CODE = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gacha Life 2D Engine - Prototipo Vanilla JS</title>
  <style>
    /* RESET & ESTILOS BASE */
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    body { background-color: #0f172a; color: #f8fafc; display: flex; flex-direction: column; min-height: 100vh; padding: 20px; }
    header { text-align: center; margin-bottom: 20px; }
    h1 { font-size: 1.8rem; color: #38bdf8; margin-bottom: 6px; }
    p.subtitle { color: #94a3b8; font-size: 0.95rem; }

    /* LAYOUT PRINCIPAL: CANVASTAGE + PANEL DE PERSONALIZACIÓN */
    .app-container { display: flex; flex-wrap: wrap; gap: 24px; max-width: 1100px; margin: 0 auto; width: 100%; }
    
    /* COLUMNA IZQUIERDA: CANVAS PREVIEW & EXPORT */
    .preview-col { flex: 1; min-width: 320px; display: flex; flex-direction: column; align-items: center; background: #1e293b; padding: 20px; border-radius: 16px; border: 1px solid #334155; }
    canvas#avatarCanvas { background: radial-gradient(circle, #334155 0%, #1e293b 100%); border-radius: 12px; border: 2px solid #475569; width: 320px; height: 380px; box-shadow: 0 10px 25px rgba(0,0,0,0.4); }
    .action-row { margin-top: 16px; display: flex; gap: 10px; width: 100%; }
    .btn { flex: 1; padding: 10px 14px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-size: 0.9rem; }
    .btn-primary { background: #38bdf8; color: #0f172a; }
    .btn-primary:hover { background: #7dd3fc; }
    .btn-secondary { background: #334155; color: #f8fafc; }
    .btn-secondary:hover { background: #475569; }

    /* COLUMNA DERECHA: PANELES DE CONTROL */
    .controls-col { flex: 1.5; min-width: 340px; background: #1e293b; padding: 20px; border-radius: 16px; border: 1px solid #334155; }
    .section-title { font-size: 1.1rem; color: #cbd5e1; margin-bottom: 12px; border-bottom: 1px solid #334155; padding-bottom: 6px; }
    
    .control-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; margin-bottom: 20px; }
    .control-group { display: flex; flex-direction: column; gap: 6px; }
    label { font-size: 0.82rem; color: #94a3b8; font-weight: 500; }
    select, input[type="text"] { background: #0f172a; border: 1px solid #475569; color: #f8fafc; padding: 8px 10px; border-radius: 6px; outline: none; }
    input[type="color"] { width: 100%; height: 38px; border: none; border-radius: 6px; background: transparent; cursor: pointer; }

    /* GACHA BANNER / STATS */
    .gacha-banner { background: #182234; border: 1px dashed #38bdf8; padding: 14px; border-radius: 10px; margin-top: 16px; display: flex; justify-content: space-between; align-items: center; }
    .gems-badge { background: #0284c7; padding: 4px 10px; border-radius: 20px; font-size: 0.85rem; font-weight: bold; }
  </style>
</head>
<body>

  <header>
    <h1>✨ Gacha Character Engine (Vanilla JS)</h1>
    <p class="subtitle">Motor modular de capas 2D sobre HTML5 Canvas con paletas de color dinámicas</p>
  </header>

  <div class="app-container">
    <!-- VISTA PREVIA DEL AVATAR -->
    <div class="preview-col">
      <canvas id="avatarCanvas" width="360" height="420"></canvas>
      <div class="action-row">
        <button class="btn btn-secondary" onclick="randomizeCharacter()">🎲 Aleatorio</button>
        <button class="btn btn-primary" onclick="downloadAvatar()">💾 Exportar PNG</button>
      </div>

      <div class="gacha-banner" style="width: 100%;">
        <div>
          <strong style="color: #38bdf8;">Tirada Gacha</strong>
          <p style="font-size: 0.8rem; color: #94a3b8;">Desbloquea accesorios raros</p>
        </div>
        <button class="btn btn-primary" style="flex: 0 0 auto;" onclick="pullGacha()">Tirar (100 💎)</button>
      </div>
      <p id="gachaResult" style="font-size: 0.85rem; margin-top: 10px; color: #facc15; font-weight: bold;"></p>
    </div>

    <!-- CONTROLES DE EDICIÓN -->
    <div class="controls-col">
      <h2 class="section-title">1. Expresión y Pose</h2>
      <div class="control-grid">
        <div class="control-group">
          <label for="poseSelect">Pose Corporal:</label>
          <select id="poseSelect" onchange="updateCharacter('pose', parseInt(this.value))">
            <option value="0">Normal (Reposo)</option>
            <option value="1">Saludo (Wave)</option>
            <option value="2">Paz y Amor (V)</option>
            <option value="3">Confiado (Cintura)</option>
            <option value="4">Tímido (Kawaii)</option>
          </select>
        </div>
        <div class="control-group">
          <label for="exprSelect">Expresión Facial:</label>
          <select id="exprSelect" onchange="updateCharacter('expression', parseInt(this.value))">
            <option value="0">Feliz / Sonrisa</option>
            <option value="1">Ilusionado / Brillos</option>
            <option value="2">Guiño coqueto</option>
            <option value="3">Puchero (Tsundere)</option>
            <option value="4">Sorprendido</option>
            <option value="5">Gatito (:3)</option>
          </select>
        </div>
      </div>

      <h2 class="section-title">2. Partes del Personaje (Layers)</h2>
      <div class="control-grid">
        <div class="control-group">
          <label for="frontHairSelect">Flequillo Frontal:</label>
          <select id="frontHairSelect" onchange="updateCharacter('frontHair', this.value)">
            <option value="straight">Recto clásico</option>
            <option value="spiky">Picos Anime</option>
            <option value="soft">Suave ondulado</option>
          </select>
        </div>
        <div class="control-group">
          <label for="backHairSelect">Cabello Posterior:</label>
          <select id="backHairSelect" onchange="updateCharacter('backHair', this.value)">
            <option value="short">Corto básico</option>
            <option value="twintails">Coletas dobles</option>
            <option value="flowing">Largo suelto</option>
            <option value="ponytail">Cola de caballo</option>
          </select>
        </div>
        <div class="control-group">
          <label for="topSelect">Ropa Superior:</label>
          <select id="topSelect" onchange="updateCharacter('top', this.value)">
            <option value="tee">Camiseta Casual</option>
            <option value="hoodie">Sudadera con capucha</option>
            <option value="school">Uniforme Escolar</option>
          </select>
        </div>
        <div class="control-group">
          <label for="bottomSelect">Ropa Inferior:</label>
          <select id="bottomSelect" onchange="updateCharacter('bottom', this.value)">
            <option value="skirt">Falda de pliegues</option>
            <option value="shorts">Shorts</option>
            <option value="pants">Pantalones</option>
          </select>
        </div>
        <div class="control-group">
          <label for="shoesSelect">Calzado:</label>
          <select id="shoesSelect" onchange="updateCharacter('shoes', this.value)">
            <option value="sneakers">Zapatillas</option>
            <option value="maryjane">Zapatos Mary Jane</option>
            <option value="boots">Botas altas</option>
          </select>
        </div>
        <div class="control-group">
          <label for="headAccSelect">Accesorio Cabeza:</label>
          <select id="headAccSelect" onchange="updateCharacter('headAccessory', this.value)">
            <option value="none">Ninguno</option>
            <option value="catears">Orejas de gato</option>
            <option value="halo">Aureola</option>
            <option value="horns">Cuernos</option>
            <option value="bow">Lazo</option>
          </select>
        </div>
      </div>

      <h2 class="section-title">3. Tintado y Paletas de Color (Hex)</h2>
      <div class="control-grid">
        <div class="control-group">
          <label>Piel:</label>
          <input type="color" id="skinColor" value="#ffdab9" onchange="updateCharacter('skinColor', this.value)">
        </div>
        <div class="control-group">
          <label>Cabello:</label>
          <input type="color" id="hairColor" value="#ec4899" onchange="updateCharacter('hairColor', this.value)">
        </div>
        <div class="control-group">
          <label>Ojos:</label>
          <input type="color" id="eyeColor" value="#8b5cf6" onchange="updateCharacter('eyeColor', this.value)">
        </div>
        <div class="control-group">
          <label>Ropa Superior:</label>
          <input type="color" id="topColor" value="#8b5cf6" onchange="updateCharacter('topColor', this.value)">
        </div>
        <div class="control-group">
          <label>Ropa Inferior:</label>
          <input type="color" id="bottomColor" value="#f43f5e" onchange="updateCharacter('bottomColor', this.value)">
        </div>
        <div class="control-group">
          <label>Accesorios:</label>
          <input type="color" id="accessoryColor" value="#fbbf24" onchange="updateCharacter('accessoryColor', this.value)">
        </div>
      </div>
    </div>
  </div>

  <script>
    /**
     * =========================================================================
     * ARQUITECTURA DEL MOTOR DE JUEGO 2D (GACHA ENGINE)
     * =========================================================================
     * Cada personaje es un objeto de estado que almacena índices, tipos de capas y colores.
     * El renderizador procesa las capas en estricto orden Z (Back to Front):
     * 1. Cabello Trasero
     * 2. Piernas y Calzado
     * 3. Ropa Inferior
     * 4. Torso y Ropa Superior
     * 5. Brazo Trasero (según pose)
     * 6. Cabeza, Rostro, Ojos, Expresión
     * 7. Cabello Frontal
     * 8. Accesorios de Cabeza
     * 9. Brazo Frontal / Props
     */

    // ESTADO REACTIVO DEL PERSONAJE
    const character = {
      pose: 0,
      expression: 0,
      skinColor: '#ffdab9',
      hairColor: '#ec4899',
      eyeColor: '#8b5cf6',
      topColor: '#8b5cf6',
      bottomColor: '#f43f5e',
      shoesColor: '#1e293b',
      accessoryColor: '#fbbf24',
      frontHair: 'straight',
      backHair: 'twintails',
      top: 'school',
      bottom: 'skirt',
      shoes: 'maryjane',
      headAccessory: 'catears'
    };

    const canvas = document.getElementById('avatarCanvas');
    const ctx = canvas.getContext('2d');

    // FUNCIÓN PRINCIPAL DE RENDERIZADO
    function render() {
      // 1. Limpiar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      // Centrar el personaje en el canvas (pivote en pies)
      ctx.translate(canvas.width / 2, canvas.height * 0.88);

      // Sombra en el suelo
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.ellipse(0, 5, 55, 14, 0, 0, Math.PI * 2);
      ctx.fill();

      // RENDER POR CAPAS (Z-BUFFER MANUAL)
      drawBackHair();
      drawLegsAndShoes();
      drawBottom();
      drawTorso();
      drawTop();
      drawArms('back');
      drawHeadAndFace();
      drawFrontHair();
      drawHeadAccessory();
      drawArms('front');

      ctx.restore();
    }

    // CAPA 1: CABELLO TRASERO
    function drawBackHair() {
      ctx.save();
      ctx.fillStyle = character.hairColor;
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.5;

      if (character.backHair === 'twintails') {
        // Coletas dobles
        ctx.beginPath();
        ctx.moveTo(-45, -140);
        ctx.bezierCurveTo(-85, -130, -95, -70, -75, -20);
        ctx.bezierCurveTo(-70, -10, -55, -20, -55, -40);
        ctx.bezierCurveTo(-55, -70, -40, -110, -35, -135);
        ctx.closePath();
        ctx.fill(); ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(45, -140);
        ctx.bezierCurveTo(85, -130, 95, -70, 75, -20);
        ctx.bezierCurveTo(70, -10, 55, -20, 55, -40);
        ctx.bezierCurveTo(55, -70, 40, -110, 35, -135);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
      } else if (character.backHair === 'flowing') {
        // Largo ondulado
        ctx.beginPath();
        ctx.moveTo(-60, -140);
        ctx.bezierCurveTo(-85, -100, -80, -30, -60, 10);
        ctx.bezierCurveTo(-30, 25, 30, 25, 60, 10);
        ctx.bezierCurveTo(80, -30, 85, -100, 60, -140);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
      } else {
        // Corto básico
        ctx.beginPath();
        ctx.arc(0, -140, 60, Math.PI, 0, false);
        ctx.lineTo(55, -100);
        ctx.lineTo(-55, -100);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
      }
      ctx.restore();
    }

    // CAPA 2: PIERNAS Y CALZADO
    function drawLegsAndShoes() {
      ctx.save();
      ctx.fillStyle = character.skinColor;
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.5;

      // Piernas
      ctx.beginPath(); ctx.roundRect(-22, -50, 16, 46, 6); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.roundRect(6, -50, 16, 46, 6); ctx.fill(); ctx.stroke();

      // Zapatos
      ctx.fillStyle = character.shoesColor;
      if (character.shoes === 'boots') {
        ctx.beginPath(); ctx.roundRect(-24, -22, 20, 24, 4); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.roundRect(4, -22, 20, 24, 4); ctx.fill(); ctx.stroke();
      } else {
        ctx.beginPath(); ctx.roundRect(-24, -14, 20, 16, 5); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.roundRect(4, -14, 20, 16, 5); ctx.fill(); ctx.stroke();
      }
      ctx.restore();
    }

    // CAPA 3: PRENDA INFERIOR
    function drawBottom() {
      ctx.save();
      ctx.fillStyle = character.bottomColor;
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.5;

      if (character.bottom === 'skirt') {
        ctx.beginPath();
        ctx.moveTo(-28, -60);
        ctx.lineTo(28, -60);
        ctx.lineTo(38, -36);
        ctx.lineTo(-38, -36);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
      } else {
        ctx.beginPath(); ctx.roundRect(-26, -60, 52, 24, 4); ctx.fill(); ctx.stroke();
      }
      ctx.restore();
    }

    // CAPA 4: TORSO Y ROPA SUPERIOR
    function drawTorso() {
      ctx.save();
      ctx.fillStyle = character.skinColor;
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.roundRect(-24, -102, 48, 48, 6); ctx.fill(); ctx.stroke();
      ctx.restore();
    }

    function drawTop() {
      ctx.save();
      ctx.fillStyle = character.topColor;
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.5;

      ctx.beginPath(); ctx.roundRect(-25, -104, 50, 48, 6); ctx.fill(); ctx.stroke();

      if (character.top === 'school') {
        // Cuello marinero
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(-16, -104); ctx.lineTo(16, -104); ctx.lineTo(0, -82);
        ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    }

    // CAPA 5: BRAZOS (Pose dependiente)
    function drawArms(pass) {
      ctx.save();
      ctx.fillStyle = character.skinColor;
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.5;

      if (character.pose === 1) { // Wave
        if (pass === 'front') {
          // Brazo arriba saludando
          ctx.beginPath();
          ctx.moveTo(25, -95); ctx.lineTo(44, -135); ctx.lineTo(54, -130); ctx.lineTo(32, -88);
          ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.beginPath(); ctx.arc(48, -137, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        } else {
          ctx.beginPath(); ctx.roundRect(-36, -95, 12, 42, 6); ctx.fill(); ctx.stroke();
        }
      } else {
        // Normal
        if (pass === 'front') {
          ctx.beginPath(); ctx.roundRect(-36, -95, 12, 42, 6); ctx.fill(); ctx.stroke();
          ctx.beginPath(); ctx.roundRect(24, -95, 12, 42, 6); ctx.fill(); ctx.stroke();
        }
      }
      ctx.restore();
    }

    // CAPA 6: CABEZA Y ROSTRO
    function drawHeadAndFace() {
      ctx.save();
      ctx.fillStyle = character.skinColor;
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.5;

      // Cabeza redonda chibi
      ctx.beginPath();
      ctx.ellipse(0, -145, 52, 46, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();

      // Rubor
      ctx.fillStyle = 'rgba(244, 63, 94, 0.4)';
      ctx.beginPath(); ctx.ellipse(-28, -135, 9, 5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(28, -135, 9, 5, 0, 0, Math.PI * 2); ctx.fill();

      // Ojos
      drawEye(-24, -145);
      if (character.expression === 2) {
        // Guiño en ojo derecho
        ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 3.5;
        ctx.beginPath(); ctx.moveTo(14, -148); ctx.lineTo(26, -143); ctx.lineTo(36, -149); ctx.stroke();
      } else {
        drawEye(24, -145);
      }

      // Boca
      ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 2.5;
      if (character.expression === 1) {
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath(); ctx.arc(0, -130, 8, 0, Math.PI); ctx.closePath(); ctx.fill(); ctx.stroke();
      } else {
        ctx.beginPath(); ctx.arc(0, -132, 6, 0.1, Math.PI - 0.1); ctx.stroke();
      }

      ctx.restore();
    }

    function drawEye(x, y) {
      // Blanco
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.ellipse(x, y, 13, 17, 0, 0, Math.PI * 2); ctx.fill();
      // Iris con tinte
      ctx.fillStyle = character.eyeColor;
      ctx.beginPath(); ctx.ellipse(x, y + 1, 10, 14, 0, 0, Math.PI * 2); ctx.fill();
      // Pupila
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.ellipse(x, y + 1, 6, 9, 0, 0, Math.PI * 2); ctx.fill();
      // Brillo anime
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(x - 3, y - 4, 4, 0, Math.PI * 2); ctx.fill();
      // Pestaña
      ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.arc(x, y - 4, 13, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
    }

    // CAPA 7: CABELLO FRONTAL (Flequillo)
    function drawFrontHair() {
      ctx.save();
      ctx.fillStyle = character.hairColor;
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.moveTo(-54, -145);
      ctx.lineTo(-46, -118); ctx.lineTo(-40, -135);
      ctx.lineTo(-30, -155); ctx.lineTo(-18, -138);
      ctx.lineTo(0, -150); ctx.lineTo(18, -138);
      ctx.lineTo(30, -155); ctx.lineTo(40, -135);
      ctx.lineTo(46, -118); ctx.lineTo(54, -145);
      ctx.bezierCurveTo(45, -195, -45, -195, -54, -145);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.restore();
    }

    // CAPA 8: ACCESORIOS DE CABEZA
    function drawHeadAccessory() {
      if (character.headAccessory === 'catears') {
        ctx.save();
        ctx.fillStyle = character.accessoryColor;
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2.5;

        // Oreja Izquierda
        ctx.beginPath(); ctx.moveTo(-45, -172); ctx.lineTo(-48, -205); ctx.lineTo(-20, -182); ctx.closePath(); ctx.fill(); ctx.stroke();
        // Oreja Derecha
        ctx.beginPath(); ctx.moveTo(45, -172); ctx.lineTo(48, -205); ctx.lineTo(20, -182); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.restore();
      }
    }

    // ACTUALIZADOR DE ESTADO REACTIVO
    function updateCharacter(prop, value) {
      character[prop] = value;
      render();
    }

    function randomizeCharacter() {
      const hairs = ['straight', 'spiky', 'soft'];
      const backHairs = ['short', 'twintails', 'flowing', 'ponytail'];
      const tops = ['tee', 'hoodie', 'school'];
      const colors = ['#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#1e293b'];

      character.pose = Math.floor(Math.random() * 5);
      character.expression = Math.floor(Math.random() * 6);
      character.frontHair = hairs[Math.floor(Math.random() * hairs.length)];
      character.backHair = backHairs[Math.floor(Math.random() * backHairs.length)];
      character.top = tops[Math.floor(Math.random() * tops.length)];
      character.hairColor = colors[Math.floor(Math.random() * colors.length)];
      character.topColor = colors[Math.floor(Math.random() * colors.length)];
      character.eyeColor = colors[Math.floor(Math.random() * colors.length)];

      render();
    }

    function downloadAvatar() {
      const link = document.createElement('a');
      link.download = 'gacha_avatar.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }

    // MINIJUEGO GACHA CON PROBABILIDADES
    function pullGacha() {
      const roll = Math.random() * 100;
      const resultEl = document.getElementById('gachaResult');
      if (roll < 3) {
        resultEl.innerText = '🌟 ¡LEGENDARIO! Desbloqueaste la Katana Astral!';
        resultEl.style.color = '#fbbf24';
      } else if (roll < 15) {
        resultEl.innerText = '✨ ¡ÉPICO! Desbloqueaste Aureola Celestial!';
        resultEl.style.color = '#c084fc';
      } else if (roll < 40) {
        resultEl.innerText = '🔷 ¡RARO! Desbloqueaste Orejitas de Gato!';
        resultEl.style.color = '#38bdf8';
      } else {
        resultEl.innerText = '⚪ Común: Lazo decorativo obtenido.';
        resultEl.style.color = '#94a3b8';
      }
    }

    // Inicializar primer dibujo
    render();
  </script>
</body>
</html>`;

export const SPRITE_INTEGRATION_GUIDE = `# 🎮 Guía de Arquitectura de Sprites 2D para Gacha Life (Vanilla JS & HTML5 Canvas)

## 1. Estructura de Capas (Z-Index / Render Pipeline)
En videojuegos estilo Gacha Club / Gacha Life, cada avatar se descompone en **capas 2D independientes** con un canal alfa (transparencia PNG). El orden secuencial estricto en el que deben dibujarse en el Canvas es:

\`\`\`
[FONDO DEL ESCENARIO]
  1. back_hair.png        (Cabello posterior / coletas)
  2. wings_tail.png       (Alas, colas o capas)
  3. body_base.png        (Brazos traseros, torso, piernas)
  4. shoes.png            (Calzado)
  5. bottom.png           (Falda, shorts o pantalones)
  6. top.png              (Camisa, chaqueta, uniforme)
  7. head_base.png        (Cabeza, orejas, cuello)
  8. eyes.png             (Esclerótica, iris, brillo)
  9. mouth_expression.png (Boca y cejas según expresión)
 10. front_hair.png       (Flequillo y mechones)
 11. head_acc.png         (Gorros, lazos, cuernos)
 12. hand_prop.png        (Espada, varita, teléfono)
[BURBUJA DE DIÁLOGO / UI]
\`\`\`

---

## 2. Cómo conectar archivos PNG/Sprites reales

### Paso A: Cargar las imágenes en memoria (Preloader)
\`\`\`javascript
const assetManager = {
  images: {},
  async load(name, url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Necesario si usas servidor externo
      img.onload = () => {
        this.images[name] = img;
        resolve(img);
      };
      img.onerror = reject;
      img.src = url;
    });
  }
};

// Carga inicial
await Promise.all([
  assetManager.load('hair_back_01', '/sprites/hair/back_01.png'),
  assetManager.load('body_idle', '/sprites/body/idle.png'),
  assetManager.load('top_hoodie', '/sprites/clothes/top_hoodie.png'),
]);
\`\`\`

---

## 3. Tintado Dinámico de Colores Hex (Color Blending / Masking)
Para no tener que guardar 100 archivos PNG para cada color de pelo o ropa, se guarda el sprite en **escala de grises** o blanco/negro y se colorea dinámicamente usando un **Canvas Offscreen**:

\`\`\`javascript
/**
 * Colorea un sprite PNG con un color Hex dinámico
 */
function createTintedSprite(image, hexColor, width, height) {
  // Crear un canvas invisible en memoria
  const buffer = document.createElement('canvas');
  buffer.width = width;
  buffer.height = height;
  const bCtx = buffer.getContext('2d');

  // 1. Dibujar el sprite base
  bCtx.drawImage(image, 0, 0, width, height);

  // 2. Aplicar el modo de composición 'source-in' o 'multiply'
  // 'source-in' mantiene la silueta y transparencia original
  bCtx.globalCompositeOperation = 'source-in';
  bCtx.fillStyle = hexColor;
  bCtx.fillRect(0, 0, width, height);

  return buffer; // Ahora puedes hacer ctx.drawImage(buffer, x, y)
}
\`\`\`

---

## 4. Sprite Sheets (Atlas de Sprites)
Si todas las partes vienen en una sola imagen grande (*Texture Atlas*):
\`\`\`javascript
// drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
// sx, sy: Coordenadas de corte dentro del sprite sheet
// sw, sh: Ancho y alto del recorte
// dx, dy: Posición en la pantalla del juego
ctx.drawImage(spritesheet, 64 * frameIndex, 0, 64, 64, posX, posY, 128, 128);
\`\`\`

---

## 5. Poses y Expresiones
Para cambiar poses y expresiones sin redibujar todo:
1. Las coordenadas relativas de los brazos y ojos se definen como puntos de anclaje (*Sockets* o *Pivots*).
2. Cada pose es un conjunto de transformaciones 2D (\`ctx.translate()\` y \`ctx.rotate()\`) aplicadas al hueso correspondiente.
`;
