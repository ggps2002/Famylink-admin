'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // ✅ App Router
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchTotalJobsCountThunk } from "@/redux/slices/jobSlice";

export function withAuth<P>(
  WrappedComponent: React.ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { user, isLoading } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
      if (!user?._id && !isLoading) {
        router.push("/login");
      }
    }, [user, isLoading, router]);

    useEffect(() => {
      dispatch(fetchTotalJobsCountThunk());
    }, [dispatch]);

    if (!user?._id || isLoading) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}

