import { createRouter, createWebHistory } from "vue-router";

import LoginPage from "@/domains/auth/pages/LoginPage.vue";
import RegisterPage from "@/domains/auth/pages/RegisterPage.vue";
import UserInfoPage from "@/domains/user/pages/UserInfoPage.vue";

const routes = [
  {
    path: "/",
    component: LoginPage,
    name: "LoginPage",
  },
  {
    path: "/register",
    component: RegisterPage,
    name: "RegisterPage",
  },
  {
    path: "/user",
    component: UserInfoPage,
    name: "UserInfoPage",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export default router;
