import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Film, 
  Users, 
  Newspaper, 
  BookOpen, 
  BarChart3, 
  Trophy, 
  UserCog, 
  Shield, 
  MessageSquare, 
  Mail,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const sidebarItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/admin" },
  { label: "Movies", icon: Film, href: "/admin/movies" },
  { label: "Celebrities", icon: Users, href: "/admin/celebrities" },
  { label: "News", icon: Newspaper, href: "/admin/news" },
  { label: "Blogs", icon: BookOpen, href: "/admin/blogs" },
  { label: "Polling", icon: BarChart3, href: "/admin/polls" },
  { label: "Awards", icon: Trophy, href: "/admin/awards" },
  { label: "Users", icon: UserCog, href: "/admin/users" },
  { label: "Moderation", icon: Shield, href: "/admin/moderation" },
  { label: "Feedback", icon: MessageSquare, href: "/admin/feedback" },
  { label: "Promotions", icon: Mail, href: "/admin/promotions" },
];

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-card border-r border-border z-40 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {!collapsed && (
            <Link to="/admin" className="font-display text-xl text-gold">
              Admin Panel
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                  isActive 
                    ? "bg-gold/20 text-gold" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <Link to="/">
            <Button variant="outline" className={cn("w-full", collapsed && "px-2")}>
              {collapsed ? "←" : "Back to Site"}
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  );
}
