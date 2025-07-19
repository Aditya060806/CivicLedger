import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  MapPin,
  FileText,
  AlertTriangle,
  User,
  Vote,
  Activity,
  Settings,
  HelpCircle,
  ChevronRight
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
import { Badge } from "@/components/ui/badge";

const menuItems = [
  { 
    title: "Citizen Dashboard", 
    url: "/citizen-dashboard", 
    icon: Home,
    badge: null
  },
  { 
    title: "My Area", 
    url: "/my-area", 
    icon: MapPin,
    badge: null
  },
  { 
    title: "Available Schemes", 
    url: "/schemes", 
    icon: FileText,
    badge: 5
  },
  { 
    title: "File Complaint", 
    url: "/file-complaint", 
    icon: AlertTriangle,
    badge: 2
  },
  { 
    title: "My Applications", 
    url: "/applications", 
    icon: User,
    badge: 3
  },
  { 
    title: "DAO Voting", 
    url: "/dao-voting", 
    icon: Vote,
    badge: 1
  }
];

const recentActivities = [
  { id: 1, text: "Your application was approved", time: "2 hours ago" },
  { id: 2, text: "New scheme available in your area", time: "1 day ago" }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const isExpanded = menuItems.some((item) => isActive(item.url));

  const getNavClass = (isActiveItem: boolean) =>
    `w-full justify-start transition-all duration-200 ${
      isActiveItem 
        ? "bg-civic-primary text-white hover:bg-civic-primary/90" 
        : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
    }`;

  return (
    <Sidebar className={collapsed ? "w-14" : "w-72"}>
      <SidebarContent className="bg-background">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={getNavClass(isActive(item.url))}
                      >
                        <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                        {!collapsed && (
                          <>
                            <span className="flex-1">{item.title}</span>
                            {item.badge && (
                              <Badge 
                                variant="secondary" 
                                className="ml-auto text-xs bg-civic-blue text-white"
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </motion.div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 px-4"
          >
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center text-sm font-medium mb-3">
                <Activity className="w-4 h-4 mr-2" />
                Recent Activity
              </SidebarGroupLabel>
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <motion.div
                    key={activity.id}
                    className="p-3 bg-muted/30 rounded-lg border-l-2 border-civic-blue"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <p className="text-xs text-foreground leading-relaxed">
                      {activity.text}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center">
                      <Activity className="w-3 h-3 mr-1" />
                      {activity.time}
                    </p>
                  </motion.div>
                ))}
              </div>
            </SidebarGroup>
          </motion.div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}