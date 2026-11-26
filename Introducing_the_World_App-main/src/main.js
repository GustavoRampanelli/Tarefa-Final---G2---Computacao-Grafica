import { World } from './World/World.js';

async function main() {
  const container = document.querySelector('#scene-container');

  try {
    // Inicialização assíncrona incluindo o motor Rapier3D (WASM)
    const world = await World.init(container);
    world.render();
    console.log('Aplicação World inicializada com sucesso.');
  } catch (error) {
    console.error('Erro ao inicializar World:', error);
  }
}

main();
