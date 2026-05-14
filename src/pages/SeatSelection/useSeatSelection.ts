import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { seatService, type Seat } from '../../services/seat';

export const SEATS_PER_ROW = 8;

export const useSeatSelection = () => {
  const userId = useAuthStore((state) => state.userId);
  const navigate = useNavigate();

  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeatId, setSelectedSeatId] = useState<number | null>(null);
  const [isReserving, setIsReserving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 데이터 기반으로 필요한 총 행 수 계산
  const numRows = Math.ceil(seats.length / SEATS_PER_ROW);

  useEffect(() => {
    if (!userId) {
      navigate('/');
      return;
    }

    const fetchSeats = async () => {
      try {
        const data = await seatService.getSeats(1);
        setSeats(data.sort((a, b) => a.seatNumber - b.seatNumber));
      } catch (error) {
        console.error('[SeatSelection] Failed to fetch seats:', error);
        alert('좌석 정보를 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeats();
  }, [userId, navigate]);

  const handleReserve = async () => {
    if (!selectedSeatId) return;
    setIsReserving(true);
    try {
      await seatService.reserveSeat(selectedSeatId);
      navigate(`/payment/${selectedSeatId}`);
    } catch {
      alert('Seat reservation failed. Someone may have just taken it.');
      const data = await seatService.getSeats(1);
      setSeats(data.sort((a, b) => a.seatNumber - b.seatNumber));
    } finally {
      setIsReserving(false);
    }
  };

  const getRowLabel = (index: number) => {
    let label = '';
    let i = index;
    while (i >= 0) {
      label = String.fromCharCode((i % 26) + 65) + label;
      i = Math.floor(i / 26) - 1;
    }
    return label;
  };

  const getDisplaySeatInfo = (id: number | null) => {
    if (!id) return '';
    const index = seats.findIndex(s => s.seatId === id);
    if (index === -1) return '';
    const row = getRowLabel(Math.floor(index / SEATS_PER_ROW));
    const num = index + 1;
    return `${row}${num}`;
  };

  return {
    seats,
    selectedSeatId,
    setSelectedSeatId,
    isReserving,
    isLoading,
    numRows,
    handleReserve,
    getRowLabel,
    getDisplaySeatInfo,
    SEATS_PER_ROW
  };
};
