import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GuiControls } from './systems/GuiControls.js';
import { Camera } from './components/Camera.js';
import { Scene } from './components/Scene.js';
import { Light } from './components/Light.js';
import { Renderer } from './systems/Renderer.js';
import { Resizer } from './systems/Resizer.js';
import { Physics } from './systems/Physics.js';

import { MandatoryScene } from './components/scenes/MandatoryScene.js';
import { Option2Scene } from './components/scenes/Option2Scene.js';
import { AlchemistScene } from './components/scenes/AlchemistScene.js';

class World {
  constructor(container) {
    this.container = container;
    this.clock = new THREE.Clock();

    // 1. Câmera configurada com enquadramento fidedigno
    this.camera = Camera.create();
    this.camera.fov = 55;
    this.camera.position.set(0.1, 2.7, 4.4);
    this.camera.far = 150;
    this.camera.updateProjectionMatrix();

    this.renderer = Renderer.create();
    this.container.append(this.renderer.domElement);
    this.resizer = new Resizer(this.container, this.camera, this.renderer);

    // 2. Controles de Órbita Suaves
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.01; // Não atravessar o chão
    this.controls.minDistance = 1.5;
    this.controls.maxDistance = 60;
    this.controls.target.set(0.3, 2.3, -2.4);
    this.controls.update();

    // 3. Cena e Iluminação Geral
    this.scene = Scene.create();
    this.scene.background = new THREE.Color(0x181c22);

    this.ambientLight = Light.createAmbientLight(0xffffff, 0.40);
    this.scene.add(this.ambientLight);

    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.30);
    this.hemiLight.position.set(0, 8, 0);
    this.scene.add(this.hemiLight);

    // 4. Instanciar Cenas
    this.mandatoryScene = new MandatoryScene();
    this.option2Scene = new Option2Scene();
    this.alchemistScene = new AlchemistScene();

    this.currentSceneType = 'mandatory';
    this.currentSceneInstance = this.mandatoryScene;
    this.scene.add(this.mandatoryScene.group);

    // 5. Controles GUI (dat.GUI)
    this.guiControls = new GuiControls();
    this.#setupGui();

    // 6. Botões HTML de Alternância e Captura
    this.#setupHtmlControls();
  }

  static async init(container) {
    await Physics.init();
    return new World(container);
  }

  #setupGui() {
    const sceneOptions = {
      selectedScene: 'Cena Obrigatória (70%)',
      curtainSpeed: 1.2,
      curtainAnimation: true,
      lampIntensity: 28.0,
      resetCamera: () => this.resetCamera(),
      focusCurtain: () => this.focusOnCurtain(),
      focusLamp: () => this.focusOnLamp(),
      captureImage: () => this.captureScreenshot()
    };

    // 1. Seletor de Cenas
    const sceneFolder = this.guiControls.datGui.addFolder('Seletor de Cenas');
    sceneFolder.add(sceneOptions, 'selectedScene', [
      'Cena Obrigatória (70%)',
      'Opção 2 (30%)',
      'O Alquimista (Estudo)'
    ])
      .name('Cena Ativa')
      .onChange((value) => {
        if (value === 'Cena Obrigatória (70%)') {
          this.switchScene('mandatory');
        } else if (value === 'Opção 2 (30%)') {
          this.switchScene('option2');
        } else {
          this.switchScene('alchemist');
        }
      });
    sceneFolder.add(sceneOptions, 'captureImage').name('📸 Salvar Imagem PNG');
    sceneFolder.open();

    // 2. Pasta Rapier3D da Cortina
    const physicsFolder = this.guiControls.datGui.addFolder('Rapier3D - Física Cortina');
    physicsFolder.add(sceneOptions, 'curtainAnimation').name('Animar Cortina').onChange((val) => {
      if (this.mandatoryScene && this.mandatoryScene.curtain) {
        this.mandatoryScene.curtain.isAnimating = val;
      }
    });
    physicsFolder.add(sceneOptions, 'curtainSpeed', 0.2, 4.0, 0.1).name('Velocidade Loop').onChange((val) => {
      if (this.mandatoryScene && this.mandatoryScene.curtain) {
        this.mandatoryScene.curtain.speed = val;
      }
    });
    physicsFolder.open();

    // 3. Luminária Procedural
    const lampFolder = this.guiControls.datGui.addFolder('Luminária Procedural (Cena 1)');
    lampFolder.add(sceneOptions, 'lampIntensity', 0, 70, 1).name('Intensidade Luz').onChange((val) => {
      if (this.mandatoryScene && this.mandatoryScene.lamp && this.mandatoryScene.lamp.light) {
        this.mandatoryScene.lamp.light.intensity = val;
      }
    });

    // 4. Presets de Câmera
    const cameraPresets = this.guiControls.datGui.addFolder('Presets de Câmera');
    cameraPresets.add(sceneOptions, 'resetCamera').name('Visão Geral');
    cameraPresets.add(sceneOptions, 'focusCurtain').name('Foco na Cortina');
    cameraPresets.add(sceneOptions, 'focusLamp').name('Foco na Luminária');

    this.guiControls.addCameraFolder(this.camera, this.controls);
    this.guiControls.addLightFolder(this.ambientLight);
    this.guiControls.datGui.open();
  }

  #setupHtmlControls() {
    const btnMandatory = document.getElementById('btn-scene-mandatory');
    const btnOption2 = document.getElementById('btn-scene-option2');
    const btnAlchemist = document.getElementById('btn-scene-alchemist');
    const btnScreenshot = document.getElementById('btn-screenshot');
    const sceneTitle = document.getElementById('scene-title');
    const sceneDesc = document.getElementById('scene-desc');

    const updateActiveButton = (activeBtn) => {
      [btnMandatory, btnOption2, btnAlchemist].forEach(btn => {
        if (btn) btn.classList.remove('active');
      });
      if (activeBtn) activeBtn.classList.add('active');
    };

    if (btnMandatory) {
      btnMandatory.addEventListener('click', () => {
        this.switchScene('mandatory');
        updateActiveButton(btnMandatory);
        if (sceneTitle) sceneTitle.textContent = 'Cena 1: Sala de Estar (Obrigatória - 70%)';
        if (sceneDesc) sceneDesc.textContent = 'Luminária procedural diagonal | Cortina animada com Rapier3D | Sofá e folhagens';
      });
    }

    if (btnOption2) {
      btnOption2.addEventListener('click', () => {
        this.switchScene('option2');
        updateActiveButton(btnOption2);
        if (sceneTitle) sceneTitle.textContent = 'Cena 2: Sala Laranja Terracota (Opção 2 - 30%)';
        if (sceneDesc) sceneDesc.textContent = 'Janelão 4x2 | Piso cerâmico PBR | Reflexos de luz no teto | Arquibancada e puff';
      });
    }

    if (btnAlchemist) {
      btnAlchemist.addEventListener('click', () => {
        this.switchScene('alchemist');
        updateActiveButton(btnAlchemist);
        if (sceneTitle) sceneTitle.textContent = 'Cena de Estudo: O Alquimista (Paulo Coelho)';
        if (sceneDesc) sceneDesc.textContent = 'Lua Cheia gigante | Céu estrelado estilo Van Gogh | Pirâmides de Gizé | Viajante com cajado';
      });
    }

    if (btnScreenshot) {
      btnScreenshot.addEventListener('click', () => {
        this.captureScreenshot();
      });
    }
  }

  captureScreenshot() {
    this.renderer.render(this.scene, this.camera);
    const canvas = this.renderer.domElement;
    const dataUrl = canvas.toDataURL('image/png');

    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    
    let prefix = 'Cena_Obrigatoria';
    if (this.currentSceneType === 'option2') prefix = 'Opcao_2';
    else if (this.currentSceneType === 'alchemist') prefix = 'O_Alquimista';

    const filename = `${prefix}_${timestamp}.png`;
    const downloadLink = document.createElement('a');
    downloadLink.download = filename;
    downloadLink.href = dataUrl;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    console.log(`Imagem salva com sucesso: ${filename}`);
  }

  switchScene(sceneType) {
    if (sceneType === this.currentSceneType) return;

    // Remover cena anterior
    if (this.currentSceneInstance) {
      this.scene.remove(this.currentSceneInstance.group);
    }

    if (sceneType === 'mandatory') {
      this.scene.background.set(0x181c22);
      this.scene.add(this.mandatoryScene.group);
      this.currentSceneInstance = this.mandatoryScene;
      this.currentSceneType = 'mandatory';

      this.camera.position.set(0.1, 2.7, 4.4);
      this.controls.target.set(0.3, 2.3, -2.4);
    } else if (sceneType === 'option2') {
      this.scene.background.set(0x181c22);
      this.scene.add(this.option2Scene.group);
      this.currentSceneInstance = this.option2Scene;
      this.currentSceneType = 'option2';

      this.camera.position.set(-0.6, 2.5, 3.8);
      this.controls.target.set(0.1, 2.2, -2.4);
    } else if (sceneType === 'alchemist') {
      // Céu noturno profundo estilo Van Gogh
      this.scene.background.set(0x060f22);
      this.scene.add(this.alchemistScene.group);
      this.currentSceneInstance = this.alchemistScene;
      this.currentSceneType = 'alchemist';

      // Posicionamento que enquadra o viajante em primeiro plano, as pirâmides no horizonte e a Lua alta
      this.camera.position.set(0.0, 2.6, 4.0);
      this.controls.target.set(0.0, 5.5, -20.0);
    }

    this.controls.update();
  }

  resetCamera() {
    if (this.currentSceneType === 'mandatory') {
      this.camera.position.set(0.1, 2.7, 4.4);
      this.controls.target.set(0.3, 2.3, -2.4);
    } else if (this.currentSceneType === 'option2') {
      this.camera.position.set(-0.6, 2.5, 3.8);
      this.controls.target.set(0.1, 2.2, -2.4);
    } else {
      this.camera.position.set(0.0, 2.6, 4.0);
      this.controls.target.set(0.0, 5.5, -20.0);
    }
    this.controls.update();
  }

  focusOnCurtain() {
    this.switchScene('mandatory');
    this.camera.position.set(-0.9, 3.6, -1.0);
    this.controls.target.set(-0.85, 3.4, -4.4);
    this.controls.update();
  }

  focusOnLamp() {
    this.switchScene('mandatory');
    this.camera.position.set(0.3, 3.8, 1.2);
    this.controls.target.set(0.4, 5.3, -0.6);
    this.controls.update();
  }

  render() {
    this.renderer.setAnimationLoop(() => {
      const delta = this.clock.getDelta();
      const elapsedTime = this.clock.getElapsedTime();

      // Passo da física Rapier
      Physics.step(delta);

      // Atualizar animações da cena corrente
      if (this.currentSceneInstance && this.currentSceneInstance.tick) {
        this.currentSceneInstance.tick(elapsedTime);
      }

      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    });
  }
}

export { World };
