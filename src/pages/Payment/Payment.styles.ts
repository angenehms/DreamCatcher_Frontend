/**
 * Payment 페이지에서 사용하는 UI 스타일 정의 파일입니다.
 */
import type { CSSProperties } from 'react';

export const styles: Record<string, CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #EEF2FF 0%, #F0F4FF 50%, #F5F0FF 100%)',
    padding: '24px',
  },
  card: {
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
    flexDirection: 'column',
    gap: '40px',
  },
  successIconWrapper: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3182F6, #6366F1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 28px rgba(49,130,246,0.35)',
  },
  infoBox: {
    background: 'linear-gradient(135deg, #F0F6FF, #EEF0FF)',
    borderRadius: '24px',
    border: '1px solid rgba(49,130,246,0.12)',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  primaryButton: {
    height: '58px',
    border: 'none',
    borderRadius: '18px',
    color: 'white',
    fontSize: '17px',
    fontWeight: '700',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    letterSpacing: '-0.1px',
  }
};
