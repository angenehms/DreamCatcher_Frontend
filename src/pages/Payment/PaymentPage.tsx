import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { paymentService } from '../../services/payment';

export const PaymentPage = () => {
  const { seatId } = useParams<{ seatId: string }>();
  const userId = useAuthStore((state) => state.userId);
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!userId || !seatId) { navigate('/'); return null; }

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const result = await paymentService.processPayment(Number(seatId));
      // 새 응답: { seatId, userId, message }
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

  const bgStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #EEF2FF 0%, #F0F4FF 50%, #F5F0FF 100%)',
    padding: '24px',
  };

  const cardStyle = {
    width: '100%',
    maxWidth: '440px',
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderRadius: '32px',
    border: '1px solid rgba(255,255,255,0.9)',
    boxShadow: '0 8px 40px rgba(49, 130, 246, 0.10), 0 2px 8px rgba(0,0,0,0.06)',
    padding: '56px 48px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '40px',
  };

  // ── 결제 완료 화면 ──────────────────────────────────────────
  if (successMessage) {
    return (
      <div style={bgStyle}>
        <div className="animate-fade-in-up" style={{ ...cardStyle, alignItems: 'center', textAlign: 'center' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #3182F6, #6366F1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 28px rgba(49,130,246,0.35)',
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#191F28', margin: 0, letterSpacing: '-0.5px' }}>
              Booking Confirmed!
            </h2>
            <p style={{ fontSize: '16px', color: '#4E5968', margin: 0, lineHeight: 1.6 }}>{successMessage}</p>
          </div>
          <button onClick={() => navigate('/')} style={{
            width: '100%', height: '56px', background: '#F2F4F6', border: 'none',
            borderRadius: '16px', color: '#4E5968', fontSize: '16px', fontWeight: '700',
            cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s ease',
          }}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // ── 결제 화면 ──────────────────────────────────────────────
  return (
    <div style={bgStyle}>
      <div className="animate-fade-in-up" style={cardStyle}>
        <div>
          <p style={{ fontSize: '13px', fontWeight: '600', color: '#3182F6', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '10px' }}>
            Step 3 of 3
          </p>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#191F28', letterSpacing: '-0.5px', margin: '0 0 8px 0' }}>
            Confirm Payment
          </h1>
          <p style={{ fontSize: '15px', color: '#8B95A1', margin: 0 }}>
            Review your order and complete the reservation.
          </p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #F0F6FF, #EEF0FF)',
          borderRadius: '24px',
          border: '1px solid rgba(49,130,246,0.12)',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}>
          {[
            { label: 'Seat', value: `Seat ${seatId}` },
            { label: 'Event', value: 'DreamCatcher Concert' },
            { label: 'Price', value: '₩150,000', highlight: true },
          ].map(({ label, value, highlight }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '15px', color: '#8B95A1', fontWeight: '500' }}>{label}</span>
              <span style={{
                fontSize: highlight ? '22px' : '17px',
                fontWeight: '700',
                color: highlight ? '#3182F6' : '#191F28',
              }}>{value}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handlePayment}
          disabled={isProcessing}
          style={{
            height: '58px',
            background: isProcessing ? '#C2D6FA' : 'linear-gradient(135deg, #3182F6, #4F6EF7)',
            border: 'none', borderRadius: '18px', color: 'white', fontSize: '17px', fontWeight: '700',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            boxShadow: isProcessing ? 'none' : '0 6px 20px rgba(49,130,246,0.4)',
            transition: 'all 0.2s ease', fontFamily: 'inherit', letterSpacing: '-0.1px',
          }}
        >
          {isProcessing ? 'Processing...' : 'Pay ₩150,000 →'}
        </button>
      </div>
    </div>
  );
};
