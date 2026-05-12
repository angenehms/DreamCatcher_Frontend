import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export const LoginPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const setUserId = useAuthStore((state) => state.setUserId);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setUserId(inputValue.trim());
    navigate('/waiting');
  };

  const isValid = inputValue.trim().length > 0;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #EEF2FF 0%, #F0F4FF 50%, #F5F0FF 100%)',
      padding: '24px',
    }}>
      {/* Card */}
      <div
        className="animate-fade-in-up"
        style={{
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
          gap: '48px',
        }}
      >
        {/* Logo / Icon */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #3182F6, #6366F1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(49, 130, 246, 0.35)',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M9 19V13M12 19V9M15 19V15M5 3H19C20.1 3 21 3.9 21 5V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '800',
              letterSpacing: '-0.5px',
              color: '#191F28',
              margin: 0,
            }}>
              DreamCatcher
            </h1>
            <p style={{
              fontSize: '15px',
              color: '#8B95A1',
              fontWeight: '500',
              margin: 0,
              letterSpacing: '0.1px',
            }}>
              Concert Reservation Platform
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#4E5968',
              letterSpacing: '0.4px',
              textTransform: 'uppercase',
              paddingLeft: '2px',
            }}>
              User ID
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="e.g. user_1"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                autoFocus
                style={{
                  width: '100%',
                  height: '56px',
                  background: isFocused ? '#FFFFFF' : '#F7F8FA',
                  border: isFocused ? '1.5px solid #3182F6' : '1.5px solid #E5E8EB',
                  borderRadius: '16px',
                  padding: '0 20px',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#191F28',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxShadow: isFocused ? '0 0 0 4px rgba(49,130,246,0.10)' : 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!isValid}
            style={{
              marginTop: '8px',
              height: '56px',
              width: '100%',
              background: isValid
                ? 'linear-gradient(135deg, #3182F6, #4F6EF7)'
                : '#C2D6FA',
              border: 'none',
              borderRadius: '16px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '700',
              letterSpacing: '-0.1px',
              cursor: isValid ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
              boxShadow: isValid ? '0 4px 16px rgba(49, 130, 246, 0.35)' : 'none',
              fontFamily: 'inherit',
            }}
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

        {/* Footer note */}
        <p style={{
          textAlign: 'center',
          fontSize: '13px',
          color: '#B0B8C1',
          fontWeight: '500',
          marginTop: '-16px',
        }}>
          Secured by DreamCatcher · PoC Demo
        </p>
      </div>
    </div>
  );
};
