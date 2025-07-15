"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchMonthlyRevenueThunk } from "@/redux/slices/revenueSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

const mockRevenueData = [
  { name: "Jan", revenue: 4000, growth: 2400 },
  { name: "Feb", revenue: 3000, growth: 1398 },
  { name: "Mar", revenue: 2000, growth: 9800 },
  { name: "Apr", revenue: 2780, growth: 3908 },
  { name: "May", revenue: 1890, growth: 4800 },
  { name: "Jun", revenue: 2390, growth: 3800 },
  { name: "Jul", revenue: 3490, growth: 4300 },
  { name: "Aug", revenue: 4000, growth: 2400 },
  { name: "Sep", revenue: 3000, growth: 1398 },
  { name: "Oct", revenue: 2000, growth: 9800 },
  { name: "Nov", revenue: 2780, growth: 3908 },
  { name: "Dec", revenue: 1890, growth: 4800 },
];

export default function RevenueChart() {
  // const [period, setPeriod] = useState<"monthly" | "weekly" | "daily">(
  //   "monthly"
  // );
  const { revenueData } = useSelector((state: RootState) => state.revenue);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchMonthlyRevenueThunk());
  }, [dispatch]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Monthly Revenue Overview
          </CardTitle>
          {/* <div className="flex space-x-2">
            <Button
              variant={period === "monthly" ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod("monthly")}
            >
              Monthly
            </Button>
            <Button
              variant={period === "weekly" ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod("weekly")}
            >
              Weekly
            </Button>
            <Button
              variant={period === "daily" ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod("daily")}
            >
              Daily
            </Button>
          </div> */}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData ?? []}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="name"
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis className="text-xs" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                activeDot={{
                  r: 6,
                  stroke: "hsl(var(--primary))",
                  strokeWidth: 2,
                }}
              />
              <Line
                type="monotone"
                dataKey="growth"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                strokeOpacity={0.4}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
