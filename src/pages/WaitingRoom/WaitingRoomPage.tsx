import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { waitingService } from '../../services/waiting';

const POLL_INTERVAL_MS = 3000;

type PageState = 'loading' | 'waiting' | 'active' | 'error';

export const WaitingRoomPage = () => {
  const userId = useAuthStore((state) => state.userId);
  const navigate = useNavigate();

  const [pageState, setPageState] = useState<PageState>('loading');
  const [rank, setRank] = useState<number | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!userId) {
      navigate('/');
      return;
    }

    const poll = async () => {
      try {
        const result = await waitingService.checkStatus();

        if (result === -1) {
          // ACTIVE → 폴링 중단 후 좌석 선택으로 이동
          if (intervalRef.current) clearInterval(intervalRef.current);
          setPageState('active');
          setTimeout(() => navigate('/seats'), 900);
          return;
        }

        // 대기 순위 업데이트
        setRank((prev) => {
          if (prev !== null && prev !== result) {
            setIsFlashing(true);
            setTimeout(() => setIsFlashing(false), 600);
          }
          return result;
        });
        setPageState('waiting');
      } catch {
        console.warn('[WaitingRoom] poll failed, retrying...');
        // 일시적 실패는 무시하고 다음 interval에서 재시도
      }
    };

    const enterQueue = async () => {
      try {
        await waitingService.enterQueue();
        // 진입 성공 → 즉시 1회 폴링 후 interval 등록
        await poll();
        intervalRef.current = setInterval(poll, POLL_INTERVAL_MS);
      } catch (error: any) {
        const isNetworkError = !error.response;
        setServerError(
          isNetworkError
            ? 'Cannot reach the server. Please make sure the backend is running.'
            : `Server error (${error.response?.status}). Please try again later.`
        );
        setPageState('error');
      }
    };

    enterQueue();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [userId, navigate]);

  // 내 앞에 몇 명인지 (rank 1 → 0명, rank 2 → 1명, ...)
  const peopleAhead = rank !== null && rank > 0 ? rank - 1 : 0;

  const aheadText = () => {
    if (rank === null) return 'Fetching your position...';
    if (rank === 1) return "You're next!";
    return `${peopleAhead.toLocaleString()} ${peopleAhead === 1 ? 'person' : 'people'} ahead of you`;
  };

  const bgStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #EEF2FF 0%, #F0F4FF 50%, #F5F0FF 100%)',
    padding: '24px',
  };

  const cardBase: React.CSSProperties = {
    width: '100%',
    maxWidth: '400px',
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderRadius: '32px',
    border: '1px solid rgba(255,255,255,0.9)',
    boxShadow: '0 8px 40px rgba(49, 130, 246, 0.10), 0 2px 8px rgba(0,0,0,0.06)',
    padding: '56px 40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '36px',
  };

  // ── 에러 화면 ──────────────────────────────────────────────
  if (pageState === 'error') {
    return (
      <div style={bgStyle}>
        <div className="animate-fade-in-up" style={cardBase}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #FF6B6B, #EE4444)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(238,68,68,0.3)',
          }}>
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

  // ── ACTIVE: 통과 직후 잠깐 보여주는 화면 ──────────────────
  if (pageState === 'active') {
    return (
      <div style={bgStyle}>
        <div className="animate-fade-in-up" style={cardBase}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #3182F6, #6366F1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(49,130,246,0.35)',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ fontSize: '24px', fontWeight: '800', color: '#191F28', margin: 0 }}>You're in!</p>
            <p style={{ fontSize: '15px', color: '#8B95A1', margin: 0 }}>Redirecting to seat selection...</p>
          </div>
        </div>
      </div>
    );
  }

  // ── 로딩 초기 / 대기 중 화면 ──────────────────────────────
  return (
    <div style={bgStyle}>
      <div className="animate-fade-in-up" style={cardBase}>

        {/* 스피너 */}
        <div style={{ position: 'relative', width: '80px', height: '80px' }}>
          <div
            className="animate-pulse-ring"
            style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(49,130,246,0.15)' }}
          />
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

        {/* 타이틀 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#191F28', margin: 0, letterSpacing: '-0.3px' }}>
            Queue in Progress
          </h2>
          <p style={{ fontSize: '15px', color: '#8B95A1', lineHeight: '1.7', margin: 0 }}>
            High traffic detected. Please hold on —<br />
            we'll let you in shortly.
          </p>
        </div>

        {/* 대기 순위 박스 */}
        <div style={{
          width: '100%',
          background: 'linear-gradient(135deg, #F0F6FF, #EEF0FF)',
          borderRadius: '24px',
          border: `1.5px solid ${isFlashing ? '#3182F6' : 'rgba(49,130,246,0.15)'}`,
          padding: '28px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          transition: 'border-color 0.3s ease',
        }}>
          <p style={{ fontSize: '12px', color: '#8B95A1', fontWeight: '600', letterSpacing: '0.8px', textTransform: 'uppercase', margin: 0 }}>
            Your Position
          </p>
          <p style={{
            fontSize: pageState === 'loading' ? '36px' : '52px',
            fontWeight: '900',
            color: isFlashing ? '#6366F1' : '#3182F6',
            margin: 0,
            letterSpacing: '-1px',
            lineHeight: 1,
            transition: 'color 0.3s ease, font-size 0.2s ease',
          }}>
            {pageState === 'loading' || rank === null ? '—' : `#${rank.toLocaleString()}`}
          </p>
          <p style={{ fontSize: '13px', color: '#B0B8C1', margin: 0 }}>
            {aheadText()}
          </p>

          {/* 라이브 인디케이터 */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            marginTop: '8px', paddingTop: '12px', borderTop: '1px solid rgba(49,130,246,0.12)',
          }}>
            <div style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: pageState === 'loading' ? '#F59E0B' : '#22C55E',
              animation: 'livePulse 2s ease-in-out infinite',
            }}>
              <style>{`@keyframes livePulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
            </div>
            <span style={{ fontSize: '12px', color: '#B0B8C1', fontWeight: '500' }}>
              {pageState === 'loading' ? 'Connecting...' : 'Live · updates every 3s'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
