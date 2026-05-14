/**
 * SeatSelection 페이지에서 사용하는 UI 스타일 정의 파일입니다.
 */
import type { CSSProperties } from 'react';

export const styles: Record<string, CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #EEF2FF 0%, #F0F4FF 50%, #F5F0FF 100%)',
    padding: '32px 24px 110px',
  },
  contentWrapper: {
    maxWidth: '680px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  header: {
    paddingTop: '16px',
  },
  stepText: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#3182F6',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#191F28',
    letterSpacing: '-0.5px',
    margin: '0 0 6px 0',
  },
  subtitle: {
    fontSize: '15px',
    color: '#8B95A1',
    margin: 0,
  },
  card: {
    background: 'rgba(255,255,255,0.88)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderRadius: '28px',
    border: '1px solid rgba(255,255,255,0.9)',
    boxShadow: '0 8px 40px rgba(49,130,246,0.08), 0 2px 8px rgba(0,0,0,0.06)',
    padding: '40px',
  },
  legendWrapper: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '32px',
    paddingBottom: '24px',
    borderBottom: '1px solid #F0F2F5',
    flexWrap: 'wrap',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  legendLabel: {
    fontSize: '12px',
    color: '#8B95A1',
    fontWeight: '600',
  },
  stage: {
    background: 'linear-gradient(135deg, #3182F6, #6366F1)',
    borderRadius: '16px',
    padding: '14px',
    textAlign: 'center',
    color: 'white',
    fontWeight: '700',
    fontSize: '13px',
    letterSpacing: '3px',
    marginBottom: '36px',
    boxShadow: '0 4px 16px rgba(49,130,246,0.3)',
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  rowLabel: {
    width: '24px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#B0B8C1',
    flexShrink: 0,
  },
  seatRow: {
    display: 'flex',
    gap: '8px',
    flex: 1,
  },
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#F9FAFB',
  },
  footer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '16px 24px 28px',
    background: 'linear-gradient(to top, rgba(240,242,245,0.98) 80%, rgba(240,242,245,0))',
  },
};

export const getSeatStyle = (isSelected: boolean, isReserved: boolean, isSold: boolean): CSSProperties => {
  const isDisabled = isReserved || isSold;
  return {
    flex: 1,
    aspectRatio: '1',
    borderRadius: '10px',
    border: isSelected ? '2px solid #3182F6' : isDisabled ? '2px solid transparent' : '2px solid #E5E8EB',
    background: isSelected
      ? 'linear-gradient(135deg, #3182F6, #4F6EF7)'
      : isSold
        ? '#E5E8EB'
        : isReserved
          ? '#FFF4E5'
          : '#FFFFFF',
    color: isSelected ? 'white' : isDisabled ? '#B0B8C1' : '#4E5968',
    fontSize: '11px',
    fontWeight: '700',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    boxShadow: isSelected ? '0 4px 12px rgba(49,130,246,0.4)' : 'none',
    transform: isSelected ? 'scale(1.08)' : 'scale(1)',
    fontFamily: 'inherit',
    position: 'relative',
  };
};

export const getReserveButtonStyle = (canReserve: boolean): CSSProperties => ({
  width: '100%',
  height: '58px',
  background: canReserve ? 'linear-gradient(135deg, #3182F6, #4F6EF7)' : '#C2D6FA',
  border: 'none',
  borderRadius: '18px',
  color: 'white',
  fontSize: '17px',
  fontWeight: '700',
  cursor: canReserve ? 'pointer' : 'not-allowed',
  boxShadow: canReserve ? '0 6px 20px rgba(49,130,246,0.4)' : 'none',
  transition: 'all 0.2s ease',
  fontFamily: 'inherit',
  letterSpacing: '-0.1px',
});
