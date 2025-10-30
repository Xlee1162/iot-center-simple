import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Sliders,
  Wifi,
  Radio,
  Upload,
  Settings,
  Map,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Maps", url: "/maps", icon: Map },
  { title: "Equipment View", url: "/devices", icon: LayoutDashboard },
  { title: "Device Control", url: "/control", icon: Sliders },
  { title: "Connection Status", url: "/status", icon: Wifi },
  { title: "MQTT Interface", url: "/mqtt", icon: Radio },
  { title: "FOTA Management", url: "/fota", icon: Upload },
  { title: "Device-Sensor Mapping", url: "/device-config", icon: Settings },
  { title: "Master Config", url: "/config", icon: Settings },
];

export function AppSidebar() {
  const { open, setOpen } = useSidebar();
  const location = useLocation();

  const getNavCls = (path: string) => {
    const isActive = location.pathname === path;
    return isActive
      ? "bg-sidebar-accent text-sidebar-primary font-medium"
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground";
  };

  const handleDoubleClick = () => {
    setOpen(false);
  };

  return (
    <Sidebar className="border-r border-sidebar-border relative">
      {/* Floating toggle button when collapsed */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 h-10 w-10 rounded-full bg-sidebar-accent hover:bg-sidebar-accent/80 flex items-center justify-center transition-all duration-300 shadow-lg"
          aria-label="Open sidebar"
        >
          <Radio className="h-5 w-5 text-sidebar-foreground" />
        </button>
      )}
      <SidebarContent onDoubleClick={handleDoubleClick} className="cursor-pointer">
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Radio className="h-5 w-5 text-white" />
            </div>
            {open && (
              <div>
                <h2 className="text-lg font-semibold text-sidebar-foreground">IoT Dashboard</h2>
                <p className="text-xs text-sidebar-foreground/60">Realtime Control</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls(item.url)}>
                      <item.icon className="h-4 w-4" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
