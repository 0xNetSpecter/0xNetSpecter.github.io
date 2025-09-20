import * as THREE from "three";
import { createWorld } from "./world";
import { Character } from "./character";

export function startGame(canvas) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x808080);

  const w = canvas.clientWidth;
  const h = canvas.clientHeight;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  canvas.appendChild(renderer.domElement);

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h);
    camera.left = (-viewSize * (w / h)) / 2;
    camera.right = (viewSize * (w / h)) / 2;
    camera.top = viewSize / 2;
    camera.bottom = -viewSize / 2;
    camera.updateProjectionMatrix();
    createWorld(scene, w / h);
  }

  window.addEventListener("resize", resize);
  createWorld(scene, w / h);

  const ambient = new THREE.AmbientLight(0xcc66ff, 1.2);
  scene.add(ambient);
  const viewSize = 40;
  const aspect = canvas.clientWidth / canvas.clientHeight;
  const camera = new THREE.OrthographicCamera(
    (-viewSize * aspect) / 2,
    (viewSize * aspect) / 2,
    viewSize / 2,
    -viewSize / 2,
    0.1,
    1000
  );
  camera.position.set(0, 20, 15);
  camera.lookAt(0, 0, 0);
  renderer.shadowMap.enabled = true;

  resize();
  const hero = new Character();
  scene.add(hero.mesh);

  const clock = new THREE.Clock();

  renderer.setAnimationLoop(() => {
    const dt = clock.getDelta();
    hero.update(dt);

    // const desired = new THREE.Vector3()
    //   .copy(hero.mesh.position)
    //   .add(new THREE.Vector3(0, 12, 8));
    camera.position.copy(hero.mesh.position).add(new THREE.Vector3(0, 20, 15));
    camera.lookAt(hero.mesh.position);

    renderer.render(scene, camera);
  });
}
