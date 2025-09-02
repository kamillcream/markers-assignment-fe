import axios from "axios";

const baseUrl = "http://localhost:8080";

const apiInstance = axios.create({
  baseURL: baseUrl,
  timeout: 15000,
});

// (옵션) 요청 인터셉터 - 헤더 토큰 주입
apiInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token"); // 쿠키만 쓰면 생략
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ====== 401 재발급 큐 ======
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve(token);
  });
  failedQueue = [];
};

// 응답 인터셉터
apiInstance.interceptors.response.use(
  // 성공 응답은 data만 리턴하게 만들면 호출부가 더 깔끔해짐
  (response) => response,
  async (error) => {
    const { response, config } = error;
    const originalRequest = config;

    // 네트워크/타임아웃
    if (!response) {
      // 네트워크 오류 공통 처리
      console.error("Network error:", error.message);
      return Promise.reject(error);
    }

    // 401 처리 (refresh 한 번만 시도)
    if (response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // refresh 중이면 큐에 쌓았다가 재시도
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;
      try {
        // refresh-token은 쿠키로 전송된다고 했으니 바디 없이 호출
        const refreshRes = await apiInstance.post("refresh-token");

        // 만약 새 access token을 바디나 헤더로 내려준다면 여기서 반영
        const newToken =
          refreshRes?.data?.result?.accessToken ||
          refreshRes?.data?.accessToken ||
          null;
        if (newToken) {
          localStorage.setItem("access_token", newToken);
          apiInstance.defaults.headers.Authorization = `Bearer ${newToken}`;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        processQueue(null, newToken);
        return apiInstance(originalRequest); // 원요청 재시도
      } catch (err) {
        processQueue(err, null);
        // 전역 로그아웃/로그인 리다이렉트
        localStorage.removeItem("access_token");
        // window.location.href = "/login"; // 필요시
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // 그 외 상태코드 공통 처리 (선택)
    switch (response.status) {
      case 400:
        console.warn("Bad Request:", response.data);
        break;
      case 403:
        console.warn("Forbidden");
        break;
      case 404:
        console.warn("Not Found");
        break;
      case 409:
        console.warn("Conflict");
        break;
      default:
        if (response.status >= 500) {
          console.error("Server Error");
        }
    }

    return Promise.reject(error);
  }
);

// 공통 HTTP 메서드
const api = {
  async $get(url, params, config = {}) {
    const res = await apiInstance.get(url.replace(/^\//, ""), {
      ...config,
      params,
    });
    return res.data;
  },
  async $post(url, data, config = {}) {
    const res = await apiInstance.post(url.replace(/^\//, ""), data, config);
    return res.data;
  },
  async $put(url, data, config = {}) {
    const res = await apiInstance.put(url.replace(/^\//, ""), data, config);
    return res.data;
  },
  async $patch(url, data, config = {}) {
    const res = await apiInstance.patch(url.replace(/^\//, ""), data, config);
    return res.data;
  },
  async $delete(url, config = {}) {
    const res = await apiInstance.delete(url.replace(/^\//, ""), config);
    return res.data;
  },
};

export { api, baseUrl };
