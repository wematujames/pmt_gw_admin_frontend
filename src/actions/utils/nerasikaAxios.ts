"use client";

import axios from "axios";

const apiReq = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "x-app": "admin"
  },
});

apiReq.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(
      process.env.NEXT_PUBLIC_API_AUTH_TOKEN ?? process.env.NEXT_PUBLIC_API_AUTH_TOKEN!
    );
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default apiReq;
