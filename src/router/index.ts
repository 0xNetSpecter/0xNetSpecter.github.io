import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import { classicRoutes } from "./classic";
import { gameRoutes } from "./game";

const menuRoute: RouteRecordRaw = {
  path: "/",
  name: "menu",
  component: () => import("@features/menu/MenuView.vue"),
  meta: { section: "menu" },
};

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    menuRoute,
    ...classicRoutes,
    ...gameRoutes,
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});
