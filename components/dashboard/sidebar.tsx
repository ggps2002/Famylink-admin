import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Users,
  Baby,
  Home,
  Briefcase,
  FileText,
  MessageSquare,
  HelpCircle,
  Bell,
  ChevronUp,
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  isMobile: boolean;
}

export default function Sidebar({ open, onClose, isMobile }: SidebarProps) {
const pathname = usePathname();


  const navigationItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/",
      isActive: pathname === "/" || pathname === "/dashboard",
    },
  ];

  const userManagementItems = [
    // {
    //   title: "All Users",
    //   icon: Users,
    //   href: "/Users",
    //   badge: "245",
    //   isActive: pathname === "/users",
    // },
    {
      title: "Nannies",
      icon: Baby,
      href: "/Nannies",
      badge: "88",
      badgeVariant: "secondary" as const,
      isActive: pathname === "/nannies",
    },
    {
      title: "Families",
      icon: Home,
      href: "/Families",
      badge: "99",
      badgeVariant: "secondary" as const,
      isActive: pathname === "/families",
    },
  ];

  const contentItems = [
    {
      title: "Job Listings",
      icon: Briefcase,
      href: "/Jobs",
      badge: "99",
      badgeVariant: "outline" as const,
      isActive: pathname === "/jobs",
    },
    {
      title: "Blogs",
      icon: FileText,
      href: "/Blogs",
      isActive: pathname === "/blogs",
    },
    {
      title: "Community",
      icon: MessageSquare,
      href: "/Community",
      badge: "12",
      badgeVariant: "destructive" as const,
      isActive: pathname === "/community",
    },
  ];

  const supportItems = [
    {
      title: "Help Center",
      icon: HelpCircle,
      href: "/Help",
      isActive: pathname === "/help",
    },
    {
      title: "Notifications",
      icon: Bell,
      href: "/Notifications",
      badge: "5",
      badgeVariant: "destructive" as const,
      isActive: pathname === "/notifications",
    },
  ];

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full w-72 bg-sidebar border-r border-sidebar-border z-50 flex flex-col transition-transform duration-300",
        isMobile ? (open ? "translate-x-0" : "-translate-x-full") : "translate-x-0"
      )}
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">F</span>
          </div>
          <span className="text-xl font-bold text-foreground">FAMYLINK</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* Main Navigation */}
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "sidebar-nav-item",
                  item.isActive && "active"
                )}
                onClick={isMobile ? onClose : undefined}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* User Management */}
        <div>
          <div className="px-3 mb-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              User Management
            </span>
          </div>
          <div className="space-y-1">
            {userManagementItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "sidebar-nav-item",
                    item.isActive && "active"
                  )}
                  onClick={isMobile ? onClose : undefined}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <Badge variant={item.badgeVariant || "default"} className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Content */}
        <div>
          <div className="px-3 mb-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Content
            </span>
          </div>
          <div className="space-y-1">
            {contentItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "sidebar-nav-item",
                    item.isActive && "active"
                  )}
                  onClick={isMobile ? onClose : undefined}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <Badge variant={item.badgeVariant || "default"} className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Support */}
        <div>
          <div className="px-3 mb-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Support
            </span>
          </div>
          <div className="space-y-1">
            {supportItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "sidebar-nav-item",
                    item.isActive && "active"
                  )}
                  onClick={isMobile ? onClose : undefined}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <Badge variant={item.badgeVariant || "default"} className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent cursor-pointer group">
          <Avatar className="w-10 h-10">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150" />
            <AvatarFallback>AU</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-foreground truncate">Admin User</div>
            <div className="text-sm text-muted-foreground">Administrator</div>
          </div>
          <ChevronUp className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </div>
      </div>
    </div>
  );
}
