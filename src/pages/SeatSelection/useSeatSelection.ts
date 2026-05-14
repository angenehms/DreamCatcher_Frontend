import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { seatService, type Seat } from '../../services/seat';

export const SEATS_PER_ROW = 8;

/**
 * 좌석 선택 페이지의 핵심 비즈니스 로직을 관리하는 커스텀 훅입니다.
 * 상태 관리, API 호출, 좌석 번호 계산 로직 등을 포함합니다.
 */
export const useSeatSelection = () => {
  const userId = useAuthStore((state) => state.userId);
  const navigate = useNavigate();

  // 서버로부터 받아온 전체 좌석 데이터 상태
  const [seats, setSeats] = useState<Seat[]>([]);
  // 현재 사용자가 선택한 좌석의 ID
  const [selectedSeatId, setSelectedSeatId] = useState<number | null>(null);
  // 예약 API 호출 중인지 여부 (중복 클릭 방지)
  const [isReserving, setIsReserving] = useState(false);
  // 초기 데이터 로딩 상태
  const [isLoading, setIsLoading] = useState(true);

  /** 데이터 기반으로 필요한 총 행 수 계산 (한 줄에 8개씩) */
  const numRows = Math.ceil(seats.length / SEATS_PER_ROW);

  useEffect(() => {
    // 로그인하지 않은 사용자는 홈으로 리다이렉트
    if (!userId) {
      navigate('/');
      return;
    }

    /** 서버에서 좌석 정보를 가져오는 함수 */
    const fetchSeats = async () => {
      try {
        const data = await seatService.getSeats(1);
        // 좌석 번호 순으로 정렬하여 배치도 구성의 일관성 유지
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

  /** 좌석 예약 버튼 클릭 시 실행되는 핸들러 */
  const handleReserve = async () => {
    if (!selectedSeatId) return;
    setIsReserving(true);
    try {
      // 선택한 좌석 예약(임시 선점) 요청
      await seatService.reserveSeat(selectedSeatId);
      // 성공 시 결제 페이지로 이동
      navigate(`/payment/${selectedSeatId}`);
    } catch {
      // 이미 다른 사용자가 선점한 경우 등 실패 시 메시지 노출 및 데이터 새로고침
      alert('이미 선점된 좌석이거나 예약에 실패했습니다. 다른 좌석을 선택해주세요.');
      const data = await seatService.getSeats(1);
      setSeats(data.sort((a, b) => a.seatNumber - b.seatNumber));
    } finally {
      setIsReserving(false);
    }
  };

  /** 인덱스 번호를 기반으로 행 라벨(A, B, C...)을 생성하는 함수 */
  const getRowLabel = (index: number) => {
    let label = '';
    let i = index;
    while (i >= 0) {
      label = String.fromCharCode((i % 26) + 65) + label;
      i = Math.floor(i / 26) - 1;
    }
    return label;
  };

  /** 좌석 ID를 받아 화면에 표시될 '행+번호' 형태의 라벨을 반환하는 함수 (예: C17) */
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
