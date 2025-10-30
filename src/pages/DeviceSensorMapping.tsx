import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Download, Upload, ExternalLink, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type DeviceType = "ESP8266_D1_MINI" | "ESP32_NANO";
type SensorType = "temperature" | "humidity" | "light" | "led_rgb";

interface SensorConfig {
  type: SensorType;
  name: string;
  pinMappings: {
    sensorPin: string;
    devicePin: string;
  }[];
  measurementRange: {
    min: number;
    max: number;
    unit: string;
  };
  errorMargin: number;
  datasheetUrl: string;
}

interface DeviceConfig {
  deviceType: DeviceType;
  deviceId: string;
  deviceName: string;
  sensors: SensorConfig[];
  dataSendInterval: {
    value: number;
    unit: "seconds" | "minutes";
  };
  heartbeatInterval: {
    value: number;
    unit: "seconds" | "minutes";
  };
}

const ESP8266_PINS = ["D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "3V3", "GND"];
const ESP32_PINS = ["GPIO0", "GPIO1", "GPIO2", "GPIO3", "GPIO4", "GPIO5", "GPIO12", "GPIO13", "GPIO14", "GPIO15", "GPIO16", "GPIO17", "3V3", "GND"];

const SENSOR_DEFAULTS: Record<SensorType, Partial<SensorConfig>> = {
  temperature: {
    measurementRange: { min: -40, max: 125, unit: "°C" },
    errorMargin: 0.5,
    pinMappings: [{ sensorPin: "VCC", devicePin: "" }, { sensorPin: "DATA", devicePin: "" }, { sensorPin: "GND", devicePin: "" }],
  },
  humidity: {
    measurementRange: { min: 0, max: 100, unit: "%" },
    errorMargin: 2,
    pinMappings: [{ sensorPin: "VCC", devicePin: "" }, { sensorPin: "DATA", devicePin: "" }, { sensorPin: "GND", devicePin: "" }],
  },
  light: {
    measurementRange: { min: 0, max: 65535, unit: "lux" },
    errorMargin: 5,
    pinMappings: [{ sensorPin: "VCC", devicePin: "" }, { sensorPin: "OUT", devicePin: "" }, { sensorPin: "GND", devicePin: "" }],
  },
  led_rgb: {
    measurementRange: { min: 0, max: 255, unit: "PWM" },
    errorMargin: 0,
    pinMappings: [
      { sensorPin: "R", devicePin: "" },
      { sensorPin: "G", devicePin: "" },
      { sensorPin: "B", devicePin: "" },
      { sensorPin: "VCC", devicePin: "" },
      { sensorPin: "GND", devicePin: "" },
    ],
  },
};

export default function DeviceSensorMapping() {
  const { toast } = useToast();
  const [showPinout, setShowPinout] = useState(false);
  const [config, setConfig] = useState<DeviceConfig>({
    deviceType: "ESP8266_D1_MINI",
    deviceId: "",
    deviceName: "",
    sensors: [],
    dataSendInterval: { value: 30, unit: "seconds" },
    heartbeatInterval: { value: 60, unit: "seconds" },
  });

  const availablePins = config.deviceType === "ESP8266_D1_MINI" ? ESP8266_PINS : ESP32_PINS;

  const addSensor = (type: SensorType) => {
    const defaults = SENSOR_DEFAULTS[type];
    const newSensor: SensorConfig = {
      type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Sensor ${config.sensors.length + 1}`,
      pinMappings: defaults.pinMappings || [],
      measurementRange: defaults.measurementRange || { min: 0, max: 100, unit: "" },
      errorMargin: defaults.errorMargin || 0,
      datasheetUrl: "",
    };
    setConfig({ ...config, sensors: [...config.sensors, newSensor] });
  };

  const updateSensor = (index: number, updates: Partial<SensorConfig>) => {
    const newSensors = [...config.sensors];
    newSensors[index] = { ...newSensors[index], ...updates };
    setConfig({ ...config, sensors: newSensors });
  };

  const updatePinMapping = (sensorIndex: number, pinIndex: number, devicePin: string) => {
    const newSensors = [...config.sensors];
    newSensors[sensorIndex].pinMappings[pinIndex].devicePin = devicePin;
    setConfig({ ...config, sensors: newSensors });
  };

  const removeSensor = (index: number) => {
    setConfig({ ...config, sensors: config.sensors.filter((_, i) => i !== index) });
  };

  const saveToLocalStorage = () => {
    localStorage.setItem("deviceSensorConfig", JSON.stringify(config));
    toast({ title: "Saved", description: "Configuration saved to localStorage" });
  };

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem("deviceSensorConfig");
    if (saved) {
      setConfig(JSON.parse(saved));
      toast({ title: "Loaded", description: "Configuration loaded from localStorage" });
    }
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `device-config-${config.deviceId || "unnamed"}.json`;
    link.click();
    toast({ title: "Exported", description: "Configuration exported to JSON file" });
  };

  const importFromJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          setConfig(imported);
          toast({ title: "Imported", description: "Configuration imported successfully" });
        } catch {
          toast({ title: "Error", description: "Invalid JSON file", variant: "destructive" });
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Device-Sensor Mapping</h1>
          <p className="text-muted-foreground mt-1">Configure pin mappings and sensor settings for ESP devices</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadFromLocalStorage}>
            <Upload className="h-4 w-4 mr-2" />
            Load
          </Button>
          <Button variant="outline" size="sm" onClick={saveToLocalStorage}>
            <Download className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={exportToJSON}>
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
          <label>
            <Button variant="outline" size="sm" asChild>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                Import JSON
              </span>
            </Button>
            <input type="file" accept=".json" onChange={importFromJSON} className="hidden" />
          </label>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Device Information</CardTitle>
          <CardDescription>Basic device configuration and type selection</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Device Type</Label>
              <Select
                value={config.deviceType}
                onValueChange={(value) => setConfig({ ...config, deviceType: value as DeviceType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ESP8266_D1_MINI">ESP8266 D1 Mini</SelectItem>
                  <SelectItem value="ESP32_NANO">ESP32 Nano</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Device ID</Label>
              <Input
                value={config.deviceId}
                onChange={(e) => setConfig({ ...config, deviceId: e.target.value })}
                placeholder="e.g., ESP-001"
              />
            </div>
            <div className="space-y-2">
              <Label>Device Name</Label>
              <Input
                value={config.deviceName}
                onChange={(e) => setConfig({ ...config, deviceName: e.target.value })}
                placeholder="e.g., Temperature Monitor"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowPinout(!showPinout)}>
              {showPinout ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showPinout ? "Hide" : "Show"} Pinout Diagram
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a
                href={config.deviceType === "ESP8266_D1_MINI" 
                  ? "https://www.wemos.cc/en/latest/d1/d1_mini.html"
                  : "https://docs.espressif.com/projects/esp-idf/en/latest/esp32/hw-reference/esp32/get-started-devkitc.html"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Datasheet
              </a>
            </Button>
          </div>

          {showPinout && (
            <div className="p-4 border rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground text-center">
                📌 Pinout diagram placeholder - Replace with actual pinout image for {config.deviceType}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Timing Configuration</CardTitle>
          <CardDescription>Set data transmission and heartbeat intervals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Data Send Interval</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min={1}
                  max={3600}
                  value={config.dataSendInterval.value}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      dataSendInterval: { ...config.dataSendInterval, value: parseInt(e.target.value) || 1 },
                    })
                  }
                  className="flex-1"
                />
                <Select
                  value={config.dataSendInterval.unit}
                  onValueChange={(value) =>
                    setConfig({
                      ...config,
                      dataSendInterval: { ...config.dataSendInterval, unit: value as "seconds" | "minutes" },
                    })
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seconds">Seconds</SelectItem>
                    <SelectItem value="minutes">Minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Heartbeat Interval</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min={1}
                  max={3600}
                  value={config.heartbeatInterval.value}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      heartbeatInterval: { ...config.heartbeatInterval, value: parseInt(e.target.value) || 1 },
                    })
                  }
                  className="flex-1"
                />
                <Select
                  value={config.heartbeatInterval.unit}
                  onValueChange={(value) =>
                    setConfig({
                      ...config,
                      heartbeatInterval: { ...config.heartbeatInterval, unit: value as "seconds" | "minutes" },
                    })
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seconds">Seconds</SelectItem>
                    <SelectItem value="minutes">Minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sensors Configuration</CardTitle>
          <CardDescription>Add and configure sensors for this device</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" onClick={() => addSensor("temperature")}>+ Temperature</Button>
            <Button size="sm" onClick={() => addSensor("humidity")}>+ Humidity</Button>
            <Button size="sm" onClick={() => addSensor("light")}>+ Light</Button>
            <Button size="sm" onClick={() => addSensor("led_rgb")}>+ LED RGB</Button>
          </div>

          <Separator />

          {config.sensors.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No sensors configured. Click buttons above to add sensors.
            </div>
          )}

          <div className="space-y-4">
            {config.sensors.map((sensor, sensorIndex) => (
              <Card key={sensorIndex}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{sensor.name}</CardTitle>
                      <Badge variant="outline">{sensor.type}</Badge>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => removeSensor(sensorIndex)}>
                      Remove
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Sensor Name</Label>
                      <Input
                        value={sensor.name}
                        onChange={(e) => updateSensor(sensorIndex, { name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Datasheet URL</Label>
                      <div className="flex gap-2">
                        <Input
                          value={sensor.datasheetUrl}
                          onChange={(e) => updateSensor(sensorIndex, { datasheetUrl: e.target.value })}
                          placeholder="https://..."
                        />
                        {sensor.datasheetUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={sensor.datasheetUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Min Value</Label>
                      <Input
                        type="number"
                        value={sensor.measurementRange.min}
                        onChange={(e) =>
                          updateSensor(sensorIndex, {
                            measurementRange: {
                              ...sensor.measurementRange,
                              min: parseFloat(e.target.value),
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Value</Label>
                      <Input
                        type="number"
                        value={sensor.measurementRange.max}
                        onChange={(e) =>
                          updateSensor(sensorIndex, {
                            measurementRange: {
                              ...sensor.measurementRange,
                              max: parseFloat(e.target.value),
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit</Label>
                      <Input
                        value={sensor.measurementRange.unit}
                        onChange={(e) =>
                          updateSensor(sensorIndex, {
                            measurementRange: {
                              ...sensor.measurementRange,
                              unit: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Error Margin</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={sensor.errorMargin}
                        onChange={(e) =>
                          updateSensor(sensorIndex, { errorMargin: parseFloat(e.target.value) })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Pin Mapping</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {sensor.pinMappings.map((mapping, pinIndex) => (
                        <div key={pinIndex} className="flex items-center gap-2">
                          <Label className="w-20 text-sm">{mapping.sensorPin}:</Label>
                          <Select
                            value={mapping.devicePin}
                            onValueChange={(value) => updatePinMapping(sensorIndex, pinIndex, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select pin" />
                            </SelectTrigger>
                            <SelectContent>
                              {availablePins.map((pin) => (
                                <SelectItem key={pin} value={pin}>
                                  {pin}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
