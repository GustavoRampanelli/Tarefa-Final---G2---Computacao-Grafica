import * as THREE from 'three';

class MoonTexture {
  /**
   * Cria uma textura procedural de alta resolução para a Lua Cheia estilizada da pintura
   */
  static create(size = 1024) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Fundo lunar com gradiente suave
    const cx = size / 2;
    const cy = size / 2;
    const radius = size * 0.46;

    // Disco lunar base
    const grad = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.6, '#e2e8f0');
    grad.addColorStop(0.9, '#cbd5e1');
    grad.addColorStop(1, '#94a3b8');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    // Crateras e mares lunares estilizados (traços do desenho)
    const craters = [
      { x: cx - radius * 0.3, y: cy - radius * 0.2, r: radius * 0.22, color: 'rgba(100, 116, 139, 0.45)' },
      { x: cx + radius * 0.25, y: cy + radius * 0.15, r: radius * 0.28, color: 'rgba(71, 85, 105, 0.4)' },
      { x: cx - radius * 0.1, y: cy + radius * 0.35, r: radius * 0.2, color: 'rgba(100, 116, 139, 0.35)' },
      { x: cx + radius * 0.15, y: cy - radius * 0.35, r: radius * 0.18, color: 'rgba(71, 85, 105, 0.38)' },
      { x: cx + radius * 0.05, y: cy - radius * 0.05, r: radius * 0.14, color: 'rgba(51, 65, 85, 0.5)' },
      { x: cx - radius * 0.35, y: cy + radius * 0.2, r: radius * 0.12, color: 'rgba(100, 116, 139, 0.3)' }
    ];

    craters.forEach(c => {
      const cGrad = ctx.createRadialGradient(c.x, c.y, c.r * 0.1, c.x, c.y, c.r);
      cGrad.addColorStop(0, c.color);
      cGrad.addColorStop(0.8, c.color);
      cGrad.addColorStop(1, 'rgba(148, 163, 184, 0)');
      ctx.fillStyle = cGrad;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Anel externo de brilho difuso
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(cx, cy, radius - 3, 0, Math.PI * 2);
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }
}

export { MoonTexture };
