import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import MapsView from "./pages/MapsView";
import DeviceListByLine from "./pages/DeviceListByLine";
import DeviceControl from "./pages/DeviceControl";
import ConnectionStatus from "./pages/ConnectionStatus";
import MqttInterface from "./pages/MqttInterface";
import FotaManagement from "./pages/FotaManagement";
import MasterConfigLayout from "./pages/master-config/MasterConfigLayout";
import DeviceSensorMapping from "./pages/master-config/DeviceSensorMapping";
import MapsConfig from "./pages/master-config/MapsConfig";
import DashboardLayout from "./pages/master-config/DashboardLayout";
import SystemSettings from "./pages/master-config/SystemSettings";
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
            <Route path="/maps" element={<MapsView />} />
            <Route path="/devices" element={<DeviceListByLine />} />
            <Route path="/control" element={<DeviceControl />} />
            <Route path="/status" element={<ConnectionStatus />} />
            <Route path="/mqtt" element={<MqttInterface />} />
            <Route path="/fota" element={<FotaManagement />} />
            <Route path="/master-config" element={<MasterConfigLayout />}>
              <Route path="device-sensor-mapping" element={<DeviceSensorMapping />} />
              <Route path="maps-config" element={<MapsConfig />} />
              <Route path="dashboard-layout" element={<DashboardLayout />} />
              <Route path="system-settings" element={<SystemSettings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
