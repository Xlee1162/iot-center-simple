import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import Maps from "./pages/Maps";
import DeviceListByLine from "./pages/DeviceListByLine";
import DeviceControl from "./pages/DeviceControl";
import ConnectionStatus from "./pages/ConnectionStatus";
import MqttInterface from "./pages/MqttInterface";
import FotaManagement from "./pages/FotaManagement";
import DeviceSensorMapping from "./pages/DeviceSensorMapping";
import MasterConfig from "./pages/MasterConfig";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/maps" element={<Maps />} />
            <Route path="/devices" element={<DeviceListByLine />} />
            <Route path="/control" element={<DeviceControl />} />
            <Route path="/status" element={<ConnectionStatus />} />
            <Route path="/mqtt" element={<MqttInterface />} />
            <Route path="/fota" element={<FotaManagement />} />
            <Route path="/device-config" element={<DeviceSensorMapping />} />
            <Route path="/config" element={<MasterConfig />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
