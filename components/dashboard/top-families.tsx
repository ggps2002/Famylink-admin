'use client'

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchTopUsersThunk } from "@/redux/slices/userDataSlice";
import Link from "next/link";

interface TopFamily {
  id: number;
  firstName: string;
  lastName: string;
  profileImage?: string;
  city?: string;
  state?: string;
  avgRating: number;
  reviewCount: number;
  activeJobs?: number;
}

export default function TopFamilies() {
   const { topFamilies, isLoading } = useSelector(
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
          <CardTitle className="text-lg font-semibold">Top Rated Families</CardTitle>
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

  if (!topFamilies || topFamilies.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Top Rated Families</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            No families found
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Top Rated Families</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topFamilies.map((family) => (
            <div key={family.id} className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage 
                  src={family.profileImage || undefined} 
                  alt={`${family.firstName} ${family.lastName}`}
                />
                <AvatarFallback>
                  {family.firstName[0]}{family.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  {family.firstName} {family.lastName}
                </p>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <div className="flex text-yellow-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(family.avgRating) ? "fill-current" : ""
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {family.avgRating.toFixed(1)}
                    </span>
                  </div>
                  {family.city && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3 mr-1" />
                      {family.city}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <Badge variant="outline" className="text-xs">
                  {family.activeJobs} jobs
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {family.reviewCount} reviews
                </span>
              </div>
            </div>
          ))}
        </div>

        <Link href="/Families">
        <Button variant="ghost" className="w-full mt-4">
          View All Families
        </Button>
        </Link>
      </CardContent>
    </Card>
  );
}