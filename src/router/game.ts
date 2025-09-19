import type { RouteRecordRaw } from "vue-router";

export const gameRoutes: RouteRecordRaw[] = [
  {
    path: "/game",
    name: "game",
    component: () => import("@features/game/GameView.vue"),
    meta: { section: "game" },
  },
];
