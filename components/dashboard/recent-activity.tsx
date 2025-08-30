import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { UserPlus, Briefcase, Star, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { ThunkDispatch, UnknownAction, Dispatch } from "@reduxjs/toolkit";
import { PersistPartial } from "redux-persist/es/persistReducer";
import { fetchSubscribersThunk } from "@/redux/slices/subscribersSlice";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

interface Activity {
  type: string;
  title: string;
  description: string;
  timestamp: string;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case "user_registered":
      return UserPlus;
    case "job_posted":
      return Briefcase;
    case "review":
      return Star;
    case "blog_published":
      return FileText;
    default:
      return UserPlus;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case "user_registered":
      return "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400";
    case "job_posted":
      return "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400";
    case "review":
      return "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400";
    case "blog_published":
      return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400";
    default:
      return "bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

export default function RecentActivity() {
  const limit = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const { emailList, isLoading, paginationSubscribers } = useSelector(
    (state: RootState) => state.subscribers
  );
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchSubscribersThunk({ page: currentPage, limit: limit }));
  }, [dispatch, currentPage]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              Newsletter Subscribers
            </CardTitle>
            <Skeleton className="h-8 w-16" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!emailList || emailList.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              Newsletter Subscribers
            </CardTitle>
            {/* <Button variant="ghost" size="sm">
              View All
            </Button> */}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            No Subscribers
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Newsletter Subscribers
          </CardTitle>
          {/* <Button variant="ghost" size="sm">
            View All
          </Button> */}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {emailList.map((sub, index) => {
            return (
              <div key={index} className="activity-item">
                <div className="flex-1">
                  <p className="text-sm text-foreground">{sub.email}</p>
                </div>
              </div>
            );
          })}
        </div>
        {paginationSubscribers &&
          paginationSubscribers.totalPages &&
          paginationSubscribers.totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                  />
                </PaginationItem>

                {Array.from(
                  { length: paginationSubscribers.totalPages || 0 },
                  (_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === i + 1}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(i + 1);
                        }}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                {paginationSubscribers.totalPages &&
                  currentPage < paginationSubscribers.totalPages && (
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (
                            paginationSubscribers?.currentPage <
                            paginationSubscribers.totalPages
                          )
                            setCurrentPage(currentPage + 1);
                        }}
                      />
                    </PaginationItem>
                  )}
              </PaginationContent>
            </Pagination>
          )}
      </CardContent>
    </Card>
  );
}
