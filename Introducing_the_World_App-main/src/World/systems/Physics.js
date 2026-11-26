import RAPIER from '@dimforge/rapier3d-compat';

class Physics {
  static rapier = null;
  static world = null;
  static isInitialized = false;

  static async init(gravity = { x: 0.0, y: -9.81, z: 0.0 }) {
    if (!Physics.isInitialized) {
      await RAPIER.init();
      Physics.rapier = RAPIER;
      Physics.world = new RAPIER.World(gravity);
      Physics.isInitialized = true;
      console.log('Rapier3D Physics initialized successfully');
    }
    return Physics.world;
  }

  static getWorld() {
    return Physics.world;
  }

  static getRapier() {
    return Physics.rapier;
  }

  static step(deltaTime = 1 / 60) {
    if (Physics.world) {
      Physics.world.timestep = deltaTime;
      Physics.world.step();
    }
  }

  static reset(gravity = { x: 0.0, y: -9.81, z: 0.0 }) {
    if (Physics.isInitialized && Physics.rapier) {
      Physics.world = new Physics.rapier.World(gravity);
    }
  }
}

export { Physics };
