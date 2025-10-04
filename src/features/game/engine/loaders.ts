import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import * as THREE from "three";

export function loadOBJ(path: string): Promise<THREE.Object3D> {
  return new Promise((resolve, reject) => {
    const loader = new OBJLoader();

    loader.load(
      path,
      (object) => resolve(object),
      undefined,
      (error) => reject(error)
    );
  });
}
