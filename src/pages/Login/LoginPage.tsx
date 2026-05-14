import React from 'react';
import { useLogin } from './useLogin';
import { styles, getInputStyle, getButtonStyle } from './Login.styles';

export const LoginPage = () => {
  const { inputValue, setInputValue, isFocused, setIsFocused, handleLogin, isValid } = useLogin();

  return (
    <div style={styles.container}>
      <div className="animate-fade-in-up" style={styles.card}>
        <div style={styles.logoWrapper}>
          <div style={styles.logoIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M9 19V13M12 19V9M15 19V15M5 3H19C20.1 3 21 3.9 21 5V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px', color: '#191F28', margin: 0 }}>DreamCatcher</h1>
            <p style={{ fontSize: '15px', color: '#8B95A1', fontWeight: '500', margin: 0 }}>Concert Reservation Platform</p>
          </div>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={styles.label}>User ID</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="e.g. user_1"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                autoFocus
                style={getInputStyle(isFocused)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!isValid}
            style={getButtonStyle(isValid)}
            onMouseEnter={(e) => {
              if (isValid) {
                (e.target as HTMLButtonElement).style.transform = 'translateY(-1px)';
                (e.target as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(49, 130, 246, 0.45)';
              }
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
              (e.target as HTMLButtonElement).style.boxShadow = isValid ? '0 4px 16px rgba(49, 130, 246, 0.35)' : 'none';
            }}
          >
            Get Started →
          </button>
        </form>

        <p style={styles.footerNote}>Secured by DreamCatcher · PoC Demo</p>
      </div>
    </div>
  );
};
