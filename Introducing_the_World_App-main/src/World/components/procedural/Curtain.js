import * as THREE from 'three';
import { Physics } from '../../systems/Physics.js';

class Curtain {
  /**
   * Cortina Rolô com movimentação em loop (sobe e desce) integrada ao Rapier3D
   */
  constructor(options = {}) {
    const {
      width = 4.2,
      maxHeight = 2.4,
      position = { x: -0.6, y: 3.8, z: -4.85 },
      color = 0xdadada
    } = options;

    this.width = width;
    this.maxHeight = maxHeight;
    this.basePosition = { ...position };
    this.currentHeight = maxHeight * 0.6; // Inicialmente semi-aberta

    this.group = new THREE.Group();
    this.group.name = 'RapierAnimatedCurtain';

    this.isAnimating = true;
    this.speed = 1.2;
    this.amplitude = 0.7; // Distância de deslocamento

    this.#buildMesh(color);
    this.#initRapier();
  }

  #buildMesh(color) {
    // 1. Caixa superior (Suporte da Cortina Rolô)
    const boxGeo = new THREE.BoxGeometry(this.width + 0.1, 0.14, 0.14);
    const boxMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.1 });
    const topCasing = new THREE.Mesh(boxGeo, boxMat);
    topCasing.position.set(this.basePosition.x, this.basePosition.y, this.basePosition.z);
    this.group.add(topCasing);

    // 2. Tecido da Cortina (Plane / Box fino)
    const fabricGeo = new THREE.BoxGeometry(this.width, this.maxHeight, 0.015);
    // Move o ponto pivô para a borda superior para facilitar escala vertical
    fabricGeo.translate(0, -this.maxHeight / 2, 0);

    const fabricMat = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.85,
      metalness: 0.05,
      side: THREE.DoubleSide
    });

    this.fabricMesh = new THREE.Mesh(fabricGeo, fabricMat);
    this.fabricMesh.position.set(this.basePosition.x, this.basePosition.y - 0.07, this.basePosition.z);
    this.fabricMesh.castShadow = true;
    this.fabricMesh.receiveShadow = true;
    this.group.add(this.fabricMesh);

    // 3. Barra inferior de peso (Tubo cilíndrico)
    const barGeo = new THREE.CylinderGeometry(0.025, 0.025, this.width, 16);
    barGeo.rotateZ(Math.PI / 2);
    const barMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.7, roughness: 0.3 });
    this.bottomBar = new THREE.Mesh(barGeo, barMat);
    this.group.add(this.bottomBar);
    this.#updateBottomBarPosition();
  }

  #initRapier() {
    const rapier = Physics.getRapier();
    const world = Physics.getWorld();

    if (!rapier || !world) {
      console.warn('Rapier ainda não inicializado, corpo físico da cortina será criado sob demanda.');
      return;
    }

    // Criar corpo cinemático baseado em posição no Rapier
    const bodyDesc = rapier.RigidBodyDesc.kinematicPositionBased()
      .setTranslation(this.basePosition.x, this.basePosition.y, this.basePosition.z);
    this.rigidBody = world.createRigidBody(bodyDesc);

    // Collider representando a barra de peso / cortina
    const colliderDesc = rapier.ColliderDesc.cuboid(this.width / 2, 0.05, 0.05);
    world.createCollider(colliderDesc, this.rigidBody);
  }

  #updateBottomBarPosition() {
    if (this.bottomBar && this.fabricMesh) {
      const actualHeight = this.maxHeight * this.fabricMesh.scale.y;
      this.bottomBar.position.set(
        this.basePosition.x,
        this.basePosition.y - 0.07 - actualHeight,
        this.basePosition.z
      );
    }
  }

  /**
   * Atualização chamada a cada frame do loop de animação
   * @param {number} elapsedTime Tempo total decorrido em segundos
   */
  tick(elapsedTime) {
    if (!this.isAnimating) return;

    // Oscilação senoidal contínua (sobe e desce entre ~0.3 e ~0.9 da altura máxima)
    const cycle = (Math.sin(elapsedTime * this.speed) + 1) / 2; // Normalizado 0 a 1
    const minScale = 0.25;
    const maxScale = 0.85;
    const currentScale = minScale + cycle * (maxScale - minScale);

    this.fabricMesh.scale.y = currentScale;
    this.#updateBottomBarPosition();

    // Sincronização com o RigidBody do Rapier
    if (this.rigidBody) {
      this.rigidBody.setNextKinematicTranslation({
        x: this.bottomBar.position.x,
        y: this.bottomBar.position.y,
        z: this.bottomBar.position.z
      });
    }
  }
}

export { Curtain };
