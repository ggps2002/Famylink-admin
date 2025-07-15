// lib/queryClient.ts
import { QueryFunction, DefaultOptions } from "@tanstack/react-query";

// Utility to throw if the response is not OK
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Generic API request handler
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include", // For sending cookies
  });

  await throwIfResNotOk(res);
  return res;
}

// Defines how to handle unauthorized responses
type UnauthorizedBehavior = "returnNull" | "throw";

// Creates a default fetcher for useQuery
export const getQueryFn =
  <T>({ on401 }: { on401: UnauthorizedBehavior }): QueryFunction<T> =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (on401 === "returnNull" && res.status === 401) {
      return null as T;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

// Default options for the QueryClient
export const defaultQueryOptions: DefaultOptions = {
  queries: {
    queryFn: getQueryFn({ on401: "throw" }),
    refetchInterval: false as const, // ✅ must be 'false as const'
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    retry: false,
  },
  mutations: {
    retry: false,
  },
};
