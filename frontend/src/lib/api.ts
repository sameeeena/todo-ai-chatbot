import axios from "axios";
import { authClient } from "./auth-client";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
});

api.interceptors.request.use(async (config) => {
  const session = await authClient.getSession();
  if (session?.data?.session?.token) {
    config.headers.Authorization = `Bearer ${session.data.session.token}`;
  }
  return config;
});

export default api;
