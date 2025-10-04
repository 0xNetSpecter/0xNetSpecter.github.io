import * as THREE from "three";
import { createWorld } from "./world";
import { Character } from "./character";

export function startGame(canvas: HTMLElement) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x808080);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  canvas.appendChild(renderer.domElement);

  const ambient = new THREE.AmbientLight(0xffffff, 1.2);
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

  createWorld(scene, aspect);

  const hero = new Character(scene);

  const clock = new THREE.Clock();

  renderer.setAnimationLoop(() => {
    const dt = clock.getDelta();
    hero.update(dt);

    if (hero.mesh) {
      camera.position
        .copy(hero.mesh.position)
        .add(new THREE.Vector3(0, 20, 15));
      camera.lookAt(hero.mesh.position);
    }

    renderer.render(scene, camera);
  });

  window.addEventListener("resize", () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const aspect = w / h;

    camera.left = (-viewSize * aspect) / 2;
    camera.right = (viewSize * aspect) / 2;
    camera.top = viewSize / 2;
    camera.bottom = -viewSize / 2;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}
