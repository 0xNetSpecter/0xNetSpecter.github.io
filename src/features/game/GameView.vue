<template>
  <main ref="mountRef" class="game-root"></main>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { startGame } from "./engine/startGame";
import * as THREE from "three";

const mountRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (!mountRef.value) return;

  startGame(mountRef.value);
});
</script>

<style scoped>
.game-root {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
