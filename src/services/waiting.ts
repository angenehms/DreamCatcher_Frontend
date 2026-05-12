import { apiClient } from './apiClient';

export const waitingService = {
  enterQueue: async () => {
    await apiClient.post('/api/v1/waiting');
  },

  checkStatus: async (): Promise<number> => {
    const { data } = await apiClient.get<number | string>('/api/v1/waiting/status');

    // ── Case 1: 순수 숫자 응답 (-1 = ACTIVE, 양수 = 대기 순위)
    if (typeof data === 'number') return data;

    if (typeof data === 'string') {
      const trimmed = data.trim();

      // ── Case 2: 순수 숫자 문자열 ("3", "-1")
      const asNum = Number(trimmed);
      if (!isNaN(asNum)) return asNum;

      // ── Case 3: "-1L" 같이 Long suffix가 붙은 경우
      if (trimmed.endsWith('L') || trimmed.endsWith('l')) {
        const withoutL = Number(trimmed.slice(0, -1));
        if (!isNaN(withoutL)) return withoutL;
      }

      // ── Case 4: ACTIVE 문자열 포함 → 통과 처리
      //    예: "상태: ACTIVE / ..." or "ACTIVE"
      if (trimmed.toUpperCase().includes('ACTIVE')) return -1;

      // ── Case 5: "상태: WAITING / 내 앞의 대기자 수: 5955명" 형식
      //    "내 앞의 대기자 수: N명" 에서 N을 추출 → rank = N + 1 (내 순번)
      const aheadMatch = trimmed.match(/내\s*앞의\s*대기자\s*수[:\s]*(\d+)/);
      if (aheadMatch) {
        const ahead = parseInt(aheadMatch[1], 10);
        // ahead = 내 앞에 있는 사람 수
        // rank(순번) = ahead + 1 (내가 몇 번째인지)
        return ahead + 1;
      }

      // ── Case 6: 그 외 알 수 없는 형식
      console.warn('[waitingService] Unrecognized status response:', trimmed);
      return 0;
    }

    return 0;
  },
};
