import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// 로컬 환경의 Nginx를 가리킵니다.
export const apiClient = axios.create({
  baseURL: 'http://localhost',
  timeout: 10000,
});

// 모든 요청에 X-User-Id 헤더를 자동으로 추가하는 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    const userId = useAuthStore.getState().userId;
    if (userId) {
      config.headers['X-User-Id'] = userId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
