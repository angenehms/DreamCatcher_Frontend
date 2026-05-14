import React from 'react';
import { useWaitingRoom } from './useWaitingRoom';
import { styles } from './WaitingRoom.styles';

export const WaitingRoomPage = () => {
  const { serverError, rank, isFlashing, navigate } = useWaitingRoom();

  if (serverError) {
    return (
      <div style={styles.container}>
        <div className="animate-fade-in-up" style={styles.errorCard}>
          <div style={{ ...styles.iconWrapper, ...styles.errorIcon }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 8v4m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#191F28', margin: 0 }}>Connection Failed</h2>
            <p style={{ fontSize: '14px', color: '#8B95A1', lineHeight: 1.7, margin: 0 }}>{serverError}</p>
          </div>
          <button onClick={() => navigate('/')} style={{
            width: '100%', height: '52px', background: '#F2F4F6', border: 'none',
            borderRadius: '16px', color: '#4E5968', fontSize: '15px', fontWeight: '700',
            cursor: 'pointer', fontFamily: 'inherit',
          }}>← Back to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div className="animate-fade-in-up" style={styles.card}>
        {rank === null ? (
          /* ── ACTIVE 상태 ── */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px', padding: '24px 0' }}>
            <div style={{ ...styles.iconWrapper, ...styles.successIcon }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: '22px', fontWeight: '700', color: '#191F28', margin: '0 0 8px 0' }}>You're in!</p>
              <p style={{ fontSize: '15px', color: '#8B95A1', margin: 0 }}>Redirecting to seat selection...</p>
            </div>
          </div>
        ) : (
          /* ── 대기 중 ── */
          <>
            <div style={{ position: 'relative', width: '80px', height: '80px' }}>
              <div className="animate-pulse-ring" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(49,130,246,0.15)' }} />
              <div style={{
                position: 'absolute', inset: '12px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #3182F6, #6366F1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(49,130,246,0.4)',
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1.2s linear infinite' }}>
                  <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#191F28', margin: 0, letterSpacing: '-0.3px' }}>Queue in Progress</h2>
              <p style={{ fontSize: '15px', color: '#8B95A1', lineHeight: '1.7', margin: 0 }}>High traffic detected. Please hold on — we'll let you in shortly.</p>
            </div>

            <div style={{ 
              ...styles.rankBox, 
              border: `1.5px solid ${isFlashing ? '#3182F6' : 'rgba(49,130,246,0.15)'}` 
            }}>
              <p style={{ fontSize: '12px', color: '#8B95A1', fontWeight: '600', letterSpacing: '0.8px', textTransform: 'uppercase', margin: 0 }}>Your Position</p>
              <p style={{
                fontSize: rank !== null ? '52px' : '36px',
                fontWeight: '900', color: isFlashing ? '#6366F1' : '#3182F6',
                margin: 0, letterSpacing: '-1px', lineHeight: 1, transition: 'color 0.3s ease',
              }}>
                {rank !== null ? Math.max(0, rank - 1).toLocaleString() : '—'}
              </p>
              <p style={{ fontSize: '13px', color: '#B0B8C1', margin: 0 }}>
                {rank !== null ? 'people ahead of you' : 'Fetching your position...'}
              </p>

              <div style={styles.indicator}>
                <div style={styles.dot}>
                  <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
                </div>
                <span style={{ fontSize: '12px', color: '#B0B8C1', fontWeight: '500' }}>Live · updates every 3s</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
