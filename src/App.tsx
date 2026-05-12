import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginPage } from './pages/Login/LoginPage';
import { WaitingRoomPage } from './pages/WaitingRoom/WaitingRoomPage';
import { SeatSelectionPage } from './pages/SeatSelection/SeatSelectionPage';
import { PaymentPage } from './pages/Payment/PaymentPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/waiting" element={<WaitingRoomPage />} />
          <Route path="/seats" element={<SeatSelectionPage />} />
          <Route path="/payment/:seatId" element={<PaymentPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
