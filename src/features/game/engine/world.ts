import * as THREE from "three";
import groundUrl from "@game/assets/ground.png";

let plane: THREE.Mesh | null = null;

export function createWorld(scene: THREE.Scene, aspect: number) {
  if (plane) {
    scene.remove(plane);
    plane.geometry.dispose();
    (plane.material as THREE.Material).dispose();
  }

  const loader = new THREE.TextureLoader();
  const texture = loader.load(groundUrl);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;

  const viewSize = 70;
  const width = viewSize * aspect;
  const height = viewSize;

  texture.repeat.set(width, height);

  const geometry = new THREE.PlaneGeometry(width, height);
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 1.0,
    metalness: 0.0,
    side: THREE.DoubleSide,
  });

  plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);
}
