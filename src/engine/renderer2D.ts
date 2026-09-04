import { CharacterState } from '../types';

/**
 * Motor de Renderizado 2D para Avatares estilo Chibi/Gacha.
 * Renderiza capas ordenadas por Z-Index (Z-Buffer virtual):
 * 1. Cabello posterior
 * 2. Alas/Accesorios de espalda
 * 3. Cuerpo base (piernas, torso, brazos según pose)
 * 4. Calzado
 * 5. Prenda inferior (pantalones, falda)
 * 6. Prenda superior (camisa, sudadera, armadura)
 * 7. Rostro (ojos, rubor, boca, cejas según expresión)
 * 8. Flequillo / Cabello frontal
 * 9. Accesorios de cabeza (orejas, cuernos, lazos)
 * 10. Accesorios de mano / Props
 */

// Cache para imágenes cargadas si se usan sprites externos
const imageCache: Map<string, HTMLImageElement> = new Map();

export function loadSpriteImage(url: string): Promise<HTMLImageElement> {
  if (imageCache.has(url)) {
    return Promise.resolve(imageCache.get(url)!);
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageCache.set(url, img);
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Aplica tinte de color Hex a un canvas offscreen con un sprite PNG
 */
export function tintSprite(
  sourceImg: HTMLImageElement,
  tintHex: string,
  width: number,
  height: number
): HTMLCanvasElement {
  const offCanvas = document.createElement('canvas');
  offCanvas.width = width;
  offCanvas.height = height;
  const offCtx = offCanvas.getContext('2d');
  if (!offCtx) return offCanvas;

  // 1. Dibujar el sprite original en escala de grises o base
  offCtx.drawImage(sourceImg, 0, 0, width, height);

  // 2. Multiplicar con el color deseado
  offCtx.globalCompositeOperation = 'source-in';
  offCtx.fillStyle = tintHex;
  offCtx.fillRect(0, 0, width, height);

  return offCanvas;
}

/**
 * Función principal de renderizado en Canvas HTML5
 */
export function renderCharacterToCanvas(
  ctx: CanvasRenderingContext2D,
  char: CharacterState,
  options: {
    width: number;
    height: number;
    flip?: boolean;
    scale?: number;
    showShadow?: boolean;
  }
) {
  const { width, height, flip = false, scale = 1.0, showShadow = true } = options;

  ctx.save();
  ctx.clearRect(0, 0, width, height);

  // Centro de referencia (pivote inferior en los pies)
  const centerX = width / 2;
  const baseY = height * 0.88;

  ctx.translate(centerX, baseY);
  if (flip) {
    ctx.scale(-scale, scale);
  } else {
    ctx.scale(scale, scale);
  }

  // 0. Sombra en el suelo
  if (showShadow) {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(0, 5, 55, 14, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.fill();
    ctx.restore();
  }

  // Dimensiones base del chibi gacha (relativas al centro 0,0 en los pies)
  // Cabeza en Y aprox: -170 a -100
  // Torso en Y aprox: -105 a -50
  // Piernas en Y aprox: -50 a 0

  // 1. CABELLO TRASERO (Back Hair)
  drawBackHair(ctx, char);

  // 2. PIERNAS Y CUERPO INFERIOR (Legs & Shoes)
  drawLegs(ctx, char);
  drawShoes(ctx, char);
  drawBottomClothing(ctx, char);

  // 3. TORSO Y ROPA SUPERIOR
  drawTorso(ctx, char);
  drawTopClothing(ctx, char);

  // 4. BRAZOS SEGÚN POSE (Capa detrás o delante según posición)
  drawArms(ctx, char, 'back');

  // 5. CABEZA Y CUELLO
  drawNeckAndHead(ctx, char);

  // 6. ROSTRO (Ojos, cejas, rubor, boca)
  drawFaceDetails(ctx, char);

  // 7. CABELLO FRONTAL (Flequillo / Front bangs)
  drawFrontHair(ctx, char);

  // 8. ACCESORIOS DE CABEZA
  drawHeadAccessories(ctx, char);

  // 9. BRAZOS FRONTALES Y PROPS
  drawArms(ctx, char, 'front');
  drawHandProp(ctx, char);

  ctx.restore();
}

/**
 * Renderiza el cabello trasero
 */
function drawBackHair(ctx: CanvasRenderingContext2D, char: CharacterState) {
  const style = char.selectedItems.backHair;
  const color = char.hairColor;

  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = '#1e1b4b';
  ctx.lineWidth = 3;
  ctx.lineJoin = 'round';

  if (style === 'long-twin-tails') {
    // Coleta izquierda
    ctx.beginPath();
    ctx.moveTo(-45, -140);
    ctx.bezierCurveTo(-85, -130, -95, -70, -75, -20);
    ctx.bezierCurveTo(-70, -10, -55, -20, -55, -40);
    ctx.bezierCurveTo(-55, -70, -40, -110, -35, -135);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Coleta derecha
    ctx.beginPath();
    ctx.moveTo(45, -140);
    ctx.bezierCurveTo(85, -130, 95, -70, 75, -20);
    ctx.bezierCurveTo(70, -10, 55, -20, 55, -40);
    ctx.bezierCurveTo(55, -70, 40, -110, 35, -135);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (style === 'long-flowing') {
    // Cabello largo suelto ondulado
    ctx.beginPath();
    ctx.moveTo(-60, -140);
    ctx.bezierCurveTo(-85, -100, -80, -30, -60, 10);
    ctx.bezierCurveTo(-30, 25, 30, 25, 60, 10);
    ctx.bezierCurveTo(80, -30, 85, -100, 60, -140);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (style === 'ponytail') {
    // Cola de caballo alta
    ctx.beginPath();
    ctx.moveTo(15, -165);
    ctx.bezierCurveTo(70, -190, 85, -130, 70, -60);
    ctx.bezierCurveTo(60, -40, 50, -60, 45, -80);
    ctx.bezierCurveTo(35, -110, 25, -140, 15, -165);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (style === 'spiky-anime') {
    // Picos de pelo anime
    ctx.beginPath();
    ctx.moveTo(-50, -140);
    ctx.lineTo(-75, -160);
    ctx.lineTo(-65, -130);
    ctx.lineTo(-85, -120);
    ctx.lineTo(-60, -100);
    ctx.lineTo(-75, -75);
    ctx.lineTo(-45, -70);
    ctx.lineTo(45, -70);
    ctx.lineTo(75, -75);
    ctx.lineTo(60, -100);
    ctx.lineTo(85, -120);
    ctx.lineTo(65, -130);
    ctx.lineTo(75, -160);
    ctx.lineTo(50, -140);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else {
    // Estilo corto redondeado básico por detrás
    ctx.beginPath();
    ctx.arc(0, -140, 62, Math.PI, 0, false);
    ctx.lineTo(55, -100);
    ctx.lineTo(-55, -100);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Piernas del avatar
 */
function drawLegs(ctx: CanvasRenderingContext2D, char: CharacterState) {
  ctx.save();
  ctx.fillStyle = char.skinColor;
  ctx.strokeStyle = '#1e1b4b';
  ctx.lineWidth = 2.5;

  const pose = char.pose;

  if (pose === 4) {
    // Pose de batalla: piernas abiertas
    // Pierna izquierda
    ctx.beginPath();
    ctx.roundRect(-30, -50, 16, 46, 7);
    ctx.fill();
    ctx.stroke();

    // Pierna derecha
    ctx.beginPath();
    ctx.roundRect(14, -50, 16, 46, 7);
    ctx.fill();
    ctx.stroke();
  } else if (pose === 5) {
    // Shy: piernas ligeramente juntas hacia adentro
    ctx.beginPath();
    ctx.roundRect(-20, -50, 15, 46, 6);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.roundRect(5, -50, 15, 46, 6);
    ctx.fill();
    ctx.stroke();
  } else {
    // Normal / Idle
    ctx.beginPath();
    ctx.roundRect(-22, -50, 16, 46, 6);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.roundRect(6, -50, 16, 46, 6);
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Zapatos / Calzado
 */
function drawShoes(ctx: CanvasRenderingContext2D, char: CharacterState) {
  const style = char.selectedItems.shoes;
  const color = char.shoesColor;

  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = '#1e1b4b';
  ctx.lineWidth = 2.5;

  const pose = char.pose;
  const leftX = pose === 4 ? -32 : pose === 5 ? -22 : -24;
  const rightX = pose === 4 ? 12 : pose === 5 ? 3 : 4;

  if (style === 'boots') {
    // Botas altas
    ctx.beginPath();
    ctx.roundRect(leftX, -22, 20, 24, [4, 4, 8, 8]);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.roundRect(rightX, -22, 20, 24, [4, 4, 8, 8]);
    ctx.fill();
    ctx.stroke();

    // Suela blanca
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(leftX + 1, -4, 18, 4);
    ctx.fillRect(rightX + 1, -4, 18, 4);
  } else if (style === 'mary-jane') {
    // Zapatos escolares Mary Jane
    ctx.beginPath();
    ctx.roundRect(leftX, -12, 19, 14, 5);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.roundRect(rightX, -12, 19, 14, 5);
    ctx.fill();
    ctx.stroke();

    // Calcetines blancos
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(leftX + 2, -24, 15, 13);
    ctx.fillRect(rightX + 2, -24, 15, 13);
  } else {
    // Sneakers deportivas estándar
    ctx.beginPath();
    ctx.roundRect(leftX, -14, 20, 16, [4, 4, 8, 8]);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.roundRect(rightX, -14, 20, 16, [4, 4, 8, 8]);
    ctx.fill();
    ctx.stroke();

    // Detalle franja blanca
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(leftX + 2, -5, 16, 4);
    ctx.fillRect(rightX + 2, -5, 16, 4);
  }

  ctx.restore();
}

/**
 * Prenda inferior (Pantalón o falda)
 */
function drawBottomClothing(ctx: CanvasRenderingContext2D, char: CharacterState) {
  const style = char.selectedItems.bottom;
  const color = char.bottomColor;

  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = '#1e1b4b';
  ctx.lineWidth = 2.5;

  if (style === 'pleated-skirt') {
    // Falda plisada chibi
    ctx.beginPath();
    ctx.moveTo(-28, -60);
    ctx.lineTo(28, -60);
    ctx.lineTo(38, -36);
    ctx.lineTo(-38, -36);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Líneas de pliegues
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.moveTo(-16, -60);
    ctx.lineTo(-22, -36);
    ctx.moveTo(0, -60);
    ctx.lineTo(0, -36);
    ctx.moveTo(16, -60);
    ctx.lineTo(22, -36);
    ctx.stroke();
  } else if (style === 'denim-shorts') {
    // Shorts
    ctx.beginPath();
    ctx.roundRect(-26, -60, 52, 22, [2, 2, 4, 4]);
    ctx.fill();
    ctx.stroke();
    // Hendidura central
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(-1.5, -46, 3, 8);
  } else {
    // Pantalones largos
    ctx.beginPath();
    ctx.roundRect(-26, -60, 24, 44, 4);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.roundRect(2, -60, 24, 44, 4);
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Torso base
 */
function drawTorso(ctx: CanvasRenderingContext2D, char: CharacterState) {
  ctx.save();
  ctx.fillStyle = char.skinColor;
  ctx.strokeStyle = '#1e1b4b';
  ctx.lineWidth = 2.5;

  ctx.beginPath();
  ctx.roundRect(-24, -102, 48, 48, [8, 8, 4, 4]);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

/**
 * Ropa superior (Top)
 */
function drawTopClothing(ctx: CanvasRenderingContext2D, char: CharacterState) {
  const style = char.selectedItems.top;
  const color = char.topColor;

  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = '#1e1b4b';
  ctx.lineWidth = 2.5;

  if (style === 'hoodie') {
    // Sudadera con capucha y bolsillo canguro
    ctx.beginPath();
    ctx.roundRect(-26, -104, 52, 48, [10, 10, 6, 6]);
    ctx.fill();
    ctx.stroke();

    // Bolsillo canguro
    ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
    ctx.beginPath();
    ctx.roundRect(-16, -75, 32, 16, 4);
    ctx.fill();
    ctx.stroke();

    // Cordones de la capucha
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-6, -96);
    ctx.lineTo(-6, -82);
    ctx.moveTo(6, -96);
    ctx.lineTo(6, -82);
    ctx.stroke();
  } else if (style === 'school-uniform') {
    // Uniforme escolar con cuello marinero / blazer
    ctx.beginPath();
    ctx.roundRect(-25, -104, 50, 48, [8, 8, 4, 4]);
    ctx.fill();
    ctx.stroke();

    // Cuello en V blanco
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-16, -104);
    ctx.lineTo(16, -104);
    ctx.lineTo(0, -82);
    ctx.closePath();
    ctx.fill();

    // Lazo o corbata roja
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.ellipse(0, -84, 5, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-6, -84);
    ctx.lineTo(-12, -74);
    ctx.lineTo(0, -78);
    ctx.lineTo(12, -74);
    ctx.lineTo(6, -84);
    ctx.closePath();
    ctx.fill();
  } else if (style === 'magical-top') {
    // Top mágico con detalles estelares
    ctx.beginPath();
    ctx.roundRect(-25, -104, 50, 46, [8, 8, 4, 4]);
    ctx.fill();
    ctx.stroke();

    // Ribete dorado
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-25, -85);
    ctx.lineTo(0, -75);
    ctx.lineTo(25, -85);
    ctx.stroke();

    // Gema estelar en el pecho
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(0, -90, 5, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Camiseta casual básica
    ctx.beginPath();
    ctx.roundRect(-25, -104, 50, 48, [8, 8, 4, 4]);
    ctx.fill();
    ctx.stroke();

    // Cuello redondo
    ctx.fillStyle = char.skinColor;
    ctx.beginPath();
    ctx.arc(0, -104, 12, 0, Math.PI);
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Cuello y Cabeza Chibi
 */
function drawNeckAndHead(ctx: CanvasRenderingContext2D, char: CharacterState) {
  ctx.save();
  ctx.fillStyle = char.skinColor;
  ctx.strokeStyle = '#1e1b4b';
  ctx.lineWidth = 2.5;

  // Cuello
  ctx.beginPath();
  ctx.fillRect(-8, -112, 16, 12);
  ctx.strokeRect(-8, -112, 16, 12);

  // Cabeza chibi redonda adorable
  ctx.beginPath();
  // Cabeza con forma de pera invertida/mejillas tiernas
  ctx.ellipse(0, -145, 52, 46, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Orejas
  ctx.beginPath();
  ctx.arc(-52, -142, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(52, -142, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

/**
 * Detalles faciales: Ojos, expresión, rubor, boca
 */
function drawFaceDetails(ctx: CanvasRenderingContext2D, char: CharacterState) {
  const expr = char.expression;
  const eyeColor = char.eyeColor;

  ctx.save();

  // 1. Rubor (Blush) en mejillas
  const blushAlpha = char.blushIntensity ?? 0.6;
  if (blushAlpha > 0.05 || expr === 1 || expr === 5) {
    ctx.fillStyle = `rgba(244, 63, 94, ${Math.min(1, blushAlpha + (expr === 1 ? 0.3 : 0))})`;
    ctx.beginPath();
    ctx.ellipse(-28, -135, 9, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(28, -135, 9, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. Ojos según estilo y expresión
  // Expresiones:
  // 0: Normal / Feliz
  // 1: Sparkly / Ilusionado
  // 2: Guiño (Wink)
  // 3: Tsundere / Pout
  // 4: Sorprendido (Wide open)
  // 5: Smug / Gato
  // 6: Somnoliento (-_-)

  if (expr === 6) {
    // Somnoliento: líneas curvadas horizontales
    ctx.strokeStyle = '#1e1b4b';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(-24, -146, 12, 0.2, Math.PI - 0.2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(24, -146, 12, 0.2, Math.PI - 0.2);
    ctx.stroke();
  } else if (expr === 2) {
    // Guiño: ojo izquierdo abierto, ojo derecho guiñado (>)
    drawSingleEye(ctx, -24, -145, eyeColor, false, expr);
    ctx.strokeStyle = '#1e1b4b';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(14, -148);
    ctx.lineTo(26, -143);
    ctx.lineTo(36, -149);
    ctx.stroke();
  } else {
    // Ambos ojos dibujados con la expresión correspondiente
    drawSingleEye(ctx, -24, -145, eyeColor, false, expr);
    drawSingleEye(ctx, 24, -145, eyeColor, true, expr);
  }

  // 3. Cejas según emoción
  ctx.strokeStyle = '#1e1b4b';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';

  if (expr === 3) {
    // Tsundere / Enojado: cejas inclinadas hacia abajo
    ctx.beginPath();
    ctx.moveTo(-34, -162);
    ctx.lineTo(-15, -157);
    ctx.moveTo(34, -162);
    ctx.lineTo(15, -157);
    ctx.stroke();
  } else if (expr === 4) {
    // Sorprendido: cejas altas arqueadas
    ctx.beginPath();
    ctx.arc(-24, -158, 10, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(24, -158, 10, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
  } else {
    // Normal / Suaves
    ctx.beginPath();
    ctx.arc(-24, -158, 10, Math.PI * 1.2, Math.PI * 1.8);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(24, -158, 10, Math.PI * 1.2, Math.PI * 1.8);
    ctx.stroke();
  }

  // 4. Boca
  ctx.fillStyle = '#f43f5e';
  ctx.strokeStyle = '#1e1b4b';
  ctx.lineWidth = 2.5;

  if (expr === 1) {
    // Sonrisa abierta grande feliz
    ctx.beginPath();
    ctx.arc(0, -130, 8, 0, Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (expr === 4) {
    // Boca de sorpresa 'O'
    ctx.beginPath();
    ctx.ellipse(0, -129, 5, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (expr === 5) {
    // Boca de gato ' :3 '
    ctx.beginPath();
    ctx.arc(-4, -131, 4, 0, Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(4, -131, 4, 0, Math.PI);
    ctx.stroke();
  } else if (expr === 3) {
    // Pout / puchero
    ctx.beginPath();
    ctx.arc(0, -127, 6, Math.PI, 0);
    ctx.stroke();
  } else {
    // Sonrisa suave
    ctx.beginPath();
    ctx.arc(0, -132, 6, 0.1, Math.PI - 0.1);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Renderiza un solo ojo anime detallado con reflejos
 */
function drawSingleEye(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  _isRight: boolean,
  expr: number
) {
  ctx.save();

  // Esclerótica blanca
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(x, y, 13, 17, 0, 0, Math.PI * 2);
  ctx.fill();

  // Iris coloreado
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y + 1, 10, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pupila oscura profunda
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.ellipse(x, y + 1, 6, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  // Reflejo principal grande de luz (Anime shine)
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x - 3, y - 4, 4, 0, Math.PI * 2);
  ctx.fill();

  // Reflejo secundario pequeño
  ctx.beginPath();
  ctx.arc(x + 3, y + 4, 2, 0, Math.PI * 2);
  ctx.fill();

  if (expr === 1) {
    // Estrellitas adicionales para expresión "Sparkly"
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(x, y + 2, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Pestaña superior oscura
  ctx.strokeStyle = '#1e1b4b';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(x, y - 4, 13, Math.PI * 1.1, Math.PI * 1.9);
  ctx.stroke();

  ctx.restore();
}

/**
 * Cabello frontal (Flequillo y mechones)
 */
function drawFrontHair(ctx: CanvasRenderingContext2D, char: CharacterState) {
  const style = char.selectedItems.frontHair;
  const color = char.hairColor;

  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = '#1e1b4b';
  ctx.lineWidth = 3;
  ctx.lineJoin = 'round';

  if (style === 'bangs-straight') {
    // Flequillo recto clásico anime con mechones laterales
    ctx.beginPath();
    ctx.moveTo(-54, -145);
    ctx.lineTo(-46, -118);
    ctx.lineTo(-40, -135);
    ctx.lineTo(-30, -155);
    ctx.lineTo(-18, -138);
    ctx.lineTo(-6, -154);
    ctx.lineTo(6, -138);
    ctx.lineTo(18, -154);
    ctx.lineTo(30, -138);
    ctx.lineTo(40, -135);
    ctx.lineTo(46, -118);
    ctx.lineTo(54, -145);
    ctx.bezierCurveTo(45, -195, -45, -195, -54, -145);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (style === 'anime-spikes') {
    // Flequillo con picos pronunciados
    ctx.beginPath();
    ctx.moveTo(-52, -140);
    ctx.lineTo(-38, -125);
    ctx.lineTo(-32, -148);
    ctx.lineTo(-12, -130);
    ctx.lineTo(-6, -150);
    ctx.lineTo(15, -128);
    ctx.lineTo(25, -146);
    ctx.lineTo(40, -125);
    ctx.lineTo(52, -140);
    ctx.bezierCurveTo(45, -195, -45, -195, -52, -140);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else {
    // Flequillo suave redondeado hacia los lados
    ctx.beginPath();
    ctx.moveTo(-52, -140);
    ctx.bezierCurveTo(-45, -120, -30, -130, -20, -148);
    ctx.bezierCurveTo(-10, -132, 10, -132, 20, -148);
    ctx.bezierCurveTo(30, -130, 45, -120, 52, -140);
    ctx.bezierCurveTo(45, -195, -45, -195, -52, -140);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // Brillo suave superior del cabello (Hair Halo)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, -170, 32, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();

  ctx.restore();
}

/**
 * Accesorios de Cabeza (Orejas de gato, cuernos, lazos, corona)
 */
function drawHeadAccessories(ctx: CanvasRenderingContext2D, char: CharacterState) {
  const acc = char.selectedItems.headAccessory;
  const color = char.accessoryColor;

  if (!acc || acc === 'none') return;

  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = '#1e1b4b';
  ctx.lineWidth = 3;

  if (acc === 'cat-ears') {
    // Orejas de gato adorables
    // Oreja izquierda
    ctx.beginPath();
    ctx.moveTo(-45, -172);
    ctx.lineTo(-48, -205);
    ctx.lineTo(-20, -182);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Interior rosado
    ctx.fillStyle = '#fda4af';
    ctx.beginPath();
    ctx.moveTo(-42, -175);
    ctx.lineTo(-44, -198);
    ctx.lineTo(-24, -182);
    ctx.closePath();
    ctx.fill();

    // Oreja derecha
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(45, -172);
    ctx.lineTo(48, -205);
    ctx.lineTo(20, -182);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Interior rosado
    ctx.fillStyle = '#fda4af';
    ctx.beginPath();
    ctx.moveTo(42, -175);
    ctx.lineTo(44, -198);
    ctx.lineTo(24, -182);
    ctx.closePath();
    ctx.fill();
  } else if (acc === 'angel-halo') {
    // Aureola de ángel flotante dorada
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(0, -210, 30, 8, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.stroke();
  } else if (acc === 'devil-horns') {
    // Cuernos de demonio
    ctx.beginPath();
    ctx.moveTo(-35, -175);
    ctx.quadraticCurveTo(-45, -205, -30, -210);
    ctx.quadraticCurveTo(-22, -195, -20, -178);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(35, -175);
    ctx.quadraticCurveTo(45, -205, 30, -210);
    ctx.quadraticCurveTo(22, -195, 20, -178);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (acc === 'ribbon-bow') {
    // Lazo grande
    ctx.beginPath();
    ctx.ellipse(-16, -182, 14, 8, -Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(16, -182, 14, 8, Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Centro del lazo
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, -182, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (acc === 'star-crown') {
    // Corona estelar dorada
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(-25, -185);
    ctx.lineTo(-30, -202);
    ctx.lineTo(-12, -192);
    ctx.lineTo(0, -210);
    ctx.lineTo(12, -192);
    ctx.lineTo(30, -202);
    ctx.lineTo(25, -185);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Brazos del personaje según pose
 * pass: 'back' (brazo detrás del cuerpo) o 'front' (brazo delante)
 */
function drawArms(
  ctx: CanvasRenderingContext2D,
  char: CharacterState,
  pass: 'back' | 'front'
) {
  const pose = char.pose;
  ctx.save();
  ctx.fillStyle = char.skinColor;
  ctx.strokeStyle = '#1e1b4b';
  ctx.lineWidth = 2.5;

  if (pose === 1) {
    // Waving: brazo derecho saludando arriba
    if (pass === 'front') {
      // Brazo derecho levantado
      ctx.beginPath();
      ctx.moveTo(25, -95);
      ctx.lineTo(44, -135);
      ctx.lineTo(54, -130);
      ctx.lineTo(32, -88);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Mano derecha abierta
      ctx.beginPath();
      ctx.arc(48, -137, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else {
      // Brazo izquierdo en reposo
      ctx.beginPath();
      ctx.roundRect(-36, -95, 12, 42, 6);
      ctx.fill();
      ctx.stroke();
    }
  } else if (pose === 2) {
    // Peace sign: Brazo derecho con mano en V
    if (pass === 'front') {
      ctx.beginPath();
      ctx.moveTo(25, -95);
      ctx.lineTo(40, -115);
      ctx.lineTo(48, -110);
      ctx.lineTo(30, -88);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Mano en paz
      ctx.beginPath();
      ctx.arc(43, -118, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Dedos en V
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(41, -122);
      ctx.lineTo(38, -132);
      ctx.moveTo(45, -122);
      ctx.lineTo(49, -132);
      ctx.stroke();
    } else {
      // Brazo izquierdo en la cintura
      ctx.beginPath();
      ctx.moveTo(-25, -95);
      ctx.lineTo(-38, -80);
      ctx.lineTo(-30, -75);
      ctx.lineTo(-20, -88);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  } else if (pose === 3) {
    // Confident / Manos en jarras / caderas
    if (pass === 'front') {
      // Ambos brazos a los costados curvados
      ctx.beginPath();
      ctx.moveTo(-25, -95);
      ctx.lineTo(-40, -78);
      ctx.lineTo(-32, -74);
      ctx.lineTo(-20, -88);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(25, -95);
      ctx.lineTo(40, -78);
      ctx.lineTo(32, -74);
      ctx.lineTo(20, -88);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  } else if (pose === 5) {
    // Shy / Kawaii: Manos juntas al frente del pecho
    if (pass === 'front') {
      ctx.beginPath();
      ctx.moveTo(-25, -95);
      ctx.lineTo(-8, -78);
      ctx.lineTo(8, -78);
      ctx.lineTo(25, -95);
      ctx.lineTo(18, -100);
      ctx.lineTo(0, -84);
      ctx.lineTo(-18, -100);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Manitas juntas
      ctx.beginPath();
      ctx.arc(0, -78, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  } else {
    // Idle normal
    if (pass === 'front') {
      ctx.beginPath();
      ctx.roundRect(-36, -95, 12, 42, 6);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.roundRect(24, -95, 12, 42, 6);
      ctx.fill();
      ctx.stroke();
    }
  }

  ctx.restore();
}

/**
 * Prop / Objeto en mano (Boba, Varita mágica, Espada)
 */
function drawHandProp(ctx: CanvasRenderingContext2D, char: CharacterState) {
  const prop = char.selectedItems.handAccessory;
  if (!prop || prop === 'none') return;

  ctx.save();
  ctx.strokeStyle = '#1e1b4b';
  ctx.lineWidth = 2.5;

  if (prop === 'boba-drink') {
    // Vaso de té Boba tierno
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.roundRect(28, -85, 16, 22, [2, 2, 4, 4]);
    ctx.fill();
    ctx.stroke();

    // Perlas de tapioca
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.arc(33, -68, 2.5, 0, Math.PI * 2);
    ctx.arc(39, -68, 2.5, 0, Math.PI * 2);
    ctx.arc(36, -73, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Pajita / Popote
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(36, -85);
    ctx.lineTo(36, -94);
    ctx.stroke();
  } else if (prop === 'magic-wand') {
    // Varita mágica con estrella brillante
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(28, -60);
    ctx.lineTo(44, -100);
    ctx.stroke();

    // Estrella en la punta
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(44, -100, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (prop === 'pixel-sword') {
    // Espada anime
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(28, -65);
    ctx.lineTo(40, -115);
    ctx.lineTo(46, -112);
    ctx.lineTo(32, -62);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Mango
    ctx.fillStyle = '#78350f';
    ctx.fillRect(25, -60, 6, 12);
  }

  ctx.restore();
}
