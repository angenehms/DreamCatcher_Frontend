import { apiClient } from './apiClient';

export const waitingService = {
  enterQueue: async () => {
    await apiClient.post('/api/v1/waiting');
  },
  checkStatus: async (): Promise<number> => {
    const { data } = await apiClient.get<number | string>('/api/v1/waiting/status');

    // 숫자 응답 (명세 준수 케이스): -1 = ACTIVE, 양수 = 대기 순위
    if (typeof data === 'number') return data;

    if (typeof data === 'string') {
      const trimmed = data.trim();

      // 숫자 문자열 먼저 시도 (예: "3", "-1")
      const asNum = Number(trimmed);
      if (!isNaN(asNum)) return asNum;

      // 백엔드가 "상태: ACTIVE (...)" 같은 문자열을 줄 때 ACTIVE로 처리
      // → includes 방식 사용 (정확한 단어 경계 체크 포함)
      if (trimmed.toUpperCase().includes('ACTIVE')) return -1;

      // "-1L" 같이 Long suffix가 붙은 경우
      if (trimmed.endsWith('L') || trimmed.endsWith('l')) {
        const withoutL = Number(trimmed.slice(0, -1));
        if (!isNaN(withoutL)) return withoutL;
      }

      // 처리 불가한 응답 → 콘솔 경고 후 0 반환 (대기 유지)
      console.warn('[waitingService] Unrecognized status response:', trimmed);
      return 0;
    }

    return 0;
  },
};

