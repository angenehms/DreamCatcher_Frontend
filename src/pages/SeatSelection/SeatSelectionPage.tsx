import React from 'react';
import { useSeatSelection } from './useSeatSelection';
import { styles, getSeatStyle, getReserveButtonStyle } from './SeatSelection.styles';

const LEGEND_ITEMS = [
  { bg: '#FFFFFF', border: '#E5E8EB', label: 'Available' },
  { bg: '#3182F6', border: '#3182F6', label: 'Selected' },
  { bg: '#FFF4E5', border: 'transparent', label: 'Reserved' },
  { bg: '#E5E8EB', border: 'transparent', label: 'Sold Out' },
];

export const SeatSelectionPage = () => {
  const {
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
  } = useSeatSelection();

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={{ textAlign: 'center' }}>
          <div className="animate-spin" style={{ width: '32px', height: '32px', border: '3px solid #E5E8EB', borderTopColor: '#3182F6', borderRadius: '50%', margin: '0 auto 16px' }} />
          <p style={{ fontSize: '16px', color: '#8B95A1', fontWeight: '600' }}>Loading seats...</p>
        </div>
      </div>
    );
  }

  const canReserve = !!selectedSeatId && !isReserving;

  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        <div className="animate-fade-in-up" style={styles.header}>
          <p style={styles.stepText}>Step 2 of 3</p>
          <h1 style={styles.title}>Choose Your Seat</h1>
          <p style={styles.subtitle}>{seats.length} seats available in total.</p>
        </div>

        <div className="animate-fade-in-up" style={styles.card}>
          {/* 범례 (Legend) */}
          <div style={styles.legendWrapper}>
            {LEGEND_ITEMS.map(({ bg, border, label }) => (
              <div key={label} style={styles.legendItem}>
                <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: bg, border: `1.5px solid ${border}` }} />
                <span style={styles.legendLabel}>{label}</span>
              </div>
            ))}
          </div>

          <div style={styles.stage}>STAGE</div>

          <div style={styles.grid}>
            {Array.from({ length: numRows }).map((_, rowIndex) => (
              <div key={rowIndex} style={styles.row}>
                <span style={styles.rowLabel}>{getRowLabel(rowIndex)}</span>
                <div style={styles.seatRow}>
                  {seats.slice(rowIndex * SEATS_PER_ROW, (rowIndex + 1) * SEATS_PER_ROW).map((seat, colIndex) => {
                    const isSelected = selectedSeatId === seat.seatId;
                    const isReserved = seat.seatStatus === 'RESERVED';
                    const isSold = seat.seatStatus === 'SOLD';
                    const displayIndex = rowIndex * SEATS_PER_ROW + colIndex + 1;

                    return (
                      <button
                        key={seat.seatId}
                        className={`seat-button ${isSelected ? 'selected' : ''}`}
                        disabled={isReserved || isSold}
                        onClick={() => setSelectedSeatId(seat.seatId)}
                        style={getSeatStyle(isSelected, isReserved, isSold)}
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

      <div style={styles.footer}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <button
            onClick={handleReserve}
            disabled={!canReserve}
            className="reserve-button"
            style={getReserveButtonStyle(canReserve)}
          >
            {isReserving 
              ? 'Reserving...' 
              : selectedSeatId 
                ? `Reserve Seat — ${getDisplaySeatInfo(selectedSeatId)}` 
                : 'Select a seat to continue'}
          </button>
        </div>
      </div>
    </div>
  );
};
