import * as THREE from 'three';

class DesertGroundTexture {
  /**
   * Cria uma textura procedural de pedras/seixos e deserto com estilo pontilhista/gravura
   */
  static create(size = 1024) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Base terracota suave com tom areia/pedra
    ctx.fillStyle = '#c4a68a';
    ctx.fillRect(0, 0, size, size);

    // Grid de pedras/seixos arredondados desenhados proceduralmente
    const numStones = 400;
    for (let i = 0; i < numStones; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const rx = 8 + Math.random() * 22;
      const ry = 6 + Math.random() * 16;
      const rot = Math.random() * Math.PI;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);

      // Sombra da pedra
      ctx.fillStyle = 'rgba(60, 40, 50, 0.45)';
      ctx.beginPath();
      ctx.ellipse(2, 4, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();

      // Corpo da pedra com variação cromática
      const tones = ['#9e826b', '#b3957d', '#856a56', '#d6beaa', '#7a6052'];
      ctx.fillStyle = tones[Math.floor(Math.random() * tones.length)];
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();

      // Borda com textura de bico de pena
      ctx.strokeStyle = 'rgba(40, 25, 20, 0.5)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.restore();
    }

    // Granulação pontilhista (stippling) como na pintura
    for (let i = 0; i < 6000; i++) {
      const px = Math.random() * size;
      const py = Math.random() * size;
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(40, 20, 30, 0.25)' : 'rgba(255, 240, 220, 0.2)';
      ctx.fillRect(px, py, 2, 2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(8, 8);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }
}

export { DesertGroundTexture };
