"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import MetricsCards from "@/components/dashboard/metrics-cards";
import RevenueChart from "@/components/dashboard/revenue-chart";
import TopNannies from "@/components/dashboard/top-nannies";
import TopFamilies from "@/components/dashboard/top-families";
import RecentActivity from "@/components/dashboard/recent-activity";
import LocationStats from "@/components/dashboard/location-stats";
import QuickActions from "@/components/dashboard/quick-actions";
import USAMap from "@/components/dashboard/usa-map";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchTotalJobsCountThunk } from "@/redux/slices/jobSlice";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading } = useSelector((state: RootState) => state.auth);
 
  const router = useRouter();
  // Redirect if not logged in
  useEffect(() => {
    if (!user?._id && !isLoading) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    dispatch(fetchTotalJobsCountThunk());
  }, [dispatch]);

  if (!user?._id || isLoading) {
    return null; // Or a loading spinner
  }

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

        {/* Dashboard Content */}
        <main className="p-6 space-y-8 fade-in">
          {/* Welcome Section */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Welcome back, Admin!
            </h2>
            <p className="text-muted-foreground">
              Here's what's happening with your platform today.
            </p>
          </div>

          {/* Key Metrics */}
            <MetricsCards  />

          {/* Charts and Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <RevenueChart />
            </div>
          </div>

          {/* Top Users */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopNannies />
            <TopFamilies />
          </div>

          {/* Activity and Location */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentActivity />
            <USAMap />
          </div>

          {/* Quick Actions */}
          <QuickActions />
        </main>
      </div>
    </div>
  );
}
