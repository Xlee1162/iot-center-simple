import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Thermometer, Droplets, Sun, TrendingUp, TrendingDown, Minus } from "lucide-react";

// Mock data structure
const mockEquipmentData = [
  {
    id: "eq-001",
    name: "Máy ép 01",
    zone: "Zone A",
    line: "Line 1",
    process: "Process A",
    devices: [
      {
        id: "dev-001",
        type: "temperature",
        name: "Temperature Sensor",
        value: 28.5,
        unit: "°C",
        trend: "up",
        trendValue: "+1.2°C",
        status: "online",
      },
      {
        id: "dev-002",
        type: "humidity",
        name: "Humidity Sensor",
        value: 65,
        unit: "%",
        trend: "stable",
        trendValue: "0%",
        status: "online",
      },
    ],
  },
  {
    id: "eq-002",
    name: "Máy cắt 02",
    zone: "Zone A",
    line: "Line 1",
    process: "Process B",
    devices: [
      {
        id: "dev-003",
        type: "temperature",
        name: "Temperature Sensor",
        value: 32.1,
        unit: "°C",
        trend: "down",
        trendValue: "-0.5°C",
        status: "online",
      },
    ],
  },
  {
    id: "eq-003",
    name: "Máy hàn 03",
    zone: "Zone B",
    line: "Line 2",
    process: "Process C",
    devices: [
      {
        id: "dev-004",
        type: "light",
        name: "Light Sensor",
        value: 450,
        unit: "lux",
        trend: "up",
        trendValue: "+20 lux",
        status: "online",
      },
      {
        id: "dev-005",
        type: "temperature",
        name: "Temperature Sensor",
        value: 35.2,
        unit: "°C",
        trend: "up",
        trendValue: "+2.1°C",
        status: "warning",
      },
    ],
  },
  {
    id: "eq-004",
    name: "Máy đóng gói 04",
    zone: "Zone B",
    line: "Line 2",
    process: "Process D",
    devices: [
      {
        id: "dev-006",
        type: "temperature",
        name: "Temperature Sensor",
        value: 26.8,
        unit: "°C",
        trend: "stable",
        trendValue: "0°C",
        status: "online",
      },
    ],
  },
];

const getDeviceIcon = (type: string) => {
  switch (type) {
    case "temperature":
      return { Icon: Thermometer, color: "text-destructive bg-destructive/10" };
    case "humidity":
      return { Icon: Droplets, color: "text-primary bg-primary/10" };
    case "light":
      return { Icon: Sun, color: "text-warning bg-warning/10" };
    default:
      return { Icon: Thermometer, color: "text-muted-foreground bg-muted" };
  }
};

export default function DeviceListByLine() {
  const [selectedZone, setSelectedZone] = useState<string>("all");
  const [selectedLine, setSelectedLine] = useState<string>("all");

  const zones = ["all", ...new Set(mockEquipmentData.map((e) => e.zone))];
  const lines = ["all", ...new Set(mockEquipmentData.map((e) => e.line))];

  const filteredEquipment = mockEquipmentData.filter((equipment) => {
    if (selectedZone !== "all" && equipment.zone !== selectedZone) return false;
    if (selectedLine !== "all" && equipment.line !== selectedLine) return false;
    return true;
  });

  // Group by Zone and Line
  const groupedData = filteredEquipment.reduce((acc, equipment) => {
    const key = `${equipment.zone} - ${equipment.line}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(equipment);
    return acc;
  }, {} as Record<string, typeof mockEquipmentData>);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Device List by Line</h2>
        <p className="text-muted-foreground">View equipment and embedded devices organized by production line</p>
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

      {/* Equipment List grouped by Zone and Line */}
      <div className="space-y-6">
        {Object.entries(groupedData).map(([groupKey, equipments]) => (
          <div key={groupKey} className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold text-foreground">{groupKey}</h3>
              <Badge variant="secondary">{equipments.length} Equipment</Badge>
            </div>

            {/* Equipment Cards - Horizontal Layout */}
            <div className="flex flex-wrap gap-4">
              {equipments.map((equipment) => (
                <Card key={equipment.id} className="flex-shrink-0 w-full sm:w-auto">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg">{equipment.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{equipment.process}</p>
                      </div>
                      <Badge variant="outline">{equipment.id}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Devices stacked vertically */}
                    <div className="space-y-3">
                      {equipment.devices.map((device) => {
                        const { Icon, color } = getDeviceIcon(device.type);
                        return (
                          <Card key={device.id} className="border-border/50">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${color}`}>
                                  <Icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground truncate">
                                    {device.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">{device.id}</p>
                                </div>
                                <div className="text-right">
                                  <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold text-foreground">
                                      {device.value}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {device.unit}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-end gap-1 text-xs mt-1">
                                    {device.trend === "up" ? (
                                      <TrendingUp className="h-3 w-3 text-success" />
                                    ) : device.trend === "down" ? (
                                      <TrendingDown className="h-3 w-3 text-destructive" />
                                    ) : (
                                      <Minus className="h-3 w-3 text-muted-foreground" />
                                    )}
                                    <span
                                      className={
                                        device.trend === "up"
                                          ? "text-success"
                                          : device.trend === "down"
                                          ? "text-destructive"
                                          : "text-muted-foreground"
                                      }
                                    >
                                      {device.trendValue}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {Object.keys(groupedData).length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No equipment found for the selected filters
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
