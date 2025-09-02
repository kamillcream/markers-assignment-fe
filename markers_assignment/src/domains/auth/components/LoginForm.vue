<template>
  <BCard
    class="w-100 mx-auto"
    style="max-width: 28rem"
    body-class="p-0 overflow-hidden"
  >
    <!-- 헤더 -->
    <div
      class="text-center p-4 pb-3 bg-primary bg-gradient text-white position-relative"
    >
      <div
        class="d-flex align-items-center justify-content-center mx-auto mb-3 rounded-circle bg-opacity-25 bg-white"
        style="width: 64px; height: 64px"
      >
        <!-- 체크 아이콘 -->
        <svg width="28" height="28" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 class="h4 fw-bold mb-1">다시 오신 것을 환영합니다!</h1>
      <p class="text-white-50 mb-0 small">계속하려면 로그인하세요</p>
    </div>

    <!-- 로그인 폼 -->
    <div class="px-4 pb-4 pt-3">
      <BForm @submit.prevent="handleLogin" class="gap-3 d-grid">
        <!-- 이메일 -->
        <BFormGroup
          label="이메일 또는 사용자명"
          label-class="fw-medium small text-body-secondary"
          label-for="email"
        >
          <BFormInput
            id="email"
            v-model="loginForm.email"
            :state="!emailError"
            :placeholder="emailError || '이메일 또는 사용자명을 입력하세요'"
            @input="clearError('email')"
            autocomplete="username"
          />
          <BFormInvalidFeedback v-if="emailError">{{
            emailError
          }}</BFormInvalidFeedback>
        </BFormGroup>

        <!-- 비밀번호 -->
        <BFormGroup
          label="비밀번호"
          label-class="fw-medium small text-body-secondary"
          label-for="password"
        >
          <BInputGroup>
            <BFormInput
              id="password"
              v-model="loginForm.password"
              :type="showPassword ? 'text' : 'password'"
              :state="!passwordError"
              :placeholder="passwordError || '비밀번호를 입력하세요'"
              @input="clearError('password')"
              autocomplete="current-password"
            />
            <BInputGroupText class="bg-transparent">
              <BButton
                size="sm"
                variant="link"
                class="text-secondary text-decoration-none p-0"
                @click="togglePasswordVisibility"
                :aria-label="showPassword ? '비밀번호 숨기기' : '비밀번호 보기'"
              >
                <svg
                  v-if="!showPassword"
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fill-rule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <svg
                  v-else
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 9.542 3a9.284 9.284 0 00-3.536.691l-2.299-2.298z"
                    clip-rule="evenodd"
                  />
                  <path
                    d="M6.238 5.652a7.025 7.025 0 011.304-.591C8.211 4.775 8.84 4.5 9.542 4.5c3.179 0 5.872 2.162 6.66 5.086a8.065 8.065 0 01-1.039 1.803l-1.415-1.415a2 2 0 11-2.828-2.828L6.238 5.652z"
                  />
                </svg>
              </BButton>
            </BInputGroupText>
          </BInputGroup>
          <BFormInvalidFeedback v-if="passwordError">{{
            passwordError
          }}</BFormInvalidFeedback>
        </BFormGroup>

        <!-- 비밀번호 찾기 -->
        <div class="text-end">
          <BButton
            variant="link"
            size="sm"
            class="text-primary text-decoration-none"
            @click="moveToRegisterPage()"
          >
            회원가입
          </BButton>
          <BButton
            variant="link"
            size="sm"
            class="text-primary text-decoration-none"
            @click="showForgotPassword = true"
          >
            비밀번호 재설정
          </BButton>
        </div>

        <!-- 로그인 버튼 -->
        <BButton
          type="submit"
          variant="primary"
          class="w-100 d-flex align-items-center justify-content-center gap-2"
          :disabled="isLoading"
        >
          <BSpinner v-if="isLoading" small />
          <span>{{ isLoading ? "로그인 중..." : "로그인" }}</span>
        </BButton>
      </BForm>
    </div>
  </BCard>
</template>

<script setup>
import { ref, reactive, defineEmits } from "vue";
import {
  BCard,
  BForm,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  BInputGroup,
  BInputGroupText,
  BButton,
  BSpinner,
  BModal,
} from "bootstrap-vue-3";
import { useRouter } from "vue-router";

const router = useRouter();

const emit = defineEmits(["login-success", "redirect-signup"]);

function handleRedirectSignUp() {
  emit("redirect-signup");
}

// 상태 관리
const isLoading = ref(false);
const isResetting = ref(false);
const showPassword = ref(false);
const showForgotPassword = ref(false);
const showToast = ref(false);
const toastMessage = ref("");

// 폼 데이터
const loginForm = reactive({
  email: "",
  password: "",
});

const resetEmail = ref("");

// 에러 상태
const emailError = ref("");
const passwordError = ref("");

// 에러 클리어
const clearError = (field) => {
  if (field === "email") emailError.value = "";
  if (field === "password") passwordError.value = "";
};

// 비밀번호 표시/숨김
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const moveToRegisterPage = () => {
  router.push("/register");
};

// 폼 검증
const validateForm = () => {
  let isValid = true;

  if (!loginForm.email.trim()) {
    emailError.value = "이메일 또는 사용자명을 입력해주세요";
    isValid = false;
  }

  if (!loginForm.password.trim()) {
    passwordError.value = "비밀번호를 입력해주세요";
    isValid = false;
  }

  return isValid;
};

// 토스트 표시
const showToastMessage = (message) => {
  toastMessage.value = message;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

// 로그인 처리
const handleLogin = async () => {
  clearError("email");
  clearError("password");

  if (!validateForm()) return;

  emit("login-success", {
    email: loginForm.email,
    password: loginForm.password,
  });
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

// 비밀번호 재설정 이메일 전송
const sendResetEmail = async () => {
  isResetting.value = true;

  try {
    // 실제로는 API 호출
    await new Promise((resolve) => setTimeout(resolve, 1500));

    showToastMessage("비밀번호 재설정 이메일을 전송했습니다!");
    showForgotPassword.value = false;
    resetEmail.value = "";
  } catch (error) {
    showToastMessage("이메일 전송 중 오류가 발생했습니다");
  } finally {
    isResetting.value = false;
  }
};
</script>

<style>
/* 커스텀 배경색 */
.bg-gray-750 {
  background-color: #374151;
}

/* 플레이스홀더 에러 스타일 */
input.border-red-500::placeholder {
  color: #fca5a5;
}

/* 애니메이션 */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fixed.top-4.right-4 {
  animation: slideIn 0.3s ease-out;
}

/* 호버 효과 */
.hover\:bg-blue-700:hover {
  background-color: #1d4ed8;
}

.hover\:bg-gray-750:hover {
  background-color: #374151;
}

.hover\:bg-gray-600:hover {
  background-color: #4b5563;
}

.hover\:text-blue-300:hover {
  color: #93c5fd;
}

.hover\:text-gray-300:hover {
  color: #d1d5db;
}

/* 포커스 효과 */
input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

/* 버튼 비활성화 상태 */
button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
