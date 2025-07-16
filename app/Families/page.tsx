"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { apiRequest } from "@/lib/queryClient";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Filter,
  UserPlus,
  Edit,
  Trash2,
  MapPin,
  Mail,
  Phone,
  Star,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFamiliesThunk } from "@/redux/slices/userDataSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { withAuth } from "@/lib/authWrapper";

interface Parents {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  profileImage?: string;
  phone?: string;
  city?: string;
  state?: string;
  hourlyRate?: string;
  bio?: string;
  isVerifiedEmail: boolean;
  isVerifiedID: boolean;
  isActive: boolean;
  createdAt: string;
  avgRating: number;
  totalReviews: number;
}

function Users() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const { families, isLoading, paginationFamily } = useSelector(
    (state: RootState) => state.userData
  );
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchFamiliesThunk());
  }, [dispatch]);

  const filteredUsers =
    families?.filter((user) => {
      const matchesSearch =
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());


      return matchesSearch;
    }) || [];

  const handleDeleteUser = (userId: number) => {
    setDeleteUserId(userId);
  };

  // const confirmDelete = () => {
  //   if (deleteUserId) {
  //     deleteUserMutation.mutate(deleteUserId);
  //   }
  // };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "nanny":
        return "default";
      case "family":
        return "secondary";
      case "admin":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
      />

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} isMobile={isMobile} />

        {/* Page Content */}
        <main className="p-6 space-y-6 fade-in">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Families</h2>
              <p className="text-muted-foreground">
                Manage and view all registered families
              </p>
            </div>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users List */}
          <Card>
            <CardHeader>
              <CardTitle>Users ({filteredUsers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-4 p-4 border rounded-lg"
                    >
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-48 mb-2" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))}
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No users found matching your criteria
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={user.profileImage} />
                        <AvatarFallback>
                          {user.firstName[0]}
                          {user.lastName[0]}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-foreground">
                            {user.firstName} {user.lastName}
                          </h3>
                          <Badge variant={getRoleBadgeVariant(user.role)}>
                            {user.role}
                          </Badge>
                          <div className="flex items-start space-y-2 flex-wrap gap-2">
                            <Badge
                              variant={user.isActive ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {user.isActive ? "Active" : "Inactive"}
                            </Badge>
                            {user.isVerifiedEmail && (
                              <Badge
                                variant="outline"
                                className="text-green-600 text-xs"
                              >
                                Verified Email
                              </Badge>
                            )}
                            {user.isVerifiedID && (
                              <Badge
                                variant="outline"
                                className="text-green-600 text-xs"
                              >
                                Verified ID
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {user.phone}
                            </div>
                          )}
                          {user.city && (
                            <div className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {user.city}, {user.state}
                            </div>
                          )}
                          {user.hourlyRate && (
                            <div className="flex items-center">
                              <span className="font-medium text-green-600">
                                ${user.hourlyRate}/hr
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteUserId}
        onOpenChange={() => setDeleteUserId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => console.log("delete")}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default withAuth(Users)
