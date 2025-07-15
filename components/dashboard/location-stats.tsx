import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { MapPin } from "lucide-react";

interface LocationStat {
  city: string;
  count: number;
}

export default function LocationStats() {
  const { data: locationStats, isLoading } = useQuery<LocationStat[]>({
    queryKey: ["/api/dashboard/location-stats"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Nannies by Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 bg-muted rounded-lg mb-4 flex items-center justify-center">
            <Skeleton className="w-12 h-12" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-2 w-20" />
                  <Skeleton className="h-4 w-6" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!locationStats || locationStats.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Nannies by Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            No location data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxCount = Math.max(...locationStats.map(stat => stat.count));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Nannies by Location</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Map Placeholder */}
        <div className="h-48 bg-muted rounded-lg mb-4 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Interactive Map</p>
          </div>
        </div>

        {/* Location Stats */}
        <div className="space-y-3">
          {locationStats.slice(0, 4).map((stat, index) => {
            const percentage = (stat.count / maxCount) * 100;
            
            return (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{stat.city}</span>
                <div className="flex items-center space-x-2">
                  <Progress 
                    value={percentage} 
                    className="w-20 h-2"
                  />
                  <span className="text-sm font-medium text-foreground w-8 text-right">
                    {stat.count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
