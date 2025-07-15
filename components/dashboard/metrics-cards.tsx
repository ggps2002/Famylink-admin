"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { FileText, Home, Baby, DollarSign, TrendingUp } from "lucide-react";
import { fetchTotalJobsCountThunk } from "@/redux/slices/jobSlice";
import { fetchTotalUsersPerTypeCountThunk } from "@/redux/slices/userDataSlice";
import { fetchThisMonthRevenue } from "@/redux/slices/revenueSlice";

interface MetricsData {
  totalUsers: number;
  totalNannies: number;
  totalFamilies: number;
  totalJobs: number;
  activeJobs: number;
  monthlyRevenue: string;
  growthRate: string;
}

export default function MetricsCards() {
  const { totalJobs, isLoading, error } = useSelector(
    (state: RootState) => state.jobs
  );
  const { totalFamilies, totalNannies } = useSelector((state: RootState) => state.userData)
  const { revenueThisMonth } = useSelector((state: RootState) => state.revenue)
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchTotalJobsCountThunk());
    dispatch(fetchTotalUsersPerTypeCountThunk());
    dispatch(fetchThisMonthRevenue());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="h-12 w-12 rounded-lg" />
            </div>
            <Skeleton className="h-10 w-full mb-2" />
            <div className="flex items-center">
              <Skeleton className="h-4 w-12 mr-2" />
              <Skeleton className="h-4 w-20" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!totalJobs) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="text-center text-muted-foreground">
            Unable to load metrics
          </div>
        </Card>
      </div>
    );
  }

  const metricCards = [
    {
      title: "Total Listings",
      value: totalJobs || 0,
      icon: FileText,
      color: "blue",
      change: "+12.5%",
      description: "vs last month",
    },
    {
      title: "Total Families",
      value: totalFamilies || 0,
      icon: Home,
      color: "green",
      change: "+8.2%",
      description: "vs last month",
    },
    {
      title: "Total Nannies",
      value: totalNannies || 0,
      icon: Baby,
      color: "purple",
      change: "+15.3%",
      description: "vs last month",
    },
    {
      title: "Monthly Revenue",
      value: `$${revenueThisMonth ?? 0}`,
      icon: DollarSign,
      color: "yellow",
      change: `+${"0"}%`,
      description: "vs last month",
    },
  ];

  const colorClasses = {
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    green:
      "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    purple:
      "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    yellow:
      "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricCards.map((card, index) => (
        <Card key={index} className="metric-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {card.value}
                </p>
              </div>
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  colorClasses[card.color as keyof typeof colorClasses]
                }`}
              >
                <card.icon className="h-6 w-6" />
              </div>
            </div>
            <div className="flex items-center text-sm">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">{card.change}</span>
              <span className="text-muted-foreground ml-1">
                {card.description}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
