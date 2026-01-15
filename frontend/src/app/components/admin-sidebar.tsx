import { useState } from "react";
import { Button } from "./ui/button";
import {
  Shield,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  Activity,
} from "lucide-react";

interface AdminSidebarProps {
  userEmail: string;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function AdminSidebar({ userEmail, currentPage, onNavigate, onLogout }: AdminSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const menuItems = [
    { id: "admin-dashboard", label: "Overview", icon: BarChart3 },
    { id: "admin-users", label: "User Management", icon: Users },
    { id: "admin-content", label: "Content Management", icon: BookOpen },
    { id: "admin-analytics", label: "Analytics & Reports", icon: Activity },
    { id: "admin-settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside
      className={`border-r border-border bg-sidebar flex-shrink-0 transition-all duration-300 ease-in-out flex flex-col h-screen ${
        isExpanded ? "w-72" : "w-20"
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="p-6 flex-1 flex flex-col">
        {/* Logo Section */}
        <div className={`flex items-center gap-2 mb-8 ${isExpanded ? "" : "justify-center"}`}>
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <div
            className={`transition-all duration-300 overflow-hidden ${
              isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
            }`}
          >
            <h2 className="font-semibold whitespace-nowrap">CyberGuard AI</h2>
            <p className="text-xs text-muted-foreground whitespace-nowrap">Admin Panel</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center rounded-lg transition-all ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                } ${isExpanded ? "gap-3 px-4 py-3" : "justify-center w-11 h-11 mx-auto"}`}
                title={!isExpanded ? item.label : ""}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isExpanded ? (
                  <span className="whitespace-nowrap">
                    {item.label}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Section */}
      <div className="p-6 border-t border-sidebar-border">
        <div className={`flex items-center gap-3 mb-4 ${isExpanded ? "" : "justify-center"}`}>
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-medium">
              {userEmail.charAt(0).toUpperCase()}
            </span>
          </div>
          <div
            className={`flex-1 min-w-0 transition-all duration-300 overflow-hidden ${
              isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
            }`}
          >
            <p className="font-medium text-sm truncate whitespace-nowrap">{userEmail}</p>
            <p className="text-xs text-muted-foreground whitespace-nowrap">Administrator</p>
          </div>
        </div>
        <Button
          variant="outline"
          className={`w-full transition-all duration-300 ${
            isExpanded ? "" : "px-0 justify-center"
          }`}
          onClick={onLogout}
          title={!isExpanded ? "Logout" : ""}
        >
          <LogOut className="w-4 h-4" />
          <span
            className={`transition-all duration-300 overflow-hidden ${
              isExpanded ? "opacity-100 ml-2" : "opacity-0 w-0"
            }`}
          >
            Logout
          </span>
        </Button>
      </div>
    </aside>
  );
}
