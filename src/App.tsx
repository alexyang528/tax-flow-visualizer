import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ConfigProvider, message } from 'antd';
import PayrollTaxDashboard from './components/PayrollTaxDashboard';

const queryClient = new QueryClient();

// Configure message duration
message.config({
  duration: 3,
  maxCount: 3,
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 6,
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <PayrollTaxDashboard />
    </ConfigProvider>
  </QueryClientProvider>
);

export default App;
