import { apiClient } from './apiClient';

// ── 응답 타입 정의 (api-spec.md 기준) ──────────────────────────────────────
export interface WaitingStatusResponse {
  status: 'WAITING' | 'ACTIVE' | 'NOT_FOUND';
  aheadCount: number; // 내 앞 대기자 수. ACTIVE=0, NOT_FOUND=-1
  message: string;
}

export const waitingService = {
  /** 1.1 대기열 진입: POST /api/v1/waiting */
  enterQueue: async (): Promise<void> => {
    await apiClient.post('/api/v1/waiting');
  },

  /** 1.2 대기열 상태 확인: GET /api/v1/waiting/status */
  checkStatus: async (): Promise<WaitingStatusResponse> => {
    const { data } = await apiClient.get<unknown>('/api/v1/waiting/status');

    // 실제 응답 구조를 개발 중에 확인할 수 있도록 로깅
    console.debug('[waitingService] raw response:', data);

    // ── Case 1: 정상 JSON 객체 응답 (api-spec.md 명세 기준)
    if (data !== null && typeof data === 'object') {
      const obj = data as Record<string, unknown>;

      // status 필드 정규화
      const rawStatus = (obj.status as string | undefined)?.toUpperCase();
      const status: WaitingStatusResponse['status'] =
        rawStatus === 'ACTIVE'    ? 'ACTIVE'    :
        rawStatus === 'NOT_FOUND' ? 'NOT_FOUND' :
        'WAITING';

      // aheadCount 필드 방어 파싱 (필드명이 다를 수 있는 경우 대비)
      const rawAhead =
        obj.aheadCount  ??  // 명세 기준 필드명
        obj.ahead_count ??  // snake_case 대비
        obj.waitingCount ??
        obj.count        ??
        0;
      const aheadCount = isNaN(Number(rawAhead)) ? 0 : Number(rawAhead);

      const message = (obj.message as string | undefined) ?? '';

      return { status, aheadCount, message };
    }

    // ── Case 2: 레거시 숫자 응답 (-1 = ACTIVE, 양수 = 대기 순위)
    if (typeof data === 'number') {
      if (data === -1) return { status: 'ACTIVE',  aheadCount: 0,        message: '' };
      return               { status: 'WAITING', aheadCount: data - 1, message: '' };
    }

    // ── Case 3: 레거시 문자열 응답
    if (typeof data === 'string') {
      const trimmed = (data as string).trim();

      if (trimmed.toUpperCase().includes('ACTIVE')) {
        return { status: 'ACTIVE', aheadCount: 0, message: trimmed };
      }

      // "내 앞의 대기자 수: N명" 형식 파싱
      const aheadMatch = trimmed.match(/내\s*앞의?\s*대기자\s*수[:\s]*(\d+)/);
      if (aheadMatch) {
        return { status: 'WAITING', aheadCount: Number(aheadMatch[1]), message: trimmed };
      }

      // 순수 숫자 문자열
      const asNum = Number(trimmed.replace(/[^\d-]/g, ''));
      if (!isNaN(asNum)) {
        if (asNum === -1) return { status: 'ACTIVE',  aheadCount: 0,          message: '' };
        return               { status: 'WAITING', aheadCount: Math.max(0, asNum - 1), message: '' };
      }
    }

    console.warn('[waitingService] Unrecognized response format:', data);
    return { status: 'WAITING', aheadCount: 0, message: '' };
  },
};
