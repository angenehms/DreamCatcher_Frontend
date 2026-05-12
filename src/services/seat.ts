import { apiClient } from './apiClient';

export const seatService = {
  reserveSeat: async (seatId: number) => {
    await apiClient.post(`/api/v1/seats/${seatId}/reserve`);
  },
};
