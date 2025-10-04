import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export class Character {
  public mixer?: THREE.AnimationMixer;
  public actions: Record<string, THREE.AnimationAction> = {};
  public currentAction?: THREE.AnimationAction;

  public mesh: THREE.Object3D | null = null;
  public speed = 6;
  public damping = 10;

  private _dir = new THREE.Vector3();
  private _input = { up: false, down: false, left: false, right: false };
  private _onKeyDown: (e: KeyboardEvent) => void;
  private _onKeyUp: (e: KeyboardEvent) => void;

  private _isRunning = false;

  private ANIM_MAP = {
    idle: "Idle",
    walk: "Walk",
    run: "Run",
    attack: "Dagger_Attack",
    hit: "RecieveHit",
    death: "Death",
  };

  constructor(scene) {
    const loader = new GLTFLoader();

    loader.load(
      "/assets/Character.glb",
      (gltf) => {
        this.mesh = gltf.scene;
        this.mesh.position.set(0, 0, 0);
        this.mesh.scale.setScalar(1);
        this.mesh.traverse((obj) => {
          obj.castShadow = true;
          obj.receiveShadow = true;
        });
        scene.add(this.mesh);

        this.mixer = new THREE.AnimationMixer(this.mesh);
        gltf.animations.forEach((clip) => {
          this.actions[clip.name] = this.mixer!.clipAction(clip);
        });

        this.play(this.ANIM_MAP.idle);
      },
      undefined,
      (err) => console.error("Ошибка загрузки персонажа:", err)
    );

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
        case "ShiftLeft":
        case "ShiftRight":
          this._isRunning = true;
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
        case "ShiftLeft":
        case "ShiftRight":
          this._isRunning = false;
          break;
      }
    };

    window.addEventListener("keydown", this._onKeyDown);
    window.addEventListener("keyup", this._onKeyUp);
  }

  update(dt: number) {
    if (!this.mesh) return;

    this._dir.set(
      (this._input.right ? 1 : 0) - (this._input.left ? 1 : 0),
      0,
      (this._input.down ? 1 : 0) - (this._input.up ? 1 : 0)
    );

    const isMoving = this._dir.lengthSq() > 0;

    if (isMoving) {
      const moveSpeed = this._isRunning ? this.speed * 2 : this.speed;
      this._dir.normalize().multiplyScalar(moveSpeed * dt);
      this.mesh.position.add(this._dir);

      const targetYaw = Math.atan2(this._dir.x, this._dir.z);
      const q = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(0, targetYaw, 0)
      );
      this.mesh.quaternion.slerp(q, 1 - Math.exp(-this.damping * dt));

      if (this._isRunning) {
        this.play(this.ANIM_MAP.run);
      } else {
        this.play(this.ANIM_MAP.walk);
      }
    } else {
      this.play(this.ANIM_MAP.idle);
    }

    if (this.mixer) this.mixer.update(dt);
  }

  play(name: string) {
    if (!this.mixer || !this.actions[name]) return;

    const next = this.actions[name];
    if (this.currentAction === next) return;

    if (this.currentAction) {
      this.currentAction.fadeOut(0.15);
    }

    this.currentAction = next;
    this.currentAction.reset().fadeIn(0.15).play();
  }

  dispose() {
    window.removeEventListener("keydown", this._onKeyDown);
    window.removeEventListener("keyup", this._onKeyUp);
  }
}
