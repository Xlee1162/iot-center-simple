import { useState, useRef, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Thermometer, Droplets, Sun, Lightbulb, Upload, Download, Save, Trash2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { toast } from "sonner";

// Environment mode
const ENV_MODE = "dev"; // Switch to "production" when backend is ready

// Sensor types available for placement
const SENSOR_TYPES = [
  { type: "temperature", label: "Temperature", icon: Thermometer, color: "text-red-500" },
  { type: "humidity", label: "Humidity", icon: Droplets, color: "text-blue-500" },
  { type: "light", label: "Light", icon: Sun, color: "text-yellow-500" },
  { type: "led_rgb", label: "LED RGB", icon: Lightbulb, color: "text-purple-500" },
];

// Zones for Floor 1
const ZONES = ["Zone1", "Zone2", "Zone3"];

interface PlacedSensor {
  id: string;
  type: string;
  x: number; // percentage
  y: number; // percentage
  zone: string;
  name: string;
}

interface MapConfig {
  floorPlanUrl: string;
  sensors: PlacedSensor[];
}

const STORAGE_KEY = "factory_map_config_floor1";

export default function Maps() {
  const [floorPlanUrl, setFloorPlanUrl] = useState<string>("");
  const [placedSensors, setPlacedSensors] = useState<PlacedSensor[]>([]);
  const [selectedZone, setSelectedZone] = useState<string>("all");
  const [draggedSensorType, setDraggedSensorType] = useState<string | null>(null);
  const [draggingSensor, setDraggingSensor] = useState<string | null>(null);
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    if (ENV_MODE === "dev") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const config: MapConfig = JSON.parse(saved);
          setFloorPlanUrl(config.floorPlanUrl);
          setPlacedSensors(config.sensors);
          toast.success("Map configuration loaded from localStorage");
        } catch (error) {
          console.error("Failed to load config:", error);
        }
      }
    }
  }, []);

  // Save to localStorage
  const saveToLocalStorage = () => {
    if (ENV_MODE === "dev") {
      const config: MapConfig = {
        floorPlanUrl,
        sensors: placedSensors,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      toast.success("Configuration saved to localStorage");
    }
  };

  // Export to JSON
  const exportConfig = () => {
    const config: MapConfig = {
      floorPlanUrl,
      sensors: placedSensors,
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `floor1_map_config_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Configuration exported");
  };

  // Import from JSON
  const importConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config: MapConfig = JSON.parse(e.target?.result as string);
        setFloorPlanUrl(config.floorPlanUrl);
        setPlacedSensors(config.sensors);
        toast.success("Configuration imported");
      } catch (error) {
        toast.error("Failed to import configuration");
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  // Upload floor plan image
  const handleFloorPlanUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setFloorPlanUrl(e.target?.result as string);
      toast.success("Floor plan uploaded");
    };
    reader.readAsDataURL(file);
  };

  // Handle drag start from sensor palette
  const handleDragStartFromPalette = (type: string) => {
    setDraggedSensorType(type);
  };

  // Handle drag start from placed sensor
  const handleDragStartFromPlaced = (sensorId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDraggingSensor(sensorId);
  };

  // Handle drop on map
  const handleDropOnMap = (e: React.MouseEvent) => {
    if (!mapContainerRef.current) return;

    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (draggedSensorType) {
      // Adding new sensor
      const newSensor: PlacedSensor = {
        id: `sensor_${Date.now()}`,
        type: draggedSensorType,
        x,
        y,
        zone: selectedZone === "all" ? ZONES[0] : selectedZone,
        name: `${draggedSensorType}_${placedSensors.length + 1}`,
      };
      setPlacedSensors([...placedSensors, newSensor]);
      toast.success("Sensor placed");
      setDraggedSensorType(null);
    } else if (draggingSensor) {
      // Moving existing sensor
      setPlacedSensors(
        placedSensors.map((s) =>
          s.id === draggingSensor ? { ...s, x, y } : s
        )
      );
      setDraggingSensor(null);
    }
  };

  // Delete sensor
  const deleteSensor = (id: string) => {
    setPlacedSensors(placedSensors.filter((s) => s.id !== id));
    if (selectedSensor === id) setSelectedSensor(null);
    toast.success("Sensor removed");
  };

  // Clear all sensors
  const clearAllSensors = () => {
    if (window.confirm("Are you sure you want to remove all sensors?")) {
      setPlacedSensors([]);
      setSelectedSensor(null);
      toast.success("All sensors removed");
    }
  };

  // Filter sensors by zone
  const filteredSensors = selectedZone === "all" 
    ? placedSensors 
    : placedSensors.filter((s) => s.zone === selectedZone);

  const getSensorIcon = (type: string) => {
    return SENSOR_TYPES.find((s) => s.type === type) || SENSOR_TYPES[0];
  };

  const selectedSensorData = placedSensors.find((s) => s.id === selectedSensor);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Factory Maps - Floor 1</h2>
        <p className="text-muted-foreground">Upload floor plan and place sensors by drag & drop</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4">
        <div>
          <Label htmlFor="floor-plan-upload">Upload Floor Plan</Label>
          <Input
            id="floor-plan-upload"
            type="file"
            accept="image/*"
            onChange={handleFloorPlanUpload}
            className="w-64"
          />
        </div>

        <Select value={selectedZone} onValueChange={setSelectedZone}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Zone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Zones</SelectItem>
            {ZONES.map((zone) => (
              <SelectItem key={zone} value={zone}>
                {zone}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button onClick={saveToLocalStorage} variant="outline" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button onClick={exportConfig} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={importConfig}
            className="hidden"
          />
          <Button onClick={clearAllSensors} variant="outline" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sensor Palette */}
        <Card>
          <CardHeader>
            <CardTitle>Sensor Palette</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground mb-4">Drag sensors to the map</p>
            {SENSOR_TYPES.map((sensor) => {
              const Icon = sensor.icon;
              return (
                <div
                  key={sensor.type}
                  draggable
                  onDragStart={() => handleDragStartFromPalette(sensor.type)}
                  className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-move hover:bg-accent/50 transition-colors"
                >
                  <Icon className={`h-5 w-5 ${sensor.color}`} />
                  <span className="font-medium">{sensor.label}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Map Area */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Floor Plan</CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline">{filteredSensors.length} sensors</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div
              ref={mapContainerRef}
              className="relative w-full h-[600px] bg-muted/20 rounded-lg border-2 border-dashed border-border overflow-hidden"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDropOnMap}
              onClick={handleDropOnMap}
            >
              {floorPlanUrl ? (
                <TransformWrapper
                  initialScale={1}
                  minScale={0.5}
                  maxScale={4}
                  centerOnInit
                >
                  {({ zoomIn, zoomOut, resetTransform }) => (
                    <>
                      <div className="absolute top-2 right-2 z-10 flex gap-2">
                        <Button size="icon" variant="secondary" onClick={() => zoomIn()}>
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="secondary" onClick={() => zoomOut()}>
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="secondary" onClick={() => resetTransform()}>
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                      <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full">
                        <div className="relative w-full h-full">
                          <img
                            src={floorPlanUrl}
                            alt="Floor Plan"
                            className="w-full h-full object-contain"
                          />
                          {/* Placed sensors */}
                          {filteredSensors.map((sensor) => {
                            const sensorInfo = getSensorIcon(sensor.type);
                            const Icon = sensorInfo.icon;
                            const isSelected = selectedSensor === sensor.id;

                            return (
                              <div
                                key={sensor.id}
                                draggable
                                onDragStart={(e) => handleDragStartFromPlaced(sensor.id, e)}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedSensor(sensor.id);
                                }}
                                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-move transition-all hover:scale-110 ${
                                  isSelected ? "scale-125 z-10" : ""
                                }`}
                                style={{
                                  left: `${sensor.x}%`,
                                  top: `${sensor.y}%`,
                                }}
                              >
                                <div
                                  className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 shadow-lg transition-all ${
                                    isSelected
                                      ? "bg-primary border-primary"
                                      : "bg-card border-border hover:border-primary"
                                  }`}
                                >
                                  <Icon className={`h-5 w-5 ${isSelected ? "text-primary-foreground" : sensorInfo.color}`} />
                                  {isSelected && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse" />
                                  )}
                                </div>
                                <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-card px-2 py-1 rounded text-xs border border-border shadow-sm">
                                  {sensor.name}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </TransformComponent>
                    </>
                  )}
                </TransformWrapper>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Upload a floor plan image to get started</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sensor Info Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Sensor Info</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedSensorData ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {(() => {
                      const sensorInfo = getSensorIcon(selectedSensorData.type);
                      const Icon = sensorInfo.icon;
                      return <Icon className={`h-5 w-5 ${sensorInfo.color}`} />;
                    })()}
                    <h3 className="font-semibold text-lg">{selectedSensorData.name}</h3>
                  </div>
                  <Badge variant="outline">{selectedSensorData.id}</Badge>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium capitalize">{selectedSensorData.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Zone:</span>
                    <span className="font-medium">{selectedSensorData.zone}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Position:</span>
                    <span className="font-medium">
                      X: {selectedSensorData.x.toFixed(1)}%, Y: {selectedSensorData.y.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={() => deleteSensor(selectedSensorData.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove Sensor
                </Button>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-sm">Click on a sensor to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
