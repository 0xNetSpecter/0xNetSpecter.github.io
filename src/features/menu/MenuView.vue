<template>
  <section class="menu">
    <router-link to="/game">Game</router-link>
    <router-link to="/classic">Classic Site</router-link>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<style scoped>
.menu {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  flex-direction: column;
  gap: 15px;

  a {
    font-size: 30px;
    color: black;
  }
}
</style>
