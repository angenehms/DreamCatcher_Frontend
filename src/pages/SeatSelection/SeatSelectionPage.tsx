import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { seatService } from '../../services/seat';

const MOCK_SEATS = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  row: String.fromCharCode(65 + Math.floor(i / 8)),
  col: (i % 8) + 1,
  number: `${String.fromCharCode(65 + Math.floor(i / 8))}${(i % 8) + 1}`,
  status: Math.random() > 0.8 ? 'RESERVED' : 'AVAILABLE',
}));

const ROWS = ['A', 'B', 'C', 'D', 'E'];

export const SeatSelectionPage = () => {
  const userId = useAuthStore((state) => state.userId);
  const navigate = useNavigate();
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [isReserving, setIsReserving] = useState(false);

  if (!userId) { navigate('/'); return null; }

  const handleReserve = async () => {
    if (!selectedSeat) return;
    setIsReserving(true);
    try {
      await seatService.reserveSeat(selectedSeat);
      navigate(`/payment/${selectedSeat}`);
    } catch {
      alert('Seat reservation failed. Someone may have just taken it.');
    } finally {
      setIsReserving(false);
    }
  };

  const selectedSeatInfo = MOCK_SEATS.find(s => s.id === selectedSeat);
  const canReserve = !!selectedSeat && !isReserving;

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
            Select an available seat from the map below.
          </p>
        </div>

        <div className="animate-fade-in-up" style={{
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: '28px',
          border: '1px solid rgba(255,255,255,0.9)',
          boxShadow: '0 8px 40px rgba(49,130,246,0.08), 0 2px 8px rgba(0,0,0,0.05)',
          padding: '40px',
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #3182F6, #6366F1)',
            borderRadius: '16px', padding: '14px', textAlign: 'center',
            color: 'white', fontWeight: '700', fontSize: '13px', letterSpacing: '3px',
            marginBottom: '36px', boxShadow: '0 4px 16px rgba(49,130,246,0.3)',
          }}>STAGE</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '36px' }}>
            {ROWS.map((row) => (
              <div key={row} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '20px', fontSize: '12px', fontWeight: '700', color: '#B0B8C1', flexShrink: 0 }}>{row}</span>
                <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
                  {MOCK_SEATS.filter(s => s.row === row).map((seat) => {
                    const isSelected = selectedSeat === seat.id;
                    const isReserved = seat.status === 'RESERVED';
                    return (
                      <button key={seat.id} disabled={isReserved} onClick={() => setSelectedSeat(seat.id)} style={{
                        flex: 1, aspectRatio: '1', borderRadius: '10px',
                        border: isSelected ? '2px solid #3182F6' : isReserved ? '2px solid transparent' : '2px solid #E5E8EB',
                        background: isSelected ? 'linear-gradient(135deg, #3182F6, #4F6EF7)' : isReserved ? '#F0F2F5' : '#FFFFFF',
                        color: isSelected ? 'white' : isReserved ? '#C2C9D0' : '#4E5968',
                        fontSize: '11px', fontWeight: '700',
                        cursor: isReserved ? 'not-allowed' : 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected ? '0 4px 12px rgba(49,130,246,0.4)' : 'none',
                        transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                        fontFamily: 'inherit',
                      }}>{seat.col}</button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', paddingTop: '24px', borderTop: '1px solid #F0F2F5' }}>
            {[
              { bg: '#FFFFFF', border: '#E5E8EB', label: 'Available' },
              { bg: '#3182F6', border: '#3182F6', label: 'Selected' },
              { bg: '#F0F2F5', border: 'transparent', label: 'Taken' },
            ].map(({ bg, border, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '5px', background: bg, border: `1.5px solid ${border}` }} />
                <span style={{ fontSize: '13px', color: '#8B95A1', fontWeight: '500' }}>{label}</span>
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
          <button onClick={handleReserve} disabled={!canReserve} style={{
            width: '100%', height: '58px',
            background: canReserve ? 'linear-gradient(135deg, #3182F6, #4F6EF7)' : '#C2D6FA',
            border: 'none', borderRadius: '18px', color: 'white', fontSize: '17px', fontWeight: '700',
            cursor: canReserve ? 'pointer' : 'not-allowed',
            boxShadow: canReserve ? '0 6px 20px rgba(49,130,246,0.4)' : 'none',
            transition: 'all 0.2s ease', fontFamily: 'inherit', letterSpacing: '-0.1px',
          }}>
            {isReserving ? 'Reserving...' : selectedSeatInfo ? `Reserve Seat — ${selectedSeatInfo.number}` : 'Select a seat to continue'}
          </button>
        </div>
      </div>
    </div>
  );
};
