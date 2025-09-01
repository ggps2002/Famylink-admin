"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  MapPin,
  Mail,
  Phone,
  Star,
  DollarSign,
  Eye,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNanniesThunk } from "@/redux/slices/userDataSlice";
import { RootState, AppDispatch } from "@/redux/store";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Nanny {
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

export default function Nannies() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();
  const limit = 10;
  const { nannies, isLoading, paginationNanny } = useSelector(
    (state: RootState) => state.userData
  );
  const dispatch = useDispatch<AppDispatch>();
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    dispatch(fetchNanniesThunk({ page: currentPage, limit: limit }));
  }, [dispatch, currentPage]);

  // const { data: allUsers, isLoading } = useQuery<Nanny[]>({
  //   queryKey: ["/api/users"],
  //   queryFn: async () =>
  //     new Promise<Nanny[]>((resolve) =>
  //       setTimeout(() => {
  //         resolve([
  //           {
  //             id: 1,
  //             username: "nanny1",
  //             email: "nanny1@example.com",
  //             firstName: "Alice",
  //             lastName: "Smith",
  //             role: "nanny",
  //             profileImage: "",
  //             phone: "123-456-7890",
  //             city: "New York",
  //             state: "NY",
  //             hourlyRate: "25",
  //             bio: "Experienced nanny with a passion for kids.",
  //             isVerifiedEmail: true,
  //             isVerifiedID: true,
  //             isActive: true,
  //             createdAt: new Date().toISOString(),
  //           },
  //           {
  //             id: 2,
  //             username: "nanny2",
  //             email: "nanny2@example.com",
  //             firstName: "Emma",
  //             lastName: "Johnson",
  //             role: "nanny",
  //             isVerifiedEmail: true,
  //             isVerifiedID: false,
  //             isActive: true,
  //             createdAt: new Date().toISOString(),
  //           },
  //         ]);
  //       }, 500)
  //     ),
  // });

  const filteredNannies = nannies?.filter(
    (nanny) =>
      nanny.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nanny.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nanny.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (nanny.city &&
        nanny.city.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
              <h2 className="text-2xl font-bold text-foreground">Nannies</h2>
              <p className="text-muted-foreground">
                Manage and view all registered nannies
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {paginationNanny?.totalRecords} Nannies
              </Badge>
            </div>
          </div>

          {/* Search */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search nannies by name, email, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Nannies Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <Skeleton className="w-16 h-16 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredNannies?.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-muted-foreground">
                  {searchQuery
                    ? "No nannies found matching your search"
                    : "No nannies registered yet"}
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNannies?.map((nanny) => (
                  <Card
                    key={nanny.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={nanny.profileImage} />
                          <AvatarFallback className="text-lg">
                            {nanny.firstName[0]}
                            {nanny.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground text-lg">
                            {nanny.firstName} {nanny.lastName}
                          </h3>
                          <div className="flex items-start space-y-2 flex-wrap gap-2">
                            <Badge
                              variant={nanny.isActive ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {nanny.isActive ? "Active" : "Inactive"}
                            </Badge>
                            {nanny.isVerifiedEmail && (
                              <Badge
                                variant="outline"
                                className="text-green-600 text-xs"
                              >
                                Verified Email
                              </Badge>
                            )}
                            {nanny.isVerifiedID && (
                              <Badge
                                variant="outline"
                                className="text-green-600 text-xs"
                              >
                                Verified ID
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Mail className="w-4 h-4 mr-2" />
                          {nanny.email}
                        </div>
                        {nanny.phone && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Phone className="w-4 h-4 mr-2" />
                            {nanny.phone}
                          </div>
                        )}
                        {nanny.city && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4 mr-2" />
                            {nanny.city}, {nanny.state}
                          </div>
                        )}
                        {nanny.hourlyRate && (
                          <div className="flex items-center text-sm font-medium text-green-600">
                            <DollarSign className="w-4 h-4 mr-2" />$
                            {nanny.hourlyRate}/hour
                          </div>
                        )}
                      </div>

                      {nanny.bio && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {nanny.bio}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Star className="w-4 h-4 mr-1 text-yellow-400" />
                          <span>
                            {nanny.avgRating} ({nanny.totalReviews} reviews)
                          </span>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {paginationNanny &&
                paginationNanny.totalPages &&
                paginationNanny.totalPages > 1 && (
                  <Pagination>
                    <PaginationContent>
                      {/* Previous button */}
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1)
                              setCurrentPage(currentPage - 1);
                          }}
                        />
                      </PaginationItem>

                      {/* Page numbers with ellipsis */}
                      {(() => {
                        const totalPages = paginationNanny.totalPages;
                        const pages = [];
                        const maxVisible = 3;

                        let start = Math.max(1, currentPage - 1);
                        let end = Math.min(totalPages, currentPage + 1);

                        if (currentPage <= 2) {
                          start = 1;
                          end = Math.min(totalPages, maxVisible);
                        } else if (currentPage >= totalPages - 1) {
                          start = Math.max(1, totalPages - (maxVisible - 1));
                          end = totalPages;
                        }

                        // First page + ellipsis
                        if (start > 1) {
                          pages.push(
                            <PaginationItem key={1}>
                              <PaginationLink
                                href="#"
                                isActive={currentPage === 1}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setCurrentPage(1);
                                }}
                              >
                                1
                              </PaginationLink>
                            </PaginationItem>
                          );
                          if (start > 2) {
                            pages.push(
                              <PaginationItem key="start-ellipsis">
                                <span className="px-2">...</span>
                              </PaginationItem>
                            );
                          }
                        }

                        // Visible pages
                        for (let i = start; i <= end; i++) {
                          pages.push(
                            <PaginationItem key={i}>
                              <PaginationLink
                                href="#"
                                isActive={currentPage === i}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setCurrentPage(i);
                                }}
                              >
                                {i}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }

                        // Last page + ellipsis
                        if (end < totalPages) {
                          if (end < totalPages - 1) {
                            pages.push(
                              <PaginationItem key="end-ellipsis">
                                <span className="px-2">...</span>
                              </PaginationItem>
                            );
                          }
                          pages.push(
                            <PaginationItem key={totalPages}>
                              <PaginationLink
                                href="#"
                                isActive={currentPage === totalPages}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setCurrentPage(totalPages);
                                }}
                              >
                                {totalPages}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }

                        return pages;
                      })()}

                      {/* Next button */}
                      {paginationNanny.totalPages &&
                        currentPage < paginationNanny.totalPages && (
                          <PaginationItem>
                            <PaginationNext
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (currentPage < paginationNanny.totalPages) {
                                  setCurrentPage(currentPage + 1);
                                }
                              }}
                            />
                          </PaginationItem>
                        )}
                    </PaginationContent>
                  </Pagination>
                )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
