import { apiClient } from './apiClient';

// ── 응답 타입 정의 (api-spec.md 기준) ──────────────────────────────────────
export interface PaymentResponse {
  seatId: number;
  userId: number;
  message: string;
}

export const paymentService = {
  /** 3.1 결제 및 예약 확정: POST /api/v1/payments/seats/{seatId} */
  processPayment: async (seatId: number): Promise<PaymentResponse> => {
    const { data } = await apiClient.post<PaymentResponse>(`/api/v1/payments/seats/${seatId}`);
    return data;
  },
};
