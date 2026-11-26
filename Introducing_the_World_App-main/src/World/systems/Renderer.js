import * as THREE from 'three';

class Renderer {
  static create() {
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true // Permite captura de screenshots fiéis do canvas WebGL
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    renderer.localClippingEnabled = true;

    return renderer;
  }
}

export { Renderer };
