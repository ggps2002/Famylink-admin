import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NODE_ENV === "production" ? process.env.BACKEND_API_URL : "http://localhost:3000",
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem("persist:auth");

    if (authData) {
      const parsedAuthData = JSON.parse(authData);
      
      // Check if accessToken exists in parsedAuthData
      const accessToken = parsedAuthData?.accessToken?.split('"')[1];

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

