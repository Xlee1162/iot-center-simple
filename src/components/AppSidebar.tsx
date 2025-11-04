import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Sliders,
  Wifi,
  Radio,
  Upload,
  Settings,
  Map,
  ChevronDown,
  Cable
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
} from "./ui/sidebar"; 
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Maps View", url: "/maps", icon: Map },
  { title: "Equipment View", url: "/devices", icon: LayoutDashboard },
  { title: "Device Control", url: "/control", icon: Sliders },
  { title: "Connection Status", url: "/status", icon: Wifi },
  { title: "MQTT Interface", url: "/mqtt", icon: Radio },
  { title: "FOTA Management", url: "/fota", icon: Upload },
];

const masterConfigItems = [
    {
        title: 'Device & Sensor',
        url: '/master-config/device-sensor-mapping',
        icon: Cable,
    },
    {
        title: 'Maps Config',
        url: '/master-config/maps-config',
        icon: Map,
    },
    {
        title: 'Dashboard Layout',
        url: '/master-config/dashboard-layout',
        icon: LayoutDashboard,
    },
    {
        title: 'System Settings',
        url: '/master-config/system-settings',
        icon: Settings,
    },
];

export function AppSidebar() {
  const { open, setOpen } = useSidebar();
  const location = useLocation();
  const isCurrentlyOnMasterConfig = location.pathname.startsWith("/master-config");

  const [isMasterConfigOpen, setMasterConfigOpen] = useState(isCurrentlyOnMasterConfig);

  useEffect(() => {
    if (isCurrentlyOnMasterConfig) {
      setMasterConfigOpen(true);
    }
  }, [isCurrentlyOnMasterConfig]);


  const getNavCls = (path: string, isExact: boolean = true) => {
    const isActive = isExact 
      ? location.pathname === path
      : location.pathname.startsWith(path);
    return isActive
      ? "bg-sidebar-accent text-sidebar-primary font-medium"
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground";
  };

  const handleDoubleClick = () => {
    setOpen(false);
  };

  const toggleMasterConfig = () => {
      setMasterConfigOpen(!isMasterConfigOpen);
  }

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarContent onDoubleClick={handleDoubleClick} className="cursor-pointer relative">
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="fixed left-6 top-1/2 -translate-y-1/2 z-50 h-10 w-10 rounded-full bg-sidebar-accent hover:bg-sidebar-accent/80 flex items-center justify-center transition-all duration-300 shadow-lg"
            aria-label="Open sidebar"
          >
            <Radio className="h-5 w-5 text-sidebar-foreground" />
          </button>
        )}
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
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls(item.url)}>
                      <item.icon className="h-4 w-4" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {/* Master Config Tree */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={toggleMasterConfig}
                  className={cn("justify-between", getNavCls("/master-config", false))}
                >
                  <div className="flex items-center gap-3">
                      <Settings className="h-4 w-4" />
                      {open && <span>Master Config</span>}
                  </div>
                  {open && <ChevronDown className={cn("h-4 w-4 transition-transform", isMasterConfigOpen && "rotate-180")} />}
                </SidebarMenuButton>
                {open && isMasterConfigOpen && (
                    <div className="pl-8 pr-4 py-2 space-y-2">
                        {masterConfigItems.map(subItem => (
                            <NavLink key={subItem.url} to={subItem.url} className={cn("flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground", getNavCls(subItem.url, true))}>
                                <subItem.icon className="h-4 w-4"/>
                                {subItem.title}
                            </NavLink>
                        ))}
                    </div>
                )}
              </SidebarMenuItem>

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
