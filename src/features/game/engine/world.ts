import * as THREE from "three";
import groundUrl from "@game/assets/ground.png";
import buildingPath from "@features/game/assets/building/buildings.obj?url";
import { loadOBJ } from "./loaders";

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

  buildEnvironment(scene);
}

export async function buildEnvironment(scene: THREE.Scene) {
  const group = new THREE.Group();
  group.name = "Environment";

  const root = await loadOBJ(buildingPath);
  if (root.children.length > 0) {
    root.children.forEach((element) => {
      element.position.set(0, 1, 0);
      element.scale.setScalar(0.1);
      group.add(element);
    });
  }
  scene.add(group);
  const b = group.getObjectByName("BuildingS2");
  if (b) {
    b.position.set(5, 0, 5);
    b.scale.setScalar(0.1);
  }
  return group;
}
