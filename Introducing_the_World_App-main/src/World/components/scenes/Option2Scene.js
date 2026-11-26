import * as THREE from 'three';

class Option2Scene {
  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'Option2Scene_Group';
    this.updatables = [];

    this.#buildRoom();
    this.#buildWindows();
    this.#buildCeilingLightStrip();
    this.#buildBleachers();
    this.#buildPuff();
  }

  #buildRoom() {
    const roomW = 8.6;
    const roomH = 5.4;
    const roomD = 8.6;

    // 1. Piso Cerâmico Branco com Rejunte e Reflexo Quente
    const floorGeo = new THREE.PlaneGeometry(roomW, roomD, 18, 18);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xf3f3f3,
      roughness: 0.24,
      metalness: 0.06
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.group.add(floor);

    const gridHelper = new THREE.GridHelper(roomW, 18, 0xd0d0d0, 0xdadada);
    gridHelper.position.y = 0.002;
    this.group.add(gridHelper);

    // 2. Paredes e Teto Terracota / Laranja Vibrante
    // Teto com MeshPhysicalMaterial acetinado para capturar a linha de luz contínua da foto
    const orangeWallMat = new THREE.MeshStandardMaterial({
      color: 0xc84c1b,
      roughness: 0.65,
      metalness: 0.04
    });

    const glossyCeilingMat = new THREE.MeshPhysicalMaterial({
      color: 0xc84c1b,
      roughness: 0.32,
      metalness: 0.06,
      clearcoat: 0.65,
      clearcoatRoughness: 0.20,
      reflectivity: 0.85
    });

    // Teto
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomD), glossyCeilingMat);
    ceiling.position.y = roomH;
    ceiling.rotation.x = Math.PI / 2;
    this.group.add(ceiling);

    // Parede do Fundo com vão da janela
    const lowerWall = new THREE.Mesh(new THREE.BoxGeometry(roomW, 2.0, 0.2), orangeWallMat);
    lowerWall.position.set(0, 1.0, -4.3);
    lowerWall.receiveShadow = true;
    this.group.add(lowerWall);

    const upperWall = new THREE.Mesh(new THREE.BoxGeometry(roomW, 1.4, 0.2), orangeWallMat);
    upperWall.position.set(0, 4.7, -4.3);
    upperWall.receiveShadow = true;
    this.group.add(upperWall);

    const leftWallFill = new THREE.Mesh(new THREE.BoxGeometry(1.0, 2.0, 0.2), orangeWallMat);
    leftWallFill.position.set(-3.8, 3.0, -4.3);
    this.group.add(leftWallFill);

    const rightWallFill = new THREE.Mesh(new THREE.BoxGeometry(1.0, 2.0, 0.2), orangeWallMat);
    rightWallFill.position.set(3.8, 3.0, -4.3);
    this.group.add(rightWallFill);

    // Parede Direita
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, roomH, roomD), orangeWallMat);
    rightWall.position.set(roomW / 2, roomH / 2, 0);
    rightWall.receiveShadow = true;
    this.group.add(rightWall);

    // Parede Esquerda
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, roomH, roomD), orangeWallMat);
    leftWall.position.set(-roomW / 2, roomH / 2, 0);
    leftWall.receiveShadow = true;
    this.group.add(leftWall);
  }

  #buildWindows() {
    // Janela 4 colunas x 2 linhas fiel à foto: vidros escuros (noturno) e esquadrias brancas
    const windowGroup = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35, metalness: 0.05 });
    
    // Vidro escuro noturno que NÃO fica branco lavado
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x0c1322,
      roughness: 0.10,
      metalness: 0.2
    });

    const totalWidth = 6.6;
    const totalHeight = 2.0;
    const zPos = -4.25;
    const cols = 4;
    const rows = 2;

    const paneW = (totalWidth - 0.3) / cols;
    const paneH = (totalHeight - 0.15) / rows;

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const pane = new THREE.Mesh(new THREE.PlaneGeometry(paneW, paneH), glassMat);
        const px = -totalWidth / 2 + paneW / 2 + 0.04 + c * (paneW + 0.04);
        const py = 2.0 + paneH / 2 + 0.04 + r * (paneH + 0.04);
        pane.position.set(px, py, zPos);
        pane.receiveShadow = true;
        windowGroup.add(pane);

        // Puxadores pretos basculantes na linha inferior
        if (r === 0) {
          const handle = new THREE.Mesh(
            new THREE.BoxGeometry(0.12, 0.025, 0.04),
            new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 })
          );
          handle.position.set(px, 2.15, zPos + 0.03);
          windowGroup.add(handle);
        }
      }
    }

    // Moldura branca externa
    const outerFrame = new THREE.Mesh(new THREE.BoxGeometry(totalWidth, totalHeight, 0.08), frameMat);
    outerFrame.position.set(0, 3.0, zPos - 0.02);
    windowGroup.add(outerFrame);

    // Divisórias verticais brancas
    for (let i = 1; i < cols; i++) {
      const vBar = new THREE.Mesh(new THREE.BoxGeometry(0.06, totalHeight, 0.1), frameMat);
      vBar.position.set(-totalWidth / 2 + i * (totalWidth / cols), 3.0, zPos);
      windowGroup.add(vBar);
    }
    // Divisória horizontal branca
    const hBar = new THREE.Mesh(new THREE.BoxGeometry(totalWidth, 0.06, 0.1), frameMat);
    hBar.position.set(0, 3.0, zPos);
    windowGroup.add(hBar);

    this.group.add(windowGroup);
  }

  #buildCeilingLightStrip() {
    // Fita de LED linear contínua suave no teto (sem manchas/spots circulares)
    const lightStripGroup = new THREE.Group();
    const stripLength = 8.4;

    // Fita luminosa emissiva intensa
    const stripGeo = new THREE.BoxGeometry(stripLength, 0.05, 0.08);
    const stripMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xfff6e5,
      emissiveIntensity: 4.5,
      roughness: 0.05
    });
    const stripMesh = new THREE.Mesh(stripGeo, stripMat);
    stripMesh.position.set(0, 5.37, -1.8);
    lightStripGroup.add(stripMesh);

    // Iluminação distribuída apontada para BAIXO (evitando os cones brancos no teto)
    const mainDownLight = new THREE.DirectionalLight(0xffedd5, 1.8);
    mainDownLight.position.set(0, 5.2, -1.8);
    mainDownLight.target.position.set(0, 0, -2.5);
    mainDownLight.castShadow = true;
    mainDownLight.shadow.mapSize.width = 1024;
    mainDownLight.shadow.mapSize.height = 1024;
    lightStripGroup.add(mainDownLight);
    lightStripGroup.add(mainDownLight.target);

    // Luz de preenchimento suave no teto para criar a linha horizontal reflexiva contínua
    const ceilingFill = new THREE.PointLight(0xfff0db, 14, 8, 1.5);
    ceilingFill.position.set(0, 4.6, -1.8);
    lightStripGroup.add(ceilingFill);

    this.group.add(lightStripGroup);
  }

  #buildBleachers() {
    // Arquibancada com degraus chanfrados poligonais (45 graus) e tomadas
    const bleacherGroup = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0xa84820,
      roughness: 0.52,
      metalness: 0.06
    });

    // Degrau 1 (Inferior)
    const step1 = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.5, 2.6), woodMat);
    step1.position.set(0.6, 0.25, -2.8);
    step1.receiveShadow = true;
    step1.castShadow = true;
    bleacherGroup.add(step1);

    // Degrau 2 (Intermediário)
    const step2 = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.5, 2.0), woodMat);
    step2.position.set(1.0, 0.75, -3.1);
    step2.receiveShadow = true;
    step2.castShadow = true;
    bleacherGroup.add(step2);

    // Degrau 3 (Superior - sob a janela)
    const step3 = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.5, 1.4), woodMat);
    step3.position.set(1.4, 1.25, -3.4);
    step3.receiveShadow = true;
    step3.castShadow = true;
    bleacherGroup.add(step3);

    // Tomadas elétricas pretas nas faces frontais dos degraus
    const outletMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.7 });
    const outletGeo = new THREE.BoxGeometry(0.14, 0.08, 0.02);
    
    const outlet1 = new THREE.Mesh(outletGeo, outletMat);
    outlet1.position.set(2.2, 0.95, -2.08);
    const outlet2 = new THREE.Mesh(outletGeo, outletMat);
    outlet2.position.set(-0.4, 0.95, -2.08);
    bleacherGroup.add(outlet1, outlet2);

    this.group.add(bleacherGroup);
  }

  #buildPuff() {
    // Puff estofado cilíndrico cinza-azulado em primeiro plano
    const puffGroup = new THREE.Group();
    puffGroup.name = 'ForegroundPuff';

    const puffMat = new THREE.MeshStandardMaterial({
      color: 0x93a3b8,
      roughness: 0.82,
      metalness: 0.02
    });

    const bodyGeo = new THREE.CylinderGeometry(0.58, 0.58, 0.72, 32);
    const bodyMesh = new THREE.Mesh(bodyGeo, puffMat);
    bodyMesh.position.y = 0.36;
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    puffGroup.add(bodyMesh);

    // Topo arredondado almofadado
    const topGeo = new THREE.SphereGeometry(0.58, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const topMesh = new THREE.Mesh(topGeo, puffMat);
    topMesh.position.y = 0.72;
    topMesh.scale.set(1, 0.22, 1);
    topMesh.castShadow = true;
    puffGroup.add(topMesh);

    // Pés pequenos escuros
    const legGeo = new THREE.CylinderGeometry(0.035, 0.025, 0.05, 12);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.6 });
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(Math.cos(angle) * 0.4, 0.025, Math.sin(angle) * 0.4);
      puffGroup.add(leg);
    }

    // Posicionado no primeiro plano à esquerda, exatamente como na foto!
    puffGroup.position.set(-1.8, 0, -1.0);
    this.group.add(puffGroup);
  }

  tick(elapsedTime) {
    // Hook para animações se necessário
  }
}

export { Option2Scene };
