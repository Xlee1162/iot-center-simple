import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Thermometer, Droplets, Sun, X, TrendingUp, TrendingDown } from "lucide-react";

// Mock data structure
const mockDevices = [
  {
    id: "dev-001",
    name: "Temp Sensor 1",
    type: "temperature",
    value: 28.5,
    unit: "°C",
    trend: "up",
    trendValue: "+1.2°C",
    position: { x: 15, y: 20 },
    equipment: "Máy ép 01",
    process: "Process A",
    line: "Line 1",
    zone: "Zone A",
    timestamp: "2025-10-30 14:30:25",
  },
  {
    id: "dev-002",
    name: "Humidity Sensor 1",
    type: "humidity",
    value: 65,
    unit: "%",
    trend: "stable",
    trendValue: "0%",
    position: { x: 15, y: 25 },
    equipment: "Máy ép 01",
    process: "Process A",
    line: "Line 1",
    zone: "Zone A",
    timestamp: "2025-10-30 14:30:25",
  },
  {
    id: "dev-003",
    name: "Temp Sensor 2",
    type: "temperature",
    value: 32.1,
    unit: "°C",
    trend: "down",
    trendValue: "-0.5°C",
    position: { x: 45, y: 30 },
    equipment: "Máy cắt 02",
    process: "Process B",
    line: "Line 1",
    zone: "Zone A",
    timestamp: "2025-10-30 14:30:22",
  },
  {
    id: "dev-004",
    name: "Light Sensor 1",
    type: "light",
    value: 450,
    unit: "lux",
    trend: "up",
    trendValue: "+20 lux",
    position: { x: 70, y: 25 },
    equipment: "Máy hàn 03",
    process: "Process C",
    line: "Line 2",
    zone: "Zone B",
    timestamp: "2025-10-30 14:30:20",
  },
  {
    id: "dev-005",
    name: "Temp Sensor 3",
    type: "temperature",
    value: 26.8,
    unit: "°C",
    trend: "stable",
    trendValue: "0°C",
    position: { x: 80, y: 60 },
    equipment: "Máy đóng gói 04",
    process: "Process D",
    line: "Line 2",
    zone: "Zone B",
    timestamp: "2025-10-30 14:30:18",
  },
];

const getDeviceIcon = (type: string) => {
  switch (type) {
    case "temperature":
      return { Icon: Thermometer, label: "T", color: "text-destructive" };
    case "humidity":
      return { Icon: Droplets, label: "H", color: "text-primary" };
    case "light":
      return { Icon: Sun, label: "L", color: "text-warning" };
    default:
      return { Icon: Thermometer, label: "?", color: "text-muted-foreground" };
  }
};

export default function Maps() {
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<string>("all");
  const [selectedLine, setSelectedLine] = useState<string>("all");

  const zones = ["all", ...new Set(mockDevices.map((d) => d.zone))];
  const lines = ["all", ...new Set(mockDevices.map((d) => d.line))];

  const filteredDevices = mockDevices.filter((device) => {
    if (selectedZone !== "all" && device.zone !== selectedZone) return false;
    if (selectedLine !== "all" && device.line !== selectedLine) return false;
    return true;
  });

  const selectedDeviceData = mockDevices.find((d) => d.id === selectedDevice);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Factory Maps</h2>
        <p className="text-muted-foreground">Visualize device locations on factory floor plan</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={selectedZone} onValueChange={setSelectedZone}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Zone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Zones</SelectItem>
            {zones.slice(1).map((zone) => (
              <SelectItem key={zone} value={zone}>
                {zone}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedLine} onValueChange={setSelectedLine}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Line" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Lines</SelectItem>
            {lines.slice(1).map((line) => (
              <SelectItem key={line} value={line}>
                {line}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Area */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Factory Floor Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-[600px] bg-muted/20 rounded-lg border-2 border-border overflow-hidden">
              {/* Floor plan background - placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-muted/10 to-muted/30" />
              
              {/* Grid lines */}
              <svg className="absolute inset-0 w-full h-full opacity-20">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* Device markers */}
              {filteredDevices.map((device) => {
                const { Icon, label, color } = getDeviceIcon(device.type);
                const isSelected = selectedDevice === device.id;

                return (
                  <button
                    key={device.id}
                    onClick={() => setSelectedDevice(device.id)}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110 ${
                      isSelected ? "scale-125 z-10" : ""
                    }`}
                    style={{
                      left: `${device.position.x}%`,
                      top: `${device.position.y}%`,
                    }}
                  >
                    <div
                      className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 shadow-lg transition-all ${
                        isSelected
                          ? "bg-primary border-primary text-primary-foreground"
                          : "bg-card border-border hover:border-primary"
                      }`}
                    >
                      <span className={`text-sm font-bold ${isSelected ? "" : color}`}>
                        {label}
                      </span>
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Device Info Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Device Information
              {selectedDevice && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedDevice(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDeviceData ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {(() => {
                      const { Icon, color } = getDeviceIcon(selectedDeviceData.type);
                      return <Icon className={`h-5 w-5 ${color}`} />;
                    })()}
                    <h3 className="font-semibold text-lg">{selectedDeviceData.name}</h3>
                  </div>
                  <Badge variant="outline">{selectedDeviceData.id}</Badge>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-foreground">
                      {selectedDeviceData.value}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {selectedDeviceData.unit}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    {selectedDeviceData.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-success" />
                    ) : selectedDeviceData.trend === "down" ? (
                      <TrendingDown className="h-4 w-4 text-destructive" />
                    ) : null}
                    <span
                      className={
                        selectedDeviceData.trend === "up"
                          ? "text-success"
                          : selectedDeviceData.trend === "down"
                          ? "text-destructive"
                          : "text-muted-foreground"
                      }
                    >
                      {selectedDeviceData.trendValue}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Equipment:</span>
                    <span className="font-medium">{selectedDeviceData.equipment}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Zone:</span>
                    <span className="font-medium">{selectedDeviceData.zone}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Line:</span>
                    <span className="font-medium">{selectedDeviceData.line}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Process:</span>
                    <span className="font-medium">{selectedDeviceData.process}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-xs text-muted-foreground">Last Update</div>
                  <div className="text-sm font-medium">{selectedDeviceData.timestamp}</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Click on a device marker to view details
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
