<template>
  <div class="min-h-screen bg-gray-700 flex items-center justify-center p-4">
    <LoginForm @login-success="onLogin" @redirect-signup="goToSignup" />
  </div>
</template>

<script setup>
import { api } from "@/axios.js";

import LoginForm from "../components/LoginForm.vue";
import { useRouter } from "vue-router";

const router = useRouter();

// 로그인 처리
const onLogin = async ({ email, password }) => {
  try {
    const res = await api.$post(
      "/login",
      { email, password },
      { withCredentials: true }
    );
    router.push("/user");
  } catch (e) {
    console.error("로그인 실패", e);
    showToastMessage("아이디나 비밀번호를 확인해주세요.");
  }
};

// 소셜 로그인
const loginWithGoogle = () => {
  showToastMessage("Google 로그인 준비 중...");
  // 실제로는 OAuth 처리
};

const loginWithGithub = () => {
  showToastMessage("GitHub 로그인 준비 중...");
  // 실제로는 OAuth 처리
};

// 회원가입 페이지로 이동
const goToSignup = () => {
  router.push("/signUp");
};
</script>

<style scoped></style>
