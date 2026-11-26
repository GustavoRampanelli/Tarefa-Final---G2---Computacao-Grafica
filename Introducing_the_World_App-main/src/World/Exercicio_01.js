import * as THREE from "three";

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GuiControls } from './systems/GuiControls.js';

import { Camera } from './components/Camera.js';
import { Scene } from './components/Scene.js';
import { Floor } from './components/Floor.js';
import { Light } from './components/Light.js';

import { Renderer } from './systems/Renderer.js';
import { Resizer } from './systems/Resizer.js';


// These variables are module-scoped: we cannot access them
// from outside the module
let camera;
let renderer;
let scene;
let controls;
let resizer;

let cube;
let sphere;
let torus;
let cylinder;

class Exercicio_01 {
  constructor(container) {
    camera = Camera.create();
    renderer = Renderer.create();
    container.append(renderer.domElement);
    resizer = new Resizer(container, camera, renderer);

    // Permite controle da camera com mouse e teclado  
    controls = new OrbitControls(camera, renderer.domElement);
    controls.listenToKeyEvents(window);
    //controls.enableDamping = true; // suaviza o movimento

    // Mostra controle de propriedades na tela (dat.GUI)
    const guiControls = new GuiControls();
    
    // -- SCENE init --    
    camera.position.set(0, 15, 30);
    camera.far = 80;    

    scene = Scene.create();    
    Scene.addGridHelper(scene, 40, 40).helper.visible = true; // adiciona grid de referência
    Scene.addAxesHelper(scene, 32).helper.visible = true; // adiciona eixos de referência
    Scene.addCameraHelper(scene, camera).helper.visible = false; // adiciona helper da câmera

    scene.background = new THREE.Color("lightgray");
   
    // adiciona piso (floor) com altura
    const floor = Floor.createPlaneFloor(50, 50);
    floor.material.color.set('darkgray');
    scene.add(floor);

    // iluminação
    const ambientLight = Light.createAmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = Light.createDirectionalLight(2.5, 8, 8, 0xffffff, 1);

    // adiciona helper da iluminação
    const dlHelper = Light.createDirectionalLightHelper(directionalLight, 3);
    dlHelper.visible = true;

    scene.add(directionalLight, dlHelper); 

    // objetos na cena!
    let geometry = new THREE.BoxGeometry( 5, 5, 5 );
    let material = new THREE.MeshBasicMaterial( { color: 'blue', wireframe: false} );
    cube = new THREE.Mesh( geometry, material );
    cube.position.set(-10, 5, 0);
    scene.add( cube );

    // esfera
    const localPlanes = [
      new THREE.Plane(new THREE.Vector3(0, -1, 0), 5) // corte de parte do objeto na renderização
    ];

    sphere = new THREE.Mesh( 
      new THREE.SphereGeometry( 3, 32, 32 ), 
      new THREE.MeshPhongMaterial( 
        { 
          color: 0x049ef4, 
          wireframe: false,
          side: THREE.DoubleSide,
          shininess: 90, 
          clippingPlanes: localPlanes, // corte de parte do objeto na renderização
          clipIntersection: true       // corte de parte do objeto na renderização
        } ) 
    );
    sphere.position.set(-3, 5, 0);
    sphere.receiveShadow = false;
    sphere.castShadow = true;
    scene.add( sphere );

    // torus
    torus = new THREE.Mesh( 
      new THREE.TorusGeometry( 3, 2, 32, 100 ),  
      new THREE.MeshStandardMaterial( { color: 'red' } ) );

    torus.position.set(6, 5, 0);
    scene.add( torus );

    // cilindro
    cylinder = new THREE.Mesh( 
      new THREE.CylinderGeometry( 3, 3, 15, 64 ), 
      new THREE.MeshLambertMaterial( { color: 'green' } ) );
    
    cylinder.position.set(18, 5, 0);
    scene.add( cylinder );

    
    guiControls.addCameraFolder(camera, controls);
    guiControls.addLightFolder(ambientLight);    
    guiControls.addLightFolder(directionalLight, dlHelper);
    guiControls.addSceneFolder(scene);
    guiControls.datGui.open();
  }

  render() {
    renderer.setAnimationLoop(() => {        
      //mainGroup.rotation.y += 0.005;

      controls.update();
      renderer.render(scene, camera);
    });
  }

}

export { Exercicio_01 };
