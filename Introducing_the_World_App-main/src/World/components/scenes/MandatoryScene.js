import * as THREE from 'three';
import { Lamp } from '../procedural/Lamp.js';
import { Curtain } from '../procedural/Curtain.js';
import { PillowTexture } from '../procedural/PillowTexture.js';

class MandatoryScene {
  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'MandatoryScene_Group';
    this.updatables = [];

    this.#buildRoom();
    this.#buildWindows();
    this.#buildLamp();
    this.#buildCurtain();
    this.#buildFurniture();
    this.#buildPlant();
    this.#buildAirConditioner();
  }

  #buildRoom() {
    // Dimensões proporcionais à foto real
    const roomWidth = 9.0;
    const roomHeight = 5.6;
    const roomDepth = 9.0;

    // 1. Piso Cerâmico Claro com Rejunte
    const floorGeo = new THREE.PlaneGeometry(roomWidth, roomDepth, 18, 18);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xf0f0f0,
      roughness: 0.28,
      metalness: 0.05
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.group.add(floor);

    // Linhas de rejunte do piso alinhadas
    const gridHelper = new THREE.GridHelper(roomWidth, 18, 0xd4d4d4, 0xdcdcdc);
    gridHelper.position.y = 0.002;
    this.group.add(gridHelper);

    // 2. Teto Branco com Textura Suave
    const ceilingGeo = new THREE.PlaneGeometry(roomWidth, roomDepth);
    const ceilingMat = new THREE.MeshStandardMaterial({
      color: 0xf5f5f5,
      roughness: 0.85,
      metalness: 0.0
    });
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceiling.position.y = roomHeight;
    ceiling.rotation.x = Math.PI / 2;
    this.group.add(ceiling);

    // 3. Parede do Fundo (Branca)
    const backWallMat = new THREE.MeshStandardMaterial({ color: 0xf8f8f8, roughness: 0.85 });

    // Painel inferior sob a janela
    const lowerWall = new THREE.Mesh(new THREE.BoxGeometry(roomWidth, 1.8, 0.2), backWallMat);
    lowerWall.position.set(0, 0.9, -4.5);
    lowerWall.receiveShadow = true;
    this.group.add(lowerWall);

    // Painel superior sobre a janela
    const upperWall = new THREE.Mesh(new THREE.BoxGeometry(roomWidth, 1.6, 0.2), backWallMat);
    upperWall.position.set(0, 4.8, -4.5);
    upperWall.receiveShadow = true;
    this.group.add(upperWall);

    // Laterais da parede do fundo
    const leftFill = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.2, 0.2), backWallMat);
    leftFill.position.set(-3.7, 2.9, -4.5);
    this.group.add(leftFill);

    const rightFill = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.2, 0.2), backWallMat);
    rightFill.position.set(3.7, 2.9, -4.5);
    this.group.add(rightFill);

    // 4. Parede da Direita (Parede Escura de Lousa/Grafite - SEM LETRAS)
    // Na foto, a parede escura fica bem rente à poltrona marrom!
    const darkWallMat = new THREE.MeshStandardMaterial({
      color: 0x14181c,
      roughness: 0.94,
      metalness: 0.04
    });
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, roomHeight, roomDepth), darkWallMat);
    rightWall.position.set(roomWidth / 2, roomHeight / 2, 0);
    rightWall.receiveShadow = true;
    this.group.add(rightWall);

    // 5. Parede da Esquerda (Branca)
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, roomHeight, roomDepth), backWallMat);
    leftWall.position.set(-roomWidth / 2, roomHeight / 2, 0);
    leftWall.receiveShadow = true;
    this.group.add(leftWall);
  }

  #buildWindows() {
    const windowGroup = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xe5e7eb, metalness: 0.3, roughness: 0.4 });
    
    // Vidro fumê/noturno realista com reflexos sutis (sem ficar esbranquiçado)
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.12,
      metalness: 0.15
    });

    const windowWidth = 5.8;
    const windowHeight = 2.2;
    const zPos = -4.45;

    // 3 colunas x 2 linhas
    const cols = 3;
    const rows = 2;
    const paneW = (windowWidth - 0.2) / cols;
    const paneH = (windowHeight - 0.15) / rows;

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const pane = new THREE.Mesh(new THREE.PlaneGeometry(paneW, paneH), glassMat);
        const px = -windowWidth / 2 + paneW / 2 + 0.04 + c * (paneW + 0.04);
        const py = 1.8 + paneH / 2 + 0.04 + r * (paneH + 0.04);
        pane.position.set(px, py, zPos);
        pane.receiveShadow = true;
        windowGroup.add(pane);
      }
    }

    // Molduras da janela
    const outerFrame = new THREE.Mesh(new THREE.BoxGeometry(windowWidth, windowHeight, 0.08), frameMat);
    outerFrame.position.set(0, 2.9, zPos - 0.02);
    windowGroup.add(outerFrame);

    for (let i = 1; i < cols; i++) {
      const vDivider = new THREE.Mesh(new THREE.BoxGeometry(0.06, windowHeight, 0.1), frameMat);
      vDivider.position.set(-windowWidth / 2 + i * (windowWidth / cols), 2.9, zPos);
      windowGroup.add(vDivider);
    }
    const hDivider = new THREE.Mesh(new THREE.BoxGeometry(windowWidth, 0.06, 0.1), frameMat);
    hDivider.position.set(0, 2.9, zPos);
    windowGroup.add(hDivider);

    this.group.add(windowGroup);
  }

  #buildLamp() {
    // Luminária tubular diagonal no teto, exatamente na perspectiva da foto
    const lamp = Lamp.create({
      length: 5.6,
      radius: 0.07,
      position: { x: 0.4, y: 5.35, z: -0.6 },
      rotation: { x: 0, y: Math.PI / 4.2, z: 0 },
      lightColor: 0xffffff,
      lightIntensity: 28.0,
      lightDistance: 14.0
    });
    this.group.add(lamp.group);
    this.lamp = lamp;
  }

  #buildCurtain() {
    // Na foto, a cortina rolô cobre aproximadamente os dois módulos da esquerda e centro!
    this.curtain = new Curtain({
      width: 4.0,
      maxHeight: 2.1,
      position: { x: -0.85, y: 3.95, z: -4.38 },
      color: 0xdedede
    });
    this.group.add(this.curtain.group);
    this.updatables.push(this.curtain);
  }

  #buildFurniture() {
    // 1. Sofá Preto Longo (Estilo capitonê/gomos da foto)
    const sofaGroup = new THREE.Group();
    sofaGroup.name = 'BlackLeatherSofa';
    const sofaMat = new THREE.MeshStandardMaterial({
      color: 0x181818,
      roughness: 0.42,
      metalness: 0.18
    });

    // Base do assento com cantos arredondados
    const base = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.42, 1.05), sofaMat);
    base.position.set(0, 0.42, 0);
    base.castShadow = true;
    base.receiveShadow = true;
    sofaGroup.add(base);

    // Encosto do sofá
    const backrest = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.8, 0.32), sofaMat);
    backrest.position.set(0, 0.95, -0.36);
    backrest.castShadow = true;
    sofaGroup.add(backrest);

    // Braços laterais
    const armGeo = new THREE.BoxGeometry(0.3, 0.72, 1.05);
    const leftArm = new THREE.Mesh(armGeo, sofaMat);
    leftArm.position.set(-1.8, 0.65, 0);
    leftArm.castShadow = true;
    const rightArm = new THREE.Mesh(armGeo, sofaMat);
    rightArm.position.set(1.8, 0.65, 0);
    rightArm.castShadow = true;
    sofaGroup.add(leftArm, rightArm);

    // Pés de aço cromado
    const legGeo = new THREE.CylinderGeometry(0.025, 0.02, 0.22, 12);
    const legMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.95, roughness: 0.15 });
    [[-1.65, -0.4], [1.65, -0.4], [-1.65, 0.4], [1.65, 0.4]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(lx, 0.11, lz);
      sofaGroup.add(leg);
    });

    sofaGroup.position.set(-0.8, 0, -2.4);
    this.group.add(sofaGroup);

    // 2. Almofadas Fidedignas com Canvas Textures da Foto
    const pillowConfigs = [
      { text: 'Inovação', bg: '#6d28d9', x: -1.7, rotZ: 0.12 },
      { text: 'Colaboração', bg: '#db2777', x: -1.1, rotZ: -0.06 },
      { text: 'Agilidade', bg: '#0284c7', x: -0.5, rotZ: 0.08 },
      { text: 'Autonomia', bg: '#ea580c', x: 0.1, rotZ: -0.1 }
    ];

    pillowConfigs.forEach(cfg => {
      const pillowTex = PillowTexture.create(cfg.text, cfg.bg);
      const pillowMat = new THREE.MeshStandardMaterial({
        map: pillowTex,
        roughness: 0.72,
        metalness: 0.05
      });

      const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.44, 0.15), pillowMat);
      pillow.position.set(cfg.x, 0.84, -2.4);
      pillow.rotation.set(-0.25, 0, cfg.rotZ);
      pillow.castShadow = true;
      this.group.add(pillow);
    });

    // 3. Poltrona Marrom / Camurça Rente à Parede Escura
    const armchairGroup = new THREE.Group();
    const suedeMat = new THREE.MeshStandardMaterial({ color: 0x543d31, roughness: 0.92, metalness: 0.02 });
    
    const acBase = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.42, 1.0), suedeMat);
    acBase.position.y = 0.42;
    acBase.castShadow = true;
    const acBack = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.75, 0.3), suedeMat);
    acBack.position.set(0, 0.9, -0.35);
    acBack.castShadow = true;
    const acLeftArm = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.65, 1.0), suedeMat);
    acLeftArm.position.set(-0.48, 0.62, 0);
    const acRightArm = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.65, 1.0), suedeMat);
    acRightArm.position.set(0.48, 0.62, 0);
    armchairGroup.add(acBase, acBack, acLeftArm, acRightArm);

    // Posicionada perto da parede escura da direita, como na foto
    armchairGroup.position.set(3.0, 0, -2.0);
    armchairGroup.rotation.y = -Math.PI / 14;
    this.group.add(armchairGroup);
  }

  #buildPlant() {
    // Vaso piramidal alto branco entre o sofá e a poltrona
    const plantGroup = new THREE.Group();
    const potGeo = new THREE.CylinderGeometry(0.32, 0.22, 0.95, 16);
    const potMat = new THREE.MeshStandardMaterial({ color: 0xf4f4f4, roughness: 0.25 });
    const pot = new THREE.Mesh(potGeo, potMat);
    pot.position.y = 0.475;
    pot.castShadow = true;
    pot.receiveShadow = true;
    plantGroup.add(pot);

    // Tronco
    const trunkGeo = new THREE.CylinderGeometry(0.035, 0.045, 1.1, 8);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x422f20, roughness: 0.9 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 1.25;
    plantGroup.add(trunk);

    // Folhagens verdes
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x276632, roughness: 0.65, metalness: 0.05 });
    for (let i = 0; i < 9; i++) {
      const foliage = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 12), leafMat);
      const angle = (i / 9) * Math.PI * 2;
      foliage.position.set(Math.cos(angle) * 0.22, 1.65 + (i % 3) * 0.22, Math.sin(angle) * 0.22);
      foliage.scale.set(1.15, 0.85, 1.15);
      foliage.castShadow = true;
      plantGroup.add(foliage);
    }

    plantGroup.position.set(1.6, 0, -2.7);
    this.group.add(plantGroup);
  }

  #buildAirConditioner() {
    // Na foto real, o ar-condicionado fica exatamente sobre a janela esquerda!
    const acGroup = new THREE.Group();
    const acBodyGeo = new THREE.BoxGeometry(1.4, 0.38, 0.28);
    const acBodyMat = new THREE.MeshStandardMaterial({ color: 0xf3ede2, roughness: 0.45 });
    const acBody = new THREE.Mesh(acBodyGeo, acBodyMat);
    acGroup.add(acBody);

    const flapGeo = new THREE.BoxGeometry(1.3, 0.03, 0.07);
    const flapMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.5 });
    const flap = new THREE.Mesh(flapGeo, flapMat);
    flap.position.set(0, -0.15, 0.1);
    acGroup.add(flap);

    // Posicionado diretamente acima da janela esquerda
    acGroup.position.set(-1.8, 4.4, -4.35);
    this.group.add(acGroup);
  }

  tick(elapsedTime) {
    for (const object of this.updatables) {
      if (object.tick) object.tick(elapsedTime);
    }
  }
}

export { MandatoryScene };
