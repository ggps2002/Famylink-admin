'use client'

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Users, Baby } from "lucide-react";

interface StateData {
  state: string;
  abbreviation: string;
  families: number;
  nannies: number;
  totalUsers: number;
}

interface USAMapProps {
  // No props needed as we'll fetch data internally
}

// SVG path data for US states (simplified for demo with better coverage)
const usStates = [
  { name: "California", abbreviation: "CA", path: "M 158 310 L 158 200 L 130 200 L 130 170 L 100 170 L 100 200 L 50 200 L 50 250 L 30 250 L 30 310 L 158 310 Z" },
  { name: "Texas", abbreviation: "TX", path: "M 300 350 L 450 350 L 450 280 L 400 280 L 400 250 L 350 250 L 350 280 L 300 280 Z" },
  { name: "Florida", abbreviation: "FL", path: "M 550 400 L 650 400 L 650 450 L 600 450 L 600 480 L 550 480 Z" },
  { name: "New York", abbreviation: "NY", path: "M 650 150 L 750 150 L 750 200 L 650 200 Z" },
  { name: "Pennsylvania", abbreviation: "PA", path: "M 600 180 L 720 180 L 720 220 L 600 220 Z" },
  { name: "Illinois", abbreviation: "IL", path: "M 450 200 L 500 200 L 500 280 L 450 280 Z" },
  { name: "Ohio", abbreviation: "OH", path: "M 520 190 L 580 190 L 580 250 L 520 250 Z" },
  { name: "Georgia", abbreviation: "GA", path: "M 580 280 L 620 280 L 620 350 L 580 350 Z" },
  { name: "North Carolina", abbreviation: "NC", path: "M 600 250 L 720 250 L 720 290 L 600 290 Z" },
  { name: "Michigan", abbreviation: "MI", path: "M 480 150 L 520 150 L 520 200 L 480 200 Z" },
  { name: "Washington", abbreviation: "WA", path: "M 80 80 L 160 80 L 160 140 L 80 140 Z" },
  { name: "Oregon", abbreviation: "OR", path: "M 80 140 L 160 140 L 160 200 L 80 200 Z" },
  { name: "Nevada", abbreviation: "NV", path: "M 160 170 L 200 170 L 200 270 L 160 270 Z" },
  { name: "Arizona", abbreviation: "AZ", path: "M 160 270 L 240 270 L 240 350 L 160 350 Z" },
  { name: "Utah", abbreviation: "UT", path: "M 200 170 L 260 170 L 260 270 L 200 270 Z" },
  { name: "Colorado", abbreviation: "CO", path: "M 260 200 L 340 200 L 340 280 L 260 280 Z" },
  { name: "New Mexico", abbreviation: "NM", path: "M 240 280 L 320 280 L 320 360 L 240 360 Z" },
  { name: "Wyoming", abbreviation: "WY", path: "M 260 150 L 340 150 L 340 200 L 260 200 Z" },
  { name: "Montana", abbreviation: "MT", path: "M 260 90 L 400 90 L 400 150 L 260 150 Z" },
  { name: "Idaho", abbreviation: "ID", path: "M 200 90 L 260 90 L 260 200 L 200 200 Z" },
  { name: "North Dakota", abbreviation: "ND", path: "M 400 90 L 480 90 L 480 150 L 400 150 Z" },
  { name: "South Dakota", abbreviation: "SD", path: "M 400 150 L 480 150 L 480 200 L 400 200 Z" },
  { name: "Nebraska", abbreviation: "NE", path: "M 340 200 L 450 200 L 450 250 L 340 250 Z" },
  { name: "Kansas", abbreviation: "KS", path: "M 340 250 L 450 250 L 450 300 L 340 300 Z" },
  { name: "Oklahoma", abbreviation: "OK", path: "M 340 300 L 450 300 L 450 350 L 340 350 Z" },
  { name: "Minnesota", abbreviation: "MN", path: "M 480 120 L 540 120 L 540 200 L 480 200 Z" },
  { name: "Iowa", abbreviation: "IA", path: "M 450 200 L 520 200 L 520 250 L 450 250 Z" },
  { name: "Missouri", abbreviation: "MO", path: "M 450 250 L 520 250 L 520 320 L 450 320 Z" },
  { name: "Arkansas", abbreviation: "AR", path: "M 450 320 L 520 320 L 520 370 L 450 370 Z" },
  { name: "Louisiana", abbreviation: "LA", path: "M 450 370 L 520 370 L 520 420 L 450 420 Z" },
  { name: "Wisconsin", abbreviation: "WI", path: "M 520 140 L 580 140 L 580 220 L 520 220 Z" },
  { name: "Indiana", abbreviation: "IN", path: "M 520 220 L 580 220 L 580 280 L 520 280 Z" },
  { name: "Kentucky", abbreviation: "KY", path: "M 520 280 L 600 280 L 600 320 L 520 320 Z" },
  { name: "Tennessee", abbreviation: "TN", path: "M 520 320 L 620 320 L 620 360 L 520 360 Z" },
  { name: "Mississippi", abbreviation: "MS", path: "M 520 360 L 580 360 L 580 420 L 520 420 Z" },
  { name: "Alabama", abbreviation: "AL", path: "M 580 320 L 620 320 L 620 400 L 580 400 Z" },
  { name: "South Carolina", abbreviation: "SC", path: "M 620 320 L 680 320 L 680 370 L 620 370 Z" },
  { name: "West Virginia", abbreviation: "WV", path: "M 580 250 L 640 250 L 640 300 L 580 300 Z" },
  { name: "Virginia", abbreviation: "VA", path: "M 640 250 L 720 250 L 720 300 L 640 300 Z" },
  { name: "Maryland", abbreviation: "MD", path: "M 680 220 L 720 220 L 720 250 L 680 250 Z" },
  { name: "Delaware", abbreviation: "DE", path: "M 720 220 L 740 220 L 740 260 L 720 260 Z" },
  { name: "New Jersey", abbreviation: "NJ", path: "M 720 180 L 750 180 L 750 220 L 720 220 Z" },
  { name: "Connecticut", abbreviation: "CT", path: "M 750 160 L 780 160 L 780 190 L 750 190 Z" },
  { name: "Rhode Island", abbreviation: "RI", path: "M 780 160 L 800 160 L 800 180 L 780 180 Z" },
  { name: "Massachusetts", abbreviation: "MA", path: "M 750 140 L 800 140 L 800 170 L 750 170 Z" },
  { name: "Vermont", abbreviation: "VT", path: "M 720 120 L 750 120 L 750 160 L 720 160 Z" },
  { name: "New Hampshire", abbreviation: "NH", path: "M 750 120 L 780 120 L 780 160 L 750 160 Z" },
  { name: "Maine", abbreviation: "ME", path: "M 780 100 L 800 100 L 800 160 L 780 160 Z" },
];

// Sample data for demonstration
const sampleData: StateData[] = [
  { state: "California", abbreviation: "CA", families: 45, nannies: 62, totalUsers: 107 },
  { state: "Texas", abbreviation: "TX", families: 38, nannies: 51, totalUsers: 89 },
  { state: "Florida", abbreviation: "FL", families: 28, nannies: 35, totalUsers: 63 },
  { state: "New York", abbreviation: "NY", families: 42, nannies: 58, totalUsers: 100 },
  { state: "Pennsylvania", abbreviation: "PA", families: 22, nannies: 29, totalUsers: 51 },
  { state: "Illinois", abbreviation: "IL", families: 25, nannies: 33, totalUsers: 58 },
  { state: "Ohio", abbreviation: "OH", families: 18, nannies: 24, totalUsers: 42 },
  { state: "Georgia", abbreviation: "GA", families: 20, nannies: 27, totalUsers: 47 },
  { state: "North Carolina", abbreviation: "NC", families: 15, nannies: 21, totalUsers: 36 },
  { state: "Michigan", abbreviation: "MI", families: 12, nannies: 16, totalUsers: 28 },
];

export default function USAMap({}: USAMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Fetch real geographic data
  const { data: geographicData, isLoading } = useQuery<StateData[]>({
    queryKey: ["/api/dashboard/geographic-data"],
  });

  // Use sample data as fallback if no real data is available
  const data = geographicData && geographicData.length > 0 ? geographicData : sampleData;

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const getStateData = (abbreviation: string) => {
    return data.find(d => d.abbreviation === abbreviation);
  };

  const getStateColor = (stateData: StateData | undefined) => {
    if (!stateData) return "#f3f4f6"; // gray-100
    const intensity = Math.min(stateData.totalUsers / 100, 1);
    const blue = Math.floor(255 - (intensity * 100));
    return `rgb(59, 130, ${blue})`; // blue gradient
  };

  const totalFamilies = data.reduce((sum, state) => sum + state.families, 0);
  const totalNannies = data.reduce((sum, state) => sum + state.nannies, 0);
  const totalUsers = data.reduce((sum, state) => sum + state.totalUsers, 0);

  if (isLoading) {
    return (
      <Card className="h-96">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Geographic Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-96">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Geographic Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalUsers}</div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{totalFamilies}</div>
            <div className="text-sm text-muted-foreground">Families</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{totalNannies}</div>
            <div className="text-sm text-muted-foreground">Nannies</div>
          </div>
        </div>
        
        <div className="relative">
          <svg
            viewBox="0 0 800 500"
            className="w-full h-64 border rounded-lg bg-gray-50 dark:bg-gray-800"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredState(null)}
          >
            {usStates.map((state) => {
              const stateData = getStateData(state.abbreviation);
              return (
                <path
                  key={state.abbreviation}
                  d={state.path}
                  fill={getStateColor(stateData)}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onMouseEnter={() => setHoveredState(state.abbreviation)}
                //   title={state.name}
                />
              );
            })}
          </svg>
          
          {hoveredState && (
            <div
              className="absolute z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-3 shadow-lg pointer-events-none"
              style={{
                left: mousePosition.x - 150,
                top: mousePosition.y - 100,
                transform: 'translate(-50%, -100%)',
              }}
            >
              {(() => {
                const stateData = getStateData(hoveredState);
                const stateName = usStates.find(s => s.abbreviation === hoveredState)?.name || hoveredState;
                return (
                  <div className="min-w-32">
                    <div className="font-semibold text-sm mb-2">{stateName}</div>
                    {stateData ? (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-green-600" />
                            Families
                          </span>
                          <Badge variant="secondary">{stateData.families}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1">
                            <Baby className="h-3 w-3 text-purple-600" />
                            Nannies
                          </span>
                          <Badge variant="secondary">{stateData.nannies}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs font-medium pt-1 border-t">
                          <span>Total Users</span>
                          <Badge>{stateData.totalUsers}</Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground">No data available</div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
        
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>Hover over states to see details</span>
          <div className="flex items-center gap-2">
            <span>Low</span>
            <div className="w-16 h-2 bg-gradient-to-r from-blue-100 to-blue-600 rounded"></div>
            <span>High</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}