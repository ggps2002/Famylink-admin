"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchTopUsersThunk } from "@/redux/slices/userDataSlice";
import Link from "next/link";

interface TopNanny {
  id: number;
  firstName: string;
  lastName: string;
  profileImage?: string;
  hourlyRate?: string;
  avgRating: number;
  reviewCount: number;
}

export default function TopNannies() {
  const { topNannies, isLoading } = useSelector(
    (state: RootState) => state.userData
  );
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchTopUsersThunk());
  }, [dispatch]);
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Top Rated Nannies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!topNannies || topNannies.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Top Rated Nannies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            No nannies found
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Top Rated Nannies
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topNannies.map((nanny) => (
            <div key={nanny.id} className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={
                    nanny.profileImage || undefined
                  }
                  alt={`${nanny.firstName} ${nanny.lastName}`}
                />
                <AvatarFallback>{nanny.firstName?.[0] ?? ""}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  {nanny.firstName} {nanny.lastName}
                </p>
                <div className="flex items-center space-x-1">
                  <div className="flex text-yellow-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(nanny.avgRating) ? "fill-current" : ""
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {nanny.avgRating.toFixed(1)}
                  </span>
                </div>
              </div>
              <span className="text-sm font-medium text-green-600">
                {/* ${nanny.hourlyRate || "25"}/hr */}
              </span>
            </div>
          ))}
        </div>

        <Link href="/Nannies">
          <Button variant="ghost" className="w-full mt-4">
            View All Nannies
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
