import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { waitingService } from '../../services/waiting';

const POLL_INTERVAL_MS = 3000;

/**
 * 대기열 시스템의 핵심 로직을 담당하는 커스텀 훅입니다.
 * 서버 진입 요청, 실시간 순번 폴링, ACTIVE 상태 감지 등을 수행합니다.
 */
export const useWaitingRoom = () => {
  const userId = useAuthStore((state) => state.userId);
  const navigate = useNavigate();

  // 서버 연결 실패 시 에러 메시지
  const [serverError, setServerError] = useState<string | null>(null);
  // 현재 내 대기 순번 (null: 아직 정보 없음, 0: 통과)
  const [rank, setRank] = useState<number | null>(null);
  // 순번이 변경될 때 UI에 반짝이는 효과를 주기 위한 상태
  const [isFlashing, setIsFlashing] = useState(false);
  // 중복 이동 방지를 위한 Ref
  const isNavigatingRef = useRef(false);
  // 폴링 인터벌 ID 저장용 Ref
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!userId) {
      navigate('/');
      return;
    }

    const poll = async () => {
      if (isNavigatingRef.current) return;

      try {
        const result = await waitingService.checkStatus();
        const ahead = Number(result.aheadCount);

        if (result.status === 'ACTIVE') {
          isNavigatingRef.current = true;
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setRank(0);
          setTimeout(() => navigate('/seats'), 800);
          return;
        }

        if (result.status === 'NOT_FOUND') return;

        const newRank = isNaN(ahead) ? null : ahead + 1;

        setRank((prev) => {
          if (prev !== null && prev !== newRank) {
            setIsFlashing(true);
            setTimeout(() => setIsFlashing(false), 600);
          }
          return newRank;
        });
      } catch {
        console.warn('[WaitingRoom] Status poll failed, retrying...');
      }
    };

    const startPolling = () => {
      const id = setInterval(async () => {
        if (isNavigatingRef.current) return;
        await poll();
      }, POLL_INTERVAL_MS);
      intervalRef.current = id;
      poll();
    };

    const enterQueue = async () => {
      try {
        await waitingService.enterQueue();
        startPolling();
      } catch (error: any) {
        const isNetworkError = !error.response;
        setServerError(
          isNetworkError
            ? 'Cannot reach the server. Please make sure the backend is running.'
            : `Server error (${error.response?.status}). Please try again later.`
        );
      }
    };

    enterQueue();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [userId, navigate]);

  return {
    serverError,
    rank,
    isFlashing,
    navigate
  };
};
