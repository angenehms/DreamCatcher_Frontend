import { apiClient } from './apiClient';

export const paymentService = {
  processPayment: async (seatId: number): Promise<string> => {
    const { data } = await apiClient.post<string>(`/api/v1/payments/seats/${seatId}`);
    return data;
  },
};
