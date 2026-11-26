import * as THREE from 'three';

class Lamp {
  /**
   * Cria uma luminária tubular procedural do zero (conforme requisito da Cena Obrigatória)
   * @param {Object} options Parâmetros de customização (comprimento, raio, posição, rotação)
   */
  static create(options = {}) {
    const {
      length = 5.0,
      radius = 0.08,
      position = { x: 0, y: 5.8, z: 0 },
      rotation = { x: 0, y: Math.PI / 4, z: 0 }, // Diagonal no teto
      lightColor = 0xffffff,
      lightIntensity = 30.0,
      lightDistance = 15.0
    } = options;

    const lampGroup = new THREE.Group();
    lampGroup.name = 'ProceduralTubularLamp';

    // 1. Tubo luminoso emissivo principal
    const tubeGeometry = new THREE.CylinderGeometry(radius, radius, length, 32);
    // Girar para ficar na horizontal (ao longo do eixo X local)
    tubeGeometry.rotateZ(Math.PI / 2);

    const tubeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 2.5,
      roughness: 0.1,
      metalness: 0.0
    });

    const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
    tubeMesh.castShadow = false;
    lampGroup.add(tubeMesh);

    // 2. Ponteiras / Tampas de acabamento (alumínio escovado)
    const capGeometry = new THREE.CylinderGeometry(radius * 1.05, radius * 1.05, 0.12, 32);
    capGeometry.rotateZ(Math.PI / 2);
    const capMaterial = new THREE.MeshStandardMaterial({
      color: 0x444444,
      roughness: 0.3,
      metalness: 0.8
    });

    const leftCap = new THREE.Mesh(capGeometry, capMaterial);
    leftCap.position.x = -length / 2;
    lampGroup.add(leftCap);

    const rightCap = new THREE.Mesh(capGeometry, capMaterial);
    rightCap.position.x = length / 2;
    lampGroup.add(rightCap);

    // 3. Fios de sustentação finos de aço até o teto
    const wireGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.4, 8);
    const wireMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.2 });

    const wireLeft = new THREE.Mesh(wireGeo, wireMat);
    wireLeft.position.set(-length * 0.35, 0.2, 0);
    lampGroup.add(wireLeft);

    const wireRight = new THREE.Mesh(wireGeo, wireMat);
    wireRight.position.set(length * 0.35, 0.2, 0);
    lampGroup.add(wireRight);

    // 4. Fonte de luz real (PointLight centralizada)
    const pointLight = new THREE.PointLight(lightColor, lightIntensity, lightDistance, 1.2);
    pointLight.position.set(0, -0.15, 0);
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 1024;
    pointLight.shadow.mapSize.height = 1024;
    pointLight.shadow.bias = -0.001;
    lampGroup.add(pointLight);

    // Posicionamento e rotação no espaço global
    lampGroup.position.set(position.x, position.y, position.z);
    lampGroup.rotation.set(rotation.x, rotation.y, rotation.z);

    return {
      group: lampGroup,
      light: pointLight,
      tubeMesh: tubeMesh
    };
  }
}

export { Lamp };
