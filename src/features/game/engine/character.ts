import * as THREE from "three";

export class Character {
  public mesh: THREE.Mesh;
  public speed = 6;
  public damping = 10;

  private _dir = new THREE.Vector3();
  private _input = { up: false, down: false, left: false, right: false };
  private _onKeyDown: (e: KeyboardEvent) => void;
  private _onKeyUp: (e: KeyboardEvent) => void;

  constructor() {
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x55ccff,
      metalness: 0,
      roughness: 1,
    });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.set(0, 0.5, 0);
    this.mesh.castShadow = true;

    this._onKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          this._input.up = true;
          break;
        case "KeyS":
        case "ArrowDown":
          this._input.down = true;
          break;
        case "KeyA":
        case "ArrowLeft":
          this._input.left = true;
          break;
        case "KeyD":
        case "ArrowRight":
          this._input.right = true;
          break;
      }
    };

    this._onKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          this._input.up = false;
          break;
        case "KeyS":
        case "ArrowDown":
          this._input.down = false;
          break;
        case "KeyA":
        case "ArrowLeft":
          this._input.left = false;
          break;
        case "KeyD":
        case "ArrowRight":
          this._input.right = false;
          break;
      }
    };

    window.addEventListener("keydown", this._onKeyDown);
    window.addEventListener("keyup", this._onKeyUp);
  }

  update(dt: number) {
    this._dir.set(
      (this._input.right ? 1 : 0) - (this._input.left ? 1 : 0),
      0,
      (this._input.down ? 1 : 0) - (this._input.up ? 1 : 0)
    );

    if (this._dir.lengthSq() > 0) {
      this._dir.normalize().multiplyScalar(this.speed * dt);
      this.mesh.position.add(this._dir);

      const targetYaw = Math.atan2(this._dir.x, this._dir.z);
      const q = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(0, targetYaw, 0)
      );
      this.mesh.quaternion.slerp(q, 1 - Math.exp(-this.damping * dt));
    }
  }

  dispose() {
    window.removeEventListener("keydown", this._onKeyDown);
    window.removeEventListener("keyup", this._onKeyUp);
  }
}
