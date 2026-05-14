import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { waitingService } from '../../services/waiting';

const POLL_INTERVAL_MS = 3000;

export const useWaitingRoom = () => {
  const userId = useAuthStore((state) => state.userId);
  const navigate = useNavigate();

  const [serverError, setServerError] = useState<string | null>(null);
  const [rank, setRank] = useState<number | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const isNavigatingRef = useRef(false);
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
