import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class ModelLoader {
  constructor() {
    this.loader = new GLTFLoader();
    this.cache = new Map();
  }

  /**
   * Carrega um modelo GLTF ou GLB com sombras ativadas automaticamente
   * @param {string} url Caminho do arquivo .glb / .gltf
   * @param {Object} options Configurações de escala e posição
   * @returns {Promise<THREE.Group>}
   */
  async load(url, options = {}) {
    const {
      scale = 1.0,
      position = { x: 0, y: 0, z: 0 },
      rotation = { x: 0, y: 0, z: 0 },
      castShadow = true,
      receiveShadow = true
    } = options;

    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (gltf) => {
          const model = gltf.scene;
          
          if (typeof scale === 'number') {
            model.scale.set(scale, scale, scale);
          } else {
            model.scale.set(scale.x || 1, scale.y || 1, scale.z || 1);
          }

          model.position.set(position.x, position.y, position.z);
          model.rotation.set(rotation.x, rotation.y, rotation.z);

          // Habilita sombras em todas as geometrias do modelo
          model.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = castShadow;
              child.receiveShadow = receiveShadow;
            }
          });

          resolve(model);
        },
        undefined,
        (error) => {
          console.error(`Erro ao carregar modelo em ${url}:`, error);
          reject(error);
        }
      );
    });
  }
}

const modelLoader = new ModelLoader();
export { modelLoader, ModelLoader };
