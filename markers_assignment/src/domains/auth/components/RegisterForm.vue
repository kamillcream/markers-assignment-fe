<template>
  <div>
    <!-- 전체 가운데 정렬 래퍼 -->
    <div
      class="min-vh-100 d-flex justify-content-center align-items-center px-3"
    >
      <!-- 카드 -->
      <BCard
        class="w-100"
        style="max-width: 28rem"
        body-class="p-0 overflow-hidden"
      >
        <!-- 헤더 -->
        <div
          class="text-center p-4 pb-3 bg-primary text-white position-relative"
        >
          <div
            class="d-flex align-items-center justify-content-center mx-auto mb-3 rounded-circle"
            style="
              width: 64px;
              height: 64px;
              background: linear-gradient(135deg, #22c55e, #2563eb);
            "
          >
            <!-- 유저 아이콘 -->
            <svg width="28" height="28" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <h1 class="h4 fw-bold mb-1">계정 만들기</h1>
          <p class="text-white-50 mb-0 small">
            스터디 그룹에 참여하고 함께 성장하세요!
          </p>
        </div>

        <!-- 폼 영역 -->
        <div class="px-4 pb-4 pt-3">
          <BForm @submit.prevent="emitFormData" class="d-grid gap-3">
            <!-- 이름 -->
            <BFormGroup
              label="이름"
              label-class="fw-medium small text-body-secondary"
              label-for="name"
            >
              <BFormInput
                id="name"
                v-model="signupForm.name"
                type="name"
                :placeholder="'이름을 입력하세요'"
                autocomplete="name"
              />
            </BFormGroup>
            <BFormGroup
              label="이메일"
              label-class="fw-medium small text-body-secondary"
              label-for="email"
            >
              <BFormInput
                id="email"
                v-model="signupForm.email"
                type="email"
                :state="signupForm.email ? !emailError : null"
                :placeholder="emailError || '이메일을 입력하세요'"
                @input="clearError('email')"
                @blur="validateEmail"
                autocomplete="email"
              />
              <BFormInvalidFeedback v-if="emailError">{{
                emailError
              }}</BFormInvalidFeedback>

              <div
                v-if="emailSuccess"
                class="d-flex align-items-center gap-2 mt-2 text-success small"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                사용 가능한 이메일입니다
              </div>
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
                  v-model="signupForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  :state="signupForm.password ? !passwordError : null"
                  :placeholder="
                    passwordError || '비밀번호를 입력하세요 (8자이상)'
                  "
                  @input="clearError('password')"
                  @blur="validatePassword"
                  autocomplete="new-password"
                />
                <BInputGroupText class="bg-transparent">
                  <BButton
                    size="sm"
                    variant="link"
                    class="text-secondary text-decoration-none p-0"
                    @click="togglePasswordVisibility"
                    :aria-label="
                      showPassword ? '비밀번호 숨기기' : '비밀번호 보기'
                    "
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

              <!-- 비밀번호 강도 -->
              <div v-if="signupForm.password" class="mt-2">
                <div class="d-flex align-items-center gap-2 mb-1">
                  <span class="small text-body-secondary">비밀번호 강도:</span>
                  <span
                    class="small fw-medium"
                    :class="{
                      'text-danger': passwordStrength.level === 'weak',
                      'text-warning': passwordStrength.level === 'medium',
                      'text-success': passwordStrength.level === 'strong',
                    }"
                  >
                    {{ passwordStrength.text }}
                  </span>
                </div>
                <div class="d-flex gap-1">
                  <div
                    v-for="i in 4"
                    :key="i"
                    class="flex-grow-1 rounded"
                    :style="{
                      height: '6px',
                      backgroundColor:
                        i <= passwordStrength.score
                          ? passwordStrength.level === 'weak'
                            ? '#dc3545'
                            : passwordStrength.level === 'medium'
                            ? '#ffc107'
                            : '#198754'
                          : '#ced4da',
                    }"
                  />
                </div>
              </div>
            </BFormGroup>

            <!-- 비밀번호 확인 -->
            <BFormGroup
              label="비밀번호 확인"
              label-class="fw-medium small text-body-secondary"
              label-for="confirm"
            >
              <BFormInput
                id="confirm"
                v-model="signupForm.confirmPassword"
                type="password"
                :state="
                  signupForm.confirmPassword ? !confirmPasswordError : null
                "
                :placeholder="
                  confirmPasswordError || '비밀번호를 다시 입력하세요'
                "
                @input="clearError('confirmPassword')"
                @blur="validateConfirmPassword"
                autocomplete="new-password"
              />
              <BFormInvalidFeedback v-if="confirmPasswordError">{{
                confirmPasswordError
              }}</BFormInvalidFeedback>

              <div
                v-if="passwordMatch && signupForm.confirmPassword"
                class="d-flex align-items-center gap-2 mt-2 text-success small"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                비밀번호가 일치합니다
              </div>
            </BFormGroup>

            <!-- 약관 동의 -->
            <div class="d-grid gap-2">
              <BFormCheckbox v-model="signupForm.agreeTerms" switch>
                <span class="small">
                  <span class="text-danger">*</span>
                  <BButton
                    variant="link"
                    class="p-0 align-baseline"
                    @click="showTerms = true"
                    >이용약관</BButton
                  >
                  및
                  <BButton
                    variant="link"
                    class="p-0 align-baseline"
                    @click="showPrivacy = true"
                    >개인정보처리방침</BButton
                  >
                  에 동의합니다
                </span>
              </BFormCheckbox>

              <BFormCheckbox v-model="signupForm.agreeMarketing" switch>
                <span class="small">마케팅 정보 수신에 동의합니다 (선택)</span>
              </BFormCheckbox>
            </div>

            <!-- 회원가입 버튼 -->
            <BButton
              type="submit"
              variant="success"
              class="w-100 d-flex align-items-center justify-content-center gap-2"
              :disabled="isLoading || !isFormValid"
            >
              <BSpinner v-if="isLoading" small />
              <span>{{ isLoading ? "계정 생성 중..." : "계정 만들기" }}</span>
            </BButton>
          </BForm>

          <!-- 로그인 링크 -->
          <div class="mt-4 text-center">
            <p class="text-muted small mb-0">
              이미 계정이 있으신가요?
              <BButton variant="link" class="p-0 ms-1" @click="goToLogin"
                >로그인</BButton
              >
            </p>
          </div>
        </div>
      </BCard>
    </div>

    <!-- 이용약관 모달 -->
    <BModal
      v-model="showTerms"
      title="이용약관"
      ok-title="닫기"
      hide-footer
      scrollable
    >
      <div class="text-body small d-grid gap-2">
        <p><strong>제1조 (목적)</strong></p>
        <p>
          본 약관은 스터디 챌린지 서비스(이하 "서비스")의 이용조건 및 절차,
          회사와 회원간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
        </p>
        <p><strong>제2조 (정의)</strong></p>
        <p>
          1. "서비스"란 회사가 제공하는 온라인 스터디 그룹 플랫폼을 의미합니다.
        </p>
        <p>
          2. "회원"이란 본 약관에 동의하고 서비스를 이용하는 자를 의미합니다.
        </p>
        <p><strong>제3조 (서비스 이용)</strong></p>
        <p>
          회원은 서비스를 건전한 목적으로만 이용해야 하며, 다른 회원에게 피해를
          주는 행위를 해서는 안 됩니다.
        </p>
      </div>
    </BModal>

    <!-- 개인정보처리방침 모달 -->
    <BModal
      v-model="showPrivacy"
      title="개인정보처리방침"
      ok-title="닫기"
      hide-footer
      scrollable
    >
      <div class="text-body small d-grid gap-2">
        <p><strong>1. 개인정보의 처리목적</strong></p>
        <ul class="mb-2">
          <li>서비스 제공 및 계약의 이행</li>
          <li>회원 관리 및 본인확인</li>
          <li>서비스 개선 및 신규 서비스 개발</li>
        </ul>
        <p><strong>2. 처리하는 개인정보의 항목</strong></p>
        <p>필수항목: 이메일, 비밀번호</p>
        <p>선택항목: 마케팅 수신 동의</p>
        <p><strong>3. 개인정보의 보유 및 이용기간</strong></p>
        <p>회원 탈퇴 시까지 보유하며, 탈퇴 후 즉시 파기합니다.</p>
      </div>
    </BModal>
  </div>
</template>

<script setup>
import { ref, reactive, defineEmits, computed } from "vue";
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
import { api } from "@/axios";

const emit = defineEmits(["try-register"]);

// 상태 관리
const isLoading = ref(false);
const showPassword = ref(false);
const showTerms = ref(false);
const showPrivacy = ref(false);
const showToast = ref(false);
const toastMessage = ref("");

// 폼 데이터
const signupForm = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  agreeTerms: false,
  agreeMarketing: false,
});

// 에러 상태
const emailError = ref("");
const passwordError = ref("");
const confirmPasswordError = ref("");

// 성공 상태
const emailSuccess = ref(false);
console.log(emailSuccess.value);

// 비밀번호 표시/숨김
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// 에러 클리어
const clearError = (field) => {
  if (field === "email") {
    emailError.value = "";
    emailSuccess.value = false;
  }
  if (field === "password") passwordError.value = "";
  if (field === "confirmPassword") confirmPasswordError.value = "";
};

// 이메일 검증
const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!signupForm.email) {
    emailError.value = "이메일을 입력해주세요";
    emailSuccess.value = false;
  } else if (!emailRegex.test(signupForm.email)) {
    emailError.value = "올바른 이메일 형식이 아닙니다";
    emailSuccess.value = false;
  } else {
    emailError.value = "";
    emailSuccess.value = true;
  }
};

// 비밀번호 강도 계산
const passwordStrength = computed(() => {
  const password = signupForm.password;
  if (!password) return { score: 0, level: "weak", text: "약함" };

  let score = 0;

  // 길이 체크
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  // 복잡성 체크
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score: 1, level: "weak", text: "약함" };
  if (score <= 4) return { score: 2, level: "medium", text: "보통" };
  return { score: 4, level: "strong", text: "강함" };
});

// 비밀번호 검증
const validatePassword = () => {
  if (!signupForm.password) {
    passwordError.value = "비밀번호를 입력해주세요";
  } else if (signupForm.password.length < 8) {
    passwordError.value = "비밀번호는 8자 이상이어야 합니다";
  } else {
    passwordError.value = "";
  }
};

// 비밀번호 일치 확인
const passwordMatch = computed(() => {
  return (
    signupForm.password &&
    signupForm.confirmPassword &&
    signupForm.password === signupForm.confirmPassword
  );
});

const validateConfirmPassword = () => {
  if (!signupForm.confirmPassword) {
    confirmPasswordError.value = "비밀번호 확인을 입력해주세요";
  } else if (signupForm.password !== signupForm.confirmPassword) {
    confirmPasswordError.value = "비밀번호가 일치하지 않습니다";
  } else {
    confirmPasswordError.value = "";
  }
};

// 폼 유효성 검사
const isFormValid = computed(() => {
  return (
    signupForm.name &&
    signupForm.email &&
    signupForm.password &&
    signupForm.confirmPassword &&
    signupForm.agreeTerms &&
    !emailError.value &&
    !passwordError.value &&
    !confirmPasswordError.value &&
    passwordMatch.value
  );
});

// 토스트 표시
const showToastMessage = (message) => {
  toastMessage.value = message;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

// 회원가입 처리
const emitFormData = async () => {
  validateEmail();
  validatePassword();
  validateConfirmPassword();

  if (!isFormValid.value) return;

  emit("try-register", {
    email: signupForm.email,
    password: signupForm.password,
    name: signupForm.name,
  });
};
</script>

<style scoped>
/* 커스텀 배경색 */
.bg-gray-750 {
  background-color: #374151;
}

/* 플레이스홀더 에러 스타일 */
input.border-red-500::placeholder {
  color: #fca5a5;
}

/* 체크박스 스타일 */
input[type="checkbox"] {
  accent-color: #3b82f6;
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
.hover\:bg-green-700:hover {
  background-color: #15803d;
}

.hover\:bg-gray-750:hover {
  background-color: #374151;
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

/* 스크롤바 스타일 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #374151;
}

::-webkit-scrollbar-thumb {
  background: #6b7280;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
