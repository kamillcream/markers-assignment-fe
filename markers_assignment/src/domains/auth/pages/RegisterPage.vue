<template>
  <div class="min-h-screen bg-gray-700 flex items-center justify-center p-4">
    <!-- 배경 패턴 -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute inset-0"></div>
    </div>
    <RegisterForm @try-register="handleSignup" />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { api } from "@/axios.js";
import { useRouter } from "vue-router";

import RegisterForm from "../components/RegisterForm.vue";

const router = useRouter();

// 회원가입 처리
const handleSignup = async ({ name, email, password }) => {
  try {
    await api.$post("/api/users/register", {
      name,
      email,
      password,
    });
    alert("회원가입이 정상적으로 완료되었습니다.");
    router.push("/");
  } catch (error) {
    showToastMessage("회원가입 중 오류가 발생했습니다");
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped></style>
