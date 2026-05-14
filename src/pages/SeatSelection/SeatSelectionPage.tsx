import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { seatService, type Seat } from '../../services/seat';

const SEATS_PER_ROW = 8;

// 행 라벨(A, B, C...)을 인덱스에 따라 생성하는 헬퍼 함수
const getRowLabel = (index: number) => {
  let label = '';
  let i = index;
  while (i >= 0) {
    label = String.fromCharCode((i % 26) + 65) + label;
    i = Math.floor(i / 26) - 1;
  }
  return label;
};

export const SeatSelectionPage = () => {
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
        const data = await seatService.getSeats(1); // Schedule ID 1 고정
        // seatNumber 순으로 정렬
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
      // 실패 시 좌석 정보 새로고침
      const data = await seatService.getSeats(1);
      setSeats(data.sort((a, b) => a.seatNumber - b.seatNumber));
    } finally {
      setIsReserving(false);
    }
  };

  const selectedSeat = seats.find(s => s.seatId === selectedSeatId);
  const canReserve = !!selectedSeatId && !isReserving;

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9FAFB' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="animate-spin" style={{ width: '32px', height: '32px', border: '3px solid #E5E8EB', borderTopColor: '#3182F6', borderRadius: '50%', margin: '0 auto 16px' }} />
          <p style={{ fontSize: '16px', color: '#8B95A1', fontWeight: '600' }}>Loading seats...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #EEF2FF 0%, #F0F4FF 50%, #F5F0FF 100%)',
      padding: '32px 24px 110px',
    }}>
      <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="animate-fade-in-up" style={{ paddingTop: '16px' }}>
          <p style={{ fontSize: '13px', fontWeight: '600', color: '#3182F6', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
            Step 2 of 3
          </p>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#191F28', letterSpacing: '-0.5px', margin: '0 0 6px 0' }}>
            Choose Your Seat
          </h1>
          <p style={{ fontSize: '15px', color: '#8B95A1', margin: 0 }}>
            {seats.length} seats available in total.
          </p>
        </div>

        <div className="animate-fade-in-up" style={{
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: '28px',
          border: '1px solid rgba(255,255,255,0.9)',
          boxShadow: '0 8px 40px rgba(49,130,246,0.08), 0 2px 8px rgba(0,0,0,0.06)',
          padding: '40px',
        }}>
          {/* 범례 (Legend) - 상단으로 이동 */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid #F0F2F5', flexWrap: 'wrap' }}>
            {[
              { bg: '#FFFFFF', border: '#E5E8EB', label: 'Available' },
              { bg: '#3182F6', border: '#3182F6', label: 'Selected' },
              { bg: '#FFF4E5', border: 'transparent', label: 'Reserved' },
              { bg: '#E5E8EB', border: 'transparent', label: 'Sold Out' },
            ].map(({ bg, border, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: bg, border: `1.5px solid ${border}` }} />
                <span style={{ fontSize: '12px', color: '#8B95A1', fontWeight: '600' }}>{label}</span>
              </div>
            ))}
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #3182F6, #6366F1)',
            borderRadius: '16px', padding: '14px', textAlign: 'center',
            color: 'white', fontWeight: '700', fontSize: '13px', letterSpacing: '3px',
            marginBottom: '36px', boxShadow: '0 4px 16px rgba(49,130,246,0.3)',
          }}>STAGE</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Array.from({ length: numRows }).map((_, rowIndex) => (
              <div key={rowIndex} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '24px', fontSize: '12px', fontWeight: '700', color: '#B0B8C1', flexShrink: 0 }}>
                  {getRowLabel(rowIndex)}
                </span>
                <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
                  {seats.slice(rowIndex * SEATS_PER_ROW, (rowIndex + 1) * SEATS_PER_ROW).map((seat, colIndex) => {
                    const isSelected = selectedSeatId === seat.seatId;
                    const isReserved = seat.seatStatus === 'RESERVED';
                    const isSold = seat.seatStatus === 'SOLD';
                    const isDisabled = isReserved || isSold;
                    const displayIndex = rowIndex * SEATS_PER_ROW + colIndex + 1;

                    return (
                      <button
                        key={seat.seatId}
                        className={`seat-button ${isSelected ? 'selected' : ''}`}
                        disabled={isDisabled}
                        onClick={() => setSelectedSeatId(seat.seatId)}
                        style={{
                          flex: 1,
                          aspectRatio: '1',
                          borderRadius: '10px',
                          border: isSelected ? '2px solid #3182F6' : isDisabled ? '2px solid transparent' : '2px solid #E5E8EB',
                          background: isSelected
                            ? 'linear-gradient(135deg, #3182F6, #4F6EF7)'
                            : isSold
                              ? '#E5E8EB' // 판매 완료: 회색
                              : isReserved
                                ? '#FFF4E5' // 예약 중: 연한 주황
                                : '#FFFFFF',
                          color: isSelected ? 'white' : isDisabled ? '#B0B8C1' : '#4E5968',
                          fontSize: '11px',
                          fontWeight: '700',
                          cursor: isDisabled ? 'not-allowed' : 'pointer',
                          boxShadow: isSelected ? '0 4px 12px rgba(49,130,246,0.4)' : 'none',
                          transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                          fontFamily: 'inherit',
                          position: 'relative',
                        }}
                      >
                        {displayIndex}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        padding: '16px 24px 28px',
        background: 'linear-gradient(to top, rgba(240,242,245,0.98) 80%, rgba(240,242,245,0))',
      }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <button
            onClick={handleReserve}
            disabled={!canReserve}
            className="reserve-button"
            style={{
              width: '100%', height: '58px',
              background: canReserve ? 'linear-gradient(135deg, #3182F6, #4F6EF7)' : '#C2D6FA',
              border: 'none', borderRadius: '18px', color: 'white', fontSize: '17px', fontWeight: '700',
              cursor: canReserve ? 'pointer' : 'not-allowed',
              boxShadow: canReserve ? '0 6px 20px rgba(49,130,246,0.4)' : 'none',
              transition: 'all 0.2s ease', fontFamily: 'inherit', letterSpacing: '-0.1px',
            }}
          >
            {isReserving 
              ? 'Reserving...' 
              : selectedSeatId 
                ? `Reserve Seat — ${getRowLabel(Math.floor(seats.findIndex(s => s.seatId === selectedSeatId) / SEATS_PER_ROW))}${seats.findIndex(s => s.seatId === selectedSeatId) + 1}` 
                : 'Select a seat to continue'}
          </button>
        </div>
      </div>
    </div>
  );
};
