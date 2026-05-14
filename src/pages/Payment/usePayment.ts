import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { paymentService } from '../../services/payment';

export const usePayment = () => {
  const { seatId } = useParams<{ seatId: string }>();
  const userId = useAuthStore((state) => state.userId);
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handlePayment = async () => {
    if (!seatId) return;
    setIsProcessing(true);
    try {
      const result = await paymentService.processPayment(Number(seatId));
      setSuccessMessage(result.message || 'Payment complete. Your seat is confirmed!');
    } catch (error: any) {
      const status = error.response?.status;
      if (status === 403) {
        alert('결제 시간이 만료되었습니다. 좌석 선택 화면으로 돌아갑니다.');
        navigate('/seats');
      } else if (status === 409) {
        alert('잔액이 부족하거나 동시 결제 충돌이 발생했습니다. 다시 시도해주세요.');
      } else {
        alert('Payment failed. Please check your balance or try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    seatId,
    userId,
    isProcessing,
    successMessage,
    handlePayment,
    navigate
  };
};
