import * as THREE from 'three';
import { MoonTexture } from '../procedural/MoonTexture.js';
import { DesertGroundTexture } from '../procedural/DesertGroundTexture.js';

class AlchemistScene {
  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'AlchemistScene_Group';
    this.updatables = [];

    this.#buildSkyAndMoon();
    this.#buildPyramids();
    this.#buildDesertTerrain();
    this.#buildTraveler();
    this.#buildMoonlight();
  }

  #buildSkyAndMoon() {
    // 1. Céu Estrelado com Vórtice de Estrelas estilo Van Gogh
    const starCount = 650;
    const starGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const moonPos = new THREE.Vector3(0, 36, -55);
    const colorChoices = [
      new THREE.Color(0xffffff),
      new THREE.Color(0x93c5fd),
      new THREE.Color(0xbfdbfe),
      new THREE.Color(0xfef08a)
    ];

    for (let i = 0; i < starCount; i++) {
      // Espiral concêntrica ao redor da Lua
      const angle = Math.random() * Math.PI * 2;
      const radius = 10 + Math.random() * 45;
      const swirl = angle + radius * 0.05;

      const x = moonPos.x + Math.cos(swirl) * radius;
      const y = moonPos.y + Math.sin(swirl) * (radius * 0.85);
      const z = moonPos.z + (Math.random() - 0.5) * 6;

      positions[i * 3] = x;
      positions[i * 3 + 1] = Math.max(10, y); // Acima do horizonte
      positions[i * 3 + 2] = z;

      const c = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.65,
      vertexColors: true,
      transparent: true,
      opacity: 0.95
    });

    this.stars = new THREE.Points(starGeometry, starMaterial);
    this.group.add(this.stars);

    // 2. A Grande Lua Cheia
    const moonTex = MoonTexture.create(1024);
    const moonGeo = new THREE.CircleGeometry(11.5, 48);
    const moonMat = new THREE.MeshBasicMaterial({
      map: moonTex,
      transparent: true,
      side: THREE.DoubleSide
    });

    this.moonMesh = new THREE.Mesh(moonGeo, moonMat);
    this.moonMesh.position.copy(moonPos);
    this.group.add(this.moonMesh);

    // Halo / Brilho Externo da Lua
    const haloGeo = new THREE.RingGeometry(11.4, 15.5, 48);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.position.set(moonPos.x, moonPos.y, moonPos.z - 0.1);
    this.group.add(haloMesh);
  }

  #buildPyramids() {
    const pyramidGroup = new THREE.Group();
    pyramidGroup.name = 'GizaPyramids';

    // Material de calcário/arenito com relevo áspero
    const pyramidMat = new THREE.MeshStandardMaterial({
      color: 0x8d7765,
      roughness: 0.88,
      metalness: 0.05,
      flatShading: true // Cria as arestas vivas e contraste de iluminação da pintura!
    });

    // 1. Pirâmide Central (Maior / Grande Pirâmide de Gizé)
    const pCenterGeo = new THREE.ConeGeometry(14.0, 13.0, 4);
    pCenterGeo.rotateY(Math.PI / 4);
    const pCenter = new THREE.Mesh(pCenterGeo, pyramidMat);
    pCenter.position.set(-0.5, 6.5, -36.0);
    pCenter.castShadow = true;
    pCenter.receiveShadow = true;
    pyramidGroup.add(pCenter);

    // 2. Pirâmide Esquerda
    const pLeftGeo = new THREE.ConeGeometry(9.5, 9.0, 4);
    pLeftGeo.rotateY(Math.PI / 4.1);
    const pLeft = new THREE.Mesh(pLeftGeo, pyramidMat);
    pLeft.position.set(-14.5, 4.5, -34.0);
    pLeft.castShadow = true;
    pLeft.receiveShadow = true;
    pyramidGroup.add(pLeft);

    // 3. Pirâmide Direita
    const pRightGeo = new THREE.ConeGeometry(9.0, 8.5, 4);
    pRightGeo.rotateY(Math.PI / 3.9);
    const pRight = new THREE.Mesh(pRightGeo, pyramidMat);
    pRight.position.set(13.5, 4.25, -35.0);
    pRight.castShadow = true;
    pRight.receiveShadow = true;
    pyramidGroup.add(pRight);

    this.group.add(pyramidGroup);
  }

  #buildDesertTerrain() {
    // 1. Terreno arenoso/rochoso vasto
    const terrainGeo = new THREE.PlaneGeometry(120, 120, 32, 32);
    const groundTex = DesertGroundTexture.create(1024);

    const terrainMat = new THREE.MeshStandardMaterial({
      map: groundTex,
      roughness: 0.92,
      metalness: 0.02
    });

    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.rotation.x = -Math.PI / 2;
    terrain.receiveShadow = true;
    this.group.add(terrain);

    // 2. Pedras e Seixos 3D espalhados pelo chão em primeiro plano
    const stonesGroup = new THREE.Group();
    const stoneGeo = new THREE.DodecahedronGeometry(0.2, 1);
    const stoneMaterials = [
      new THREE.MeshStandardMaterial({ color: 0x806b5b, roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ color: 0x9a8372, roughness: 0.95 }),
      new THREE.MeshStandardMaterial({ color: 0x6e5849, roughness: 0.85 })
    ];

    for (let i = 0; i < 75; i++) {
      const mat = stoneMaterials[i % stoneMaterials.length];
      const stone = new THREE.Mesh(stoneGeo, mat);
      
      const x = (Math.random() - 0.5) * 16;
      const z = -12 + Math.random() * 16;
      const scaleX = 0.5 + Math.random() * 1.8;
      const scaleY = 0.2 + Math.random() * 0.7;
      const scaleZ = 0.5 + Math.random() * 1.8;

      stone.scale.set(scaleX, scaleY, scaleZ);
      stone.position.set(x, scaleY * 0.15, z);
      stone.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      stone.castShadow = true;
      stone.receiveShadow = true;
      stonesGroup.add(stone);
    }
    this.group.add(stonesGroup);
  }

  #buildTraveler() {
    // O Viajante / Alquimista de costas na composição
    const travelerGroup = new THREE.Group();
    travelerGroup.name = 'TravelerSantiago';

    const clothesMat = new THREE.MeshStandardMaterial({
      color: 0x8a6e50,
      roughness: 0.88
    });
    const darkClothMat = new THREE.MeshStandardMaterial({
      color: 0x242426,
      roughness: 0.92
    });
    const hatMat = new THREE.MeshStandardMaterial({
      color: 0x9e805f,
      roughness: 0.85
    });

    // 1. Pernas / Calças
    const legGeo = new THREE.CylinderGeometry(0.12, 0.10, 1.1, 12);
    const leftLeg = new THREE.Mesh(legGeo, darkClothMat);
    leftLeg.position.set(-0.16, 0.55, 0);
    leftLeg.castShadow = true;
    const rightLeg = new THREE.Mesh(legGeo, darkClothMat);
    rightLeg.position.set(0.16, 0.55, 0);
    rightLeg.castShadow = true;
    travelerGroup.add(leftLeg, rightLeg);

    // 2. Tronco / Jaqueta / Manto
    const torsoGeo = new THREE.CylinderGeometry(0.38, 0.32, 1.15, 16);
    const torso = new THREE.Mesh(torsoGeo, clothesMat);
    torso.position.y = 1.55;
    torso.castShadow = true;
    travelerGroup.add(torso);

    // 3. Mochila / Alforje transversal nas costas
    const satchelGeo = new THREE.BoxGeometry(0.38, 0.32, 0.18);
    const satchelMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.75 });
    const satchel = new THREE.Mesh(satchelGeo, satchelMat);
    satchel.position.set(0.14, 1.45, 0.18);
    satchel.rotation.set(0.1, 0, -0.3);
    satchel.castShadow = true;
    travelerGroup.add(satchel);

    // 4. Cabeça e Chapéu de Abas Largas
    const headGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const headMat = new THREE.MeshStandardMaterial({ color: 0x7c5a45, roughness: 0.8 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 2.25;
    travelerGroup.add(head);

    // Chapéu (Aba + Copa)
    const brimGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.03, 24);
    const brim = new THREE.Mesh(brimGeo, hatMat);
    brim.position.y = 2.33;
    brim.rotation.x = -0.08;
    brim.castShadow = true;

    const crownGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.22, 24);
    const crown = new THREE.Mesh(crownGeo, hatMat);
    crown.position.y = 2.44;
    crown.rotation.x = -0.08;
    crown.castShadow = true;
    travelerGroup.add(brim, crown);

    // 5. Braço e Cajado (Walking staff)
    const armGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.75, 8);
    const leftArm = new THREE.Mesh(armGeo, clothesMat);
    leftArm.position.set(-0.42, 1.55, 0.1);
    leftArm.rotation.set(0.25, 0, 0.25);
    travelerGroup.add(leftArm);

    // Cajado longo fincado no chão
    const staffGeo = new THREE.CylinderGeometry(0.025, 0.02, 2.3, 8);
    const staffMat = new THREE.MeshStandardMaterial({ color: 0x4a3424, roughness: 0.95 });
    const staff = new THREE.Mesh(staffGeo, staffMat);
    staff.position.set(-0.55, 1.05, 0.22);
    staff.rotation.set(0.06, 0, 0.12);
    staff.castShadow = true;
    travelerGroup.add(staff);

    // Posicionado no primeiro plano de costas para o observador
    travelerGroup.position.set(0, 0, -2.5);
    this.group.add(travelerGroup);
    this.traveler = travelerGroup;
  }

  #buildMoonlight() {
    // A Lua fica atrás das pirâmides, projetando luz e sombra longa em direção à câmera
    const moonDirLight = new THREE.DirectionalLight(0xdbeafe, 2.8);
    moonDirLight.position.set(0, 32, -45);
    moonDirLight.target.position.set(0, 0, 0);
    moonDirLight.castShadow = true;
    moonDirLight.shadow.mapSize.width = 2048;
    moonDirLight.shadow.mapSize.height = 2048;
    moonDirLight.shadow.bias = -0.0005;
    moonDirLight.shadow.camera.near = 5;
    moonDirLight.shadow.camera.far = 80;
    moonDirLight.shadow.camera.left = -25;
    moonDirLight.shadow.camera.right = 25;
    moonDirLight.shadow.camera.top = 25;
    moonDirLight.shadow.camera.bottom = -5;

    this.group.add(moonDirLight);
    this.group.add(moonDirLight.target);

    // Luz de preenchimento azul escuro noturno
    const ambientNight = new THREE.AmbientLight(0x1e293b, 0.5);
    this.group.add(ambientNight);
  }

  tick(elapsedTime) {
    // Suave oscilação e brilho das estrelas
    if (this.stars) {
      this.stars.rotation.z = Math.sin(elapsedTime * 0.05) * 0.02;
    }
  }
}

export { AlchemistScene };
