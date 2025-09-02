<template>
  <div class="min-vh-100 d-flex justify-content-center align-items-center">
    <BCard class="p-4" style="max-width: 28rem">
      <h2 class="mb-3">사용자 정보</h2>
      <p><strong>이메일:</strong> {{ user.email }}</p>
      <p><strong>이름:</strong> {{ user.name }}</p>

      <BButton variant="danger" class="mt-3" @click="logout">로그아웃</BButton>
    </BCard>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { api } from "@/axios";

const router = useRouter();
const user = ref({});

onMounted(async () => {
  const res = await api.$get("/api/users/me", null, {
    withCredentials: true,
  });
  user.value = res.result;
});

const logout = async () => {
  await api.$post("/logout", null, {
    withCredentials: true,
  });
  router.push("/");
};
</script>
