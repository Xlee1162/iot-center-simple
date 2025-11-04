import { useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { RotateCcw, Save } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { mockFloors, mockZones, mockLines, mockEquipment } from "../../data/mockSystem";

interface SystemConfig {
  dataRefreshRate: number;
  defaultFloor: string;
  defaultZone: string;
  alertThresholds: {
    temperature: { warning: number; danger: number };
    humidity: { warning: number; danger: number };
    pressure: { warning: number; danger: number };
  };
}

const DEFAULT_CONFIG: SystemConfig = {
  dataRefreshRate: 5000,
  defaultFloor: 'floor-1',
  defaultZone: 'zone-1',
  alertThresholds: {
    temperature: { warning: 28, danger: 30 },
    humidity: { warning: 70, danger: 80 },
    pressure: { warning: 110, danger: 120 },
  },
};

export default function SystemSettings() {
  const [config, setConfig] = useState<SystemConfig>(() => {
    const saved = localStorage.getItem("system-settings");
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });
  const { toast } = useToast();

  const saveConfig = () => {
    localStorage.setItem("system-settings", JSON.stringify(config));
    toast({
      title: "Settings Saved",
      description: "System settings have been saved successfully.",
    });
  };

  const resetToDefaults = () => {
    setConfig(DEFAULT_CONFIG);
    localStorage.setItem("system-settings", JSON.stringify(DEFAULT_CONFIG));
    toast({
      title: "Reset to Defaults",
      description: "Settings have been reset to default values.",
    });
  };

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">System Settings</h2>
            <p className="text-muted-foreground">
              Configure system-wide settings and thresholds
            </p>
          </div>
          <Button variant="outline" onClick={resetToDefaults}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
        </div>

        <div className="space-y-6">
          {/* Data Refresh Rate */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Data Settings</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data Refresh Rate (ms)</Label>
                  <Select
                    value={config.dataRefreshRate.toString()}
                    onValueChange={(value) =>
                      setConfig({ ...config, dataRefreshRate: parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1000">1 second</SelectItem>
                      <SelectItem value="3000">3 seconds</SelectItem>
                      <SelectItem value="5000">5 seconds</SelectItem>
                      <SelectItem value="10000">10 seconds</SelectItem>
                      <SelectItem value="30000">30 seconds</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Default Floor</Label>
                  <Select
                    value={config.defaultFloor}
                    onValueChange={(value) =>
                      setConfig({ ...config, defaultFloor: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockFloors.map((floor) => (
                        <SelectItem key={floor.id} value={floor.id}>
                          {floor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Card>

          {/* Alert Thresholds */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Alert Thresholds</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-3 grid grid-cols-3 gap-4 items-center text-sm font-medium text-muted-foreground">
                  <div>Metric</div>
                  <div>Warning</div>
                  <div>Danger</div>
                </div>

                <div className="text-sm font-medium">Temperature (°C)</div>
                <Select
                  value={config.alertThresholds.temperature.warning.toString()}
                  onValueChange={(value) =>
                    setConfig({
                      ...config,
                      alertThresholds: {
                        ...config.alertThresholds,
                        temperature: {
                          ...config.alertThresholds.temperature,
                          warning: parseInt(value),
                        },
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[25, 26, 27, 28, 29, 30].map((v) => (
                      <SelectItem key={v} value={v.toString()}>
                        {v}°C
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={config.alertThresholds.temperature.danger.toString()}
                  onValueChange={(value) =>
                    setConfig({
                      ...config,
                      alertThresholds: {
                        ...config.alertThresholds,
                        temperature: {
                          ...config.alertThresholds.temperature,
                          danger: parseInt(value),
                        },
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[28, 29, 30, 31, 32, 33, 34, 35].map((v) => (
                      <SelectItem key={v} value={v.toString()}>
                        {v}°C
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="text-sm font-medium">Humidity (%)</div>
                <Select
                  value={config.alertThresholds.humidity.warning.toString()}
                  onValueChange={(value) =>
                    setConfig({
                      ...config,
                      alertThresholds: {
                        ...config.alertThresholds,
                        humidity: {
                          ...config.alertThresholds.humidity,
                          warning: parseInt(value),
                        },
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[60, 65, 70, 75, 80].map((v) => (
                      <SelectItem key={v} value={v.toString()}>
                        {v}%
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={config.alertThresholds.humidity.danger.toString()}
                  onValueChange={(value) =>
                    setConfig({
                      ...config,
                      alertThresholds: {
                        ...config.alertThresholds,
                        humidity: {
                          ...config.alertThresholds.humidity,
                          danger: parseInt(value),
                        },
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[75, 80, 85, 90, 95].map((v) => (
                      <SelectItem key={v} value={v.toString()}>
                        {v}%
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* System Hierarchy Info */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">System Hierarchy</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Floors:</span>
                <span className="font-medium">{mockFloors.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Zones:</span>
                <span className="font-medium">{mockZones.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Lines:</span>
                <span className="font-medium">{mockLines.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Equipment:</span>
                <span className="font-medium">{mockEquipment.length}</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={saveConfig}>
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </Card>
    </div>
  );
}
