import React from 'react';
import { usePayment } from './usePayment';
import { styles } from './Payment.styles';

export const PaymentPage = () => {
  const { seatId, userId, isProcessing, successMessage, handlePayment, navigate } = usePayment();

  if (!userId || !seatId) { navigate('/'); return null; }

  // ── 결제 완료 화면 ──
  if (successMessage) {
    return (
      <div style={styles.container}>
        <div className="animate-fade-in-up" style={{ ...styles.card, alignItems: 'center', textAlign: 'center' }}>
          <div style={styles.successIconWrapper}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#191F28', margin: 0, letterSpacing: '-0.5px' }}>Booking Confirmed!</h2>
            <p style={{ fontSize: '16px', color: '#4E5968', margin: 0, lineHeight: 1.6 }}>{successMessage}</p>
          </div>
          <button onClick={() => navigate('/')} style={{
            width: '100%', height: '56px', background: '#F2F4F6', border: 'none',
            borderRadius: '16px', color: '#4E5968', fontSize: '16px', fontWeight: '700',
            cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s ease',
          }}>Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div className="animate-fade-in-up" style={styles.card}>
        <div>
          <p style={{ fontSize: '13px', fontWeight: '600', color: '#3182F6', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '10px' }}>Step 3 of 3</p>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#191F28', letterSpacing: '-0.5px', margin: '0 0 8px 0' }}>Confirm Payment</h1>
          <p style={{ fontSize: '15px', color: '#8B95A1', margin: 0 }}>Review your order and complete the reservation.</p>
        </div>

        <div style={styles.infoBox}>
          {[
            { label: 'Seat', value: `Seat ${seatId}` },
            { label: 'Event', value: 'DreamCatcher Concert' },
            { label: 'Price', value: '₩150,000', highlight: true },
          ].map(({ label, value, highlight }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '15px', color: '#8B95A1', fontWeight: '500' }}>{label}</span>
              <span style={{
                fontSize: highlight ? '22px' : '17px',
                fontWeight: '700', color: highlight ? '#3182F6' : '#191F28',
              }}>{value}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handlePayment}
          disabled={isProcessing}
          style={{
            ...styles.primaryButton,
            background: isProcessing ? '#C2D6FA' : 'linear-gradient(135deg, #3182F6, #4F6EF7)',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            boxShadow: isProcessing ? 'none' : '0 6px 20px rgba(49, 130, 246, 0.4)',
          }}
        >
          {isProcessing ? 'Processing...' : 'Pay ₩150,000 →'}
        </button>
      </div>
    </div>
  );
};
