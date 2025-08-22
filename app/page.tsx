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
import { api } from "@/lib/Config/api";
import { logout, refreshTokenThunk } from "@/redux/slices/authSlice";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading, accessTokenExpiry } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    const checkTokenOnLoad = async () => {
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      if (accessTokenExpiry && currentTime >= accessTokenExpiry) {
        try {
          const { status } = await dispatch(refreshTokenThunk()).unwrap();
          if (status !== 200) {
            // If refresh fails, log out and redirect to login
            await dispatch(logout());
            router.push("/login");
          }
        } catch {
          // If refresh fails, log out and redirect to login
          await dispatch(logout());
           router.push("/login");
        }
      }
    };

    checkTokenOnLoad(); // Check token validity on component mount
  }, [accessTokenExpiry, dispatch, router]);

  useEffect(() => {
    let refreshTimeout : any;

    const setupTokenRefresh = () => {
      if (!accessTokenExpiry) return;

      const currentTime = Math.floor(Date.now() / 1000);
      const timeLeft = accessTokenExpiry - currentTime;

      if (timeLeft > 60) {
        const refreshTime = (timeLeft - 60) * 1000;
        refreshTimeout = setTimeout(async () => {
          try {
            const { status } = await dispatch(refreshTokenThunk()).unwrap();
            if (status !== 200) {
              await dispatch(logout());
               router.push("/login");
            } else {
              setupTokenRefresh();
            }
          } catch {
            await dispatch(logout());
             router.push("/login");
          }
        }, refreshTime);
      }
    };

    setupTokenRefresh();

    return () => clearTimeout(refreshTimeout);
  }, [accessTokenExpiry, dispatch, router]);

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const { status } = await dispatch(refreshTokenThunk()).unwrap();
            if (status === 200) {
              return api(originalRequest);
            } else {
              await dispatch(logout());
                 router.push("/login");
            }
          } catch {
            await dispatch(logout());
              router.push("/login");
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [dispatch, router]);
 
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
