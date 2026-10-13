import { Inter } from "next/font/google";

// Self-hosted at build time; the antd theme reads it through --font-inter.
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});
