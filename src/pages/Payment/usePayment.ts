import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { paymentService } from '../../services/payment';

/**
 * 결제 페이지의 비즈니스 로직을 관리하는 커스텀 훅입니다.
 * 결제 요청 처리 및 성공/실패에 따른 리다이렉션을 담당합니다.
 */
export const usePayment = () => {
  const { seatId } = useParams<{ seatId: string }>();
  const userId = useAuthStore((state) => state.userId);
  const navigate = useNavigate();
  // 결제 진행 중 상태 (버튼 비활성화용)
  const [isProcessing, setIsProcessing] = useState(false);
  // 결제 성공 후 표시할 메시지
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
