'use client'

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { apiRequest } from "@/lib/queryClient";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  Search,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Filter,
} from "lucide-react";

interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  isRead: boolean;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
  };
}

const typeColors = {
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  warning: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const typeIcons = {
  info: Bell,
  warning: AlertCircle,
  success: CheckCircle,
  error: AlertCircle,
};

export default function Notifications() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  // For demo purposes, we'll show system-wide notifications for admin
  // In a real app, this would be user-specific notifications from /api/notifications/:userId
  const { data: notifications, isLoading } = useQuery<Notification[]>({
    queryKey: ["/api/notifications", 1], // Admin user ID
    queryFn: () => {
      // Demo data since we don't have real notifications yet
      return Promise.resolve([
        {
          id: 1,
          userId: 1,
          title: "New User Registration",
          message: "A new nanny has registered on the platform and requires verification",
          type: "info",
          isRead: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 2,
          userId: 1,
          title: "Payment Issue",
          message: "Multiple payment failures detected. Please review payment processing",
          type: "error",
          isRead: false,
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 3,
          userId: 1,
          title: "System Maintenance",
          message: "Scheduled maintenance completed successfully",
          type: "success",
          isRead: true,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 4,
          userId: 1,
          title: "High Traffic Alert",
          message: "Platform experiencing higher than normal traffic. Monitor performance",
          type: "warning",
          isRead: false,
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 5,
          userId: 1,
          title: "New Help Request",
          message: "5 new help center messages requiring admin attention",
          type: "info",
          isRead: false,
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        },
      ] as Notification[]);
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: number) =>
      // This would call the real API in production
      apiRequest(`/api/notifications/${notificationId}/read`, "PATCH"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications", 1] });
      toast.success("Success",{
        description: "Notification marked as read",
      });
    },
    onError: () => {
      toast.info("Info",{
        description: "Notification system is in demo mode",
      });
    },
  });

  const filteredNotifications = notifications?.filter((notification) => {
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === "all" || notification.type === typeFilter;
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "read" && notification.isRead) ||
      (statusFilter === "unread" && !notification.isRead);
    
    return matchesSearch && matchesType && matchesStatus;
  }) || [];

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  const handleMarkAsRead = (notificationId: number) => {
    markAsReadMutation.mutate(notificationId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} isMobile={isMobile}/>
      <div className={`flex-1 ${isMobile ? "" : "ml-72"}`}>
        <Header onMenuClick={() => setSidebarOpen(true)} isMobile={isMobile} />
        
        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground">
              Stay updated with system alerts and important messages
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{notifications?.length || 0}</p>
                  </div>
                  <Bell className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Unread</p>
                    <p className="text-2xl font-bold text-orange-600">{unreadCount}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Read</p>
                    <p className="text-2xl font-bold text-green-600">
                      {(notifications?.length || 0) - unreadCount}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 5 }, (_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))
            ) : filteredNotifications?.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No notifications found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || typeFilter !== "all" || statusFilter !== "all"
                      ? "Try adjusting your filters to see more notifications."
                      : "You're all caught up! No new notifications."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications?.map((notification) => {
                const IconComponent = typeIcons[notification.type];
                return (
                  <Card 
                    key={notification.id} 
                    className={`hover:shadow-md transition-shadow ${
                      !notification.isRead ? "border-l-4 border-l-blue-500" : ""
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-full ${
                          notification.type === "info" ? "bg-blue-100 dark:bg-blue-900" :
                          notification.type === "warning" ? "bg-orange-100 dark:bg-orange-900" :
                          notification.type === "success" ? "bg-green-100 dark:bg-green-900" :
                          "bg-red-100 dark:bg-red-900"
                        }`}>
                          <IconComponent className={`h-5 w-5 ${
                            notification.type === "info" ? "text-blue-600" :
                            notification.type === "warning" ? "text-orange-600" :
                            notification.type === "success" ? "text-green-600" :
                            "text-red-600"
                          }`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{notification.title}</h3>
                            <Badge className={typeColors[notification.type]}>{notification.type}</Badge>
                            {!notification.isRead && (
                              <Badge variant="secondary">New</Badge>
                            )}
                          </div>
                          
                          <p className="text-gray-700 dark:text-gray-300 mb-3">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(notification.createdAt).toLocaleDateString()} at{" "}
                              {new Date(notification.createdAt).toLocaleTimeString()}
                            </div>
                            
                            {!notification.isRead && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleMarkAsRead(notification.id)}
                                disabled={markAsReadMutation.isPending}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark as Read
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
