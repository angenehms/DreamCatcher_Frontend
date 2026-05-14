import { apiClient } from './apiClient';

// ── 응답 타입 정의 (api-spec.md 기준) ──────────────────────────────────────
export interface SeatReserveResponse {
  seatId: number;
  userId: string;
  message: string;
}

export const seatService = {
  /** 2.1 좌석 임시 선점: POST /api/v1/seats/{seatId}/reserve */
  reserveSeat: async (seatId: number): Promise<SeatReserveResponse> => {
    const { data } = await apiClient.post<SeatReserveResponse>(`/api/v1/seats/${seatId}/reserve`);
    return data;
  },
};
