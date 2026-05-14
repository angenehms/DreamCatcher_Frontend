import { apiClient } from './apiClient';

// ── 데이터 타입 정의 (seat-db-structure.md 기준) ──────────────────────────────
export type SeatStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD';

export interface Seat {
  seatId: number;
  concertScheduleId: number;
  seatNumber: number;
  seatStatus: SeatStatus;
  price: number;
  reservedByUserId: string | null;
}

export interface SeatReserveResponse {
  seatId: number;
  userId: string;
  message: string;
}

export const seatService = {
  /** 좌석 목록 조회: GET /api/v1/seats/concert-schedules/{id} */
  getSeats: async (scheduleId: number = 1): Promise<Seat[]> => {
    const { data } = await apiClient.get<Seat[]>(`/api/v1/seats/concert-schedules/${scheduleId}`);
    return data;
  },

  /** 2.1 좌석 임시 선점: POST /api/v1/seats/{seatId}/reserve */
  reserveSeat: async (seatId: number): Promise<SeatReserveResponse> => {
    const { data } = await apiClient.post<SeatReserveResponse>(`/api/v1/seats/${seatId}/reserve`);
    return data;
  },
};
