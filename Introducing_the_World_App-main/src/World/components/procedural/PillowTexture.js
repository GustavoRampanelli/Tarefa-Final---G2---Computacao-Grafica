import * as THREE from 'three';

/**
 * Gera texturas dinâmicas procedurais em Canvas para as almofadas,
 * reproduzindo fielmente as estampas da foto de referência ("Inovação", "Colaboração", etc.)
 */
class PillowTexture {
  static create(text, bgColorHex, textColorHex = '#ffffff') {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Fundo da almofada com gradiente sutil para efeito de tecido/volume
    ctx.fillStyle = bgColorHex;
    ctx.fillRect(0, 0, 512, 512);

    // Borda interna suave simulando costura/sombra do estofado
    const gradient = ctx.createRadialGradient(256, 256, 120, 256, 256, 256);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
    gradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.25)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    // Texto centralizado
    if (text) {
      ctx.save();
      ctx.translate(256, 256);
      ctx.fillStyle = textColorHex;
      ctx.font = '700 58px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 4;
      ctx.fillText(text, 0, 0);
      ctx.restore();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }
}

export { PillowTexture };
